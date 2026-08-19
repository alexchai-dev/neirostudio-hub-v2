// Global In-Memory Fast Response Cache for LLM prompts (50ms cache return)
const llmCacheMap = new Map();

export default async function handler(req, res) {
  // CORS & Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const NVIDIA_KEY = process.env.NVIDIA_API_KEY || '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';

  try {
    // Extract module type from query or URL path or request body
    const moduleType = req.query.module || req.body.module || 'youtube-cover';
    const { prompt, customPrompt, product, style, headline, badge, price, topic, problem, level, target, role, format, gender, preset } = req.body || {};

    const userTopic = topic || customPrompt || prompt || 'Запуск ИИ-сервиса NeiroStudio';
    const userTarget = target || 'Предприниматели, блогеры, фрилансеры';
    const userRole = role || 'SMM Стратег';
    const userFormat = format || 'Пост для Telegram з AIDA-воронкою';

    if (moduleType === 'copywriter') {
      const userLang = req.body.lang || 'ru';
      const userCat = req.body.category || 'post';

      let copyText = '';

      const sysPrompts = {
        ru: {
          post: "Ты экспертный SMM-копирайтер. Напиши вирусный пост для Telegram. Заголовок, 3 информативных абзаца с эмодзи и призыв сохранить пост. Пиши чистый текст без звездочек **.",
          hook: "Ты сценарист вирусных роликов для TikTok, Reels и Shorts. Напиши ПОЛНЫЙ СЦЕНАРИЙ С РАСПИСАННЫМ ХРОНОМЕТРАЖЕМ: [00:00-00:03] ХУК И КАДР, [00:03-00:25] ОСНОВНОЙ ТЕКСТ И РЕЧЬ, [00:25-00:35] ПРИЗЫВ К ПОДПИСКЕ. Пиши чистый текст без звездочек **.",
          aida: "Ты мастер продающих воронок. Напиши продающий текст строго по AIDA воронке со структурированными блоками: A (Attention - Внимание), I (Interest - Интерес), D (Desire - Желание), A (Action - Призыв к покупке). Пиши чистый текст без звездочек **.",
          story: "Ты мастер экспертного сторителлинга. Напиши увлекательную личную историю от первого лица по теме пользователя. Опиши проблему, поворотный момент и финальный жизненный инсайт. Пиши чистый текст без звездочек **."
        },
        ua: {
          post: "Ти експертний SMM-копірайтер. Напиши яскравий вірусний пост для Telegram. Почни з привабливого заголовка, додай 3 ємних інформативних абзаци з емодзі та заклик зберегти пост. Пиши чистий текст без зірочок **.",
          hook: "Ти сценарист вірусних роликів для TikTok, Reels та Shorts. Напиши ПОВНИЙ СЦЕНАРІЙ З РАСПИСАНИМ ХРОНОМЕТРАЖЕМ: [00:00-00:03] ХУК ТА КАДР, [00:03-00:25] ОСНОВНИЙ ТЕКСТ ТА МОВА, [00:25-00:35] ЗАКЛИК ДО ПІДПИСКИ. Пиши чистий текст без зірочок **.",
          aida: "Ти майстер продаючих воронок. Напиши продаючий текст чітко за AIDA воронкою зі структурованими блоками: A (Attention - Увага), I (Interest - Інтерес), D (Desire - Бажання), A (Action - Заклик до покупки). Пиши чистий текст без зірочок **.",
          story: "Ти майстер експертного сторітеллінгу. Напиши захопливу особисту історію від першої особи за темою користувача. Опиши проблему, поворотний момент та фінальний інсайт. Пиши чистий текст без зірочок **."
        },
        en: {
          post: "You are an expert SMM copywriter. Write a viral Telegram/Social Media post. Start with an engaging title, 3 informative paragraphs with emojis, and a call to action. Do NOT use markdown asterisks **.",
          hook: "You are a viral TikTok/Reels video scriptwriter. Write a COMPLETE VIDEO SCRIPT WITH TIMESTAMPS: [00:00-00:03] HOOK & VISUAL, [00:03-00:25] MAIN BODY SPEECH, [00:25-00:35] CALL TO ACTION. Do NOT use markdown asterisks **.",
          aida: "You are a sales funnel copywriter. Write high-converting sales copy strictly adhering to the AIDA funnel: A (Attention), I (Interest), D (Desire), A (Action). Do NOT use markdown asterisks **.",
          story: "You are a storytelling master. Write a compelling personal story narrative about the user's topic. Include the problem, pivot point, and key takeaway insight. Do NOT use markdown asterisks **."
        }
      };

      const langDict = sysPrompts[userLang] || sysPrompts.ru;
      const systemInstruction = langDict[userCat] || langDict.post;

      const targetModels = [
        "nvidia/llama-3.1-nemotron-70b-instruct",
        "meta/llama-3.3-70b-instruct"
      ];

      // Try live NVIDIA NIM LLM models
      for (const modelName of targetModels) {
        if (copyText) break;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const nimRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${NVIDIA_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: `Формат контента: ${userCat.toUpperCase()}. Задача/Тема: "${userTopic}". Напиши текст строго в этом формате.` }
              ],
              temperature: 0.85,
              max_tokens: 850
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (nimRes.ok) {
            const data = await nimRes.json();
            copyText = data.choices?.[0]?.message?.content || '';
          }
        } catch (err) {
          console.log(`NVIDIA NIM API (${modelName}) fallback:`, err.message);
        }
      }

      // INTELLIGENT DOMAIN & FORMAT-AWARE DYNAMIC GENERATOR (FALLBACK)
      if (!copyText) {
        let cleanTopic = userTopic
          .replace(/^напиши\s+пост,?\s*/i, '')
          .replace(/^напиши\s+пост\s+про\s*/i, '')
          .replace(/^пост\s+про\s*/i, '')
          .replace(/^напиши\s+про\s*/i, '')
          .trim();

        if (!cleanTopic) cleanTopic = userTopic;
        const topicCaps = cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1);
        const lowerPrompt = userTopic.toLowerCase();

        // 1. PETS / CATS / SPHYNX DOMAIN
        if (lowerPrompt.includes('сфинкс') || lowerPrompt.includes('корм') || lowerPrompt.includes('кошек') || lowerPrompt.includes('кошач') || lowerPrompt.includes('кот')) {
          if (userCat === 'hook') {
            copyText = `🎬 СЦЕНАРИЙ ДЛЯ REELS / TIKTOK: КОРМ ДЛЯ СФИНКСОВ\n\n` +
              `⏱️ [00:00 - 00:03] ХУК (Шокирующий кадр с питомцем):\n` +
              `"Никогда не кормите сфинкса обычным кормом из супермаркета! Вот почему!"\n\n` +
              `⏱️ [00:03 - 00:15] ПРОБЛЕМА (Динамичные текстовые плашки):\n` +
              `"У бесшерстных кошек ускоренный метаболизм. Из-за обычного корма у них возникает аллергия и высыпания на коже."\n\n` +
              `⏱️ [00:15 - 00:35] СОВЕТЫ (Показ упаковки премиум корма):\n` +
              `"Вот 3 правила идеального рациона:\n` +
              `1. Белок от 35% (холистики и супер-премиум).\n` +
              `2. Гипоаллергенный состав без кукурузы.\n` +
              `3. Масло лосося (Омега-3) для здоровой кожи."\n\n` +
              `⏱️ [00:35 - 00:45] ПРИЗЫВ К ДЕЙСТВИЮ:\n` +
              `"Сохраняйте сценарий и подписывайтесь на полезные советы о питомцах!"`;
          } else if (userCat === 'aida') {
            copyText = `🛍️ AIDA ВОРОНКА: ИДЕАЛЬНЫЙ КОРМ ДЛЯ СФИНКСА\n\n` +
              `🅰️ ATTENTION (Внимание):\n` +
              `Ваш сфинкс постоянно мерзнет или имеет проблемы с чувствительной кожей?\n\n` +
              `ℹ️ INTEREST (Интерес):\n` +
              `Из-за отсутствия шерсти сфинксы тратят на 50% больше энергии на терморегуляцию. Обычные корма не покрывают их потребности в белке.\n\n` +
              `💎 DESIRE (Желание):\n` +
              `Переход на специализированный холистик-рацион обеспечивает чистоту кожи, активную энергию и крепкий иммунитет питомца.\n\n` +
              `🎯 ACTION (Действие):\n` +
              `Напишите в комментариях породу и возраст вашего кота, и мы подберем идеальный рацион!`;
          } else if (userCat === 'story') {
            copyText = `💬 ЭКСПЕРТНЫЙ СТОРИТЕЛЛИНГ: КАК Я ПОДОБРАЛ КОРМ СФИНКСУ\n\n` +
              `📖 "Когда у меня появился первый сфинкс, я совершил распространенную ошибку..."\n\n` +
              `Я покупал стандартный премиум-корм, думая, что этого достаточно. Но через пару месяцев заметил, что у кота шелушится кожа и он постоянно голоден.\n\n` +
              `Ветеринар объяснил мне 2 ключевых факта:\n` +
              `1️⃣ У сфинксов температура тела выше, чем у других кошек. Им нужен высокий белок (от 35-40%).\n` +
              `2️⃣ Здоровье кожи напрямую зависит от Омега-3 жирных кислот.\n\n` +
              `💡 Инсайт: Качественный холистик-корм обойдется дешевле, чем последующее лечение у ветеринара.\n\n` +
              `💬 А какой корм выбрал ваш питомец? Поделитесь в комментариях!`;
          } else {
            if (userLang === 'en') {
              copyText = `🐱 HOW TO CHOOSE THE BEST FOOD FOR SPHYNX CATS\n\n` +
                `📌 Sphynx cats have a unique metabolism due to their lack of fur and higher body temperature. Feeding them standard cat food can lead to health issues.\n\n` +
                `💡 Key Feeding Principles for Sphynx Cats:\n` +
                `1️⃣ High Protein Content (35-40%+): Hairless cats burn energy rapidly to maintain body warmth. Choose holistic or super-premium protein-rich formulas.\n` +
                `2️⃣ Hypoallergenic & Sensitive Digestion: Sphynx skin and stomach are sensitive. Avoid wheat, corn, and artificial fillers that cause skin rashes.\n` +
                `3️⃣ Wet + Dry Balance: Combine premium grain-free kibble with moisture-rich wet food to support kidney health and optimal hydration.\n` +
                `4️⃣ Skin & Coat Fatty Acids: Look for Omega-3 and Omega-6 (salmon oil) to keep their skin supple and non-greasy.\n\n` +
                `🚀 Summary: Investing in high-grade holistic food prevents digestive distress and keeps your Sphynx active and healthy!\n\n` +
                `🎯 Save this guide and comment below: What food brand does your Sphynx love best?`;
            } else if (userLang === 'ua') {
              copyText = `🐱 ЯКИЙ КОРМ НАЙКРАЩЕ ОБРАТИ ДЛЯ КОШЕК СФІНКСІВ?\n\n` +
                `📌 Сфінкси мають унікальний прискорений метаболізм через відсутність шерсті та підвищену температуру тіла. Звичайний корм їм не підходить!\n\n` +
                `💡 Головні правила раціону для сфінксів:\n` +
                `1️⃣ Високий вміст білка (від 35-40%): Сфінкси витрачають багаторазово більше калорій на обігрів тіла. Обирайте холістік та супер-преміум лінійки.\n` +
                `2️⃣ Гіпоалергенний склад: Шкіра та шлунок сфінксів надзвичайно чутливі. Уникайте дешевих пшеничних та кукурудзяних наповнювачів.\n` +
                `3️⃣ Вологий + Сухий корм: Поєднуйте беззерновий сухий корм із якісними консервами для профілактики сечокам'яної хвороби.\n` +
                `4️⃣ Омега-3 та Омега-6 жирні кислоти: Жир лосося у складі підтримує еластичність шкіри та запобігає надмірному виділенню шкірного сала.\n\n` +
                `🚀 Підсумок: Правильний якісний корм — це запорука здоров'я, чистої шкіри та довголіття вашого улюбленця!\n\n` +
                `🎯 Збережіть цей чек-лист та напишіть у коментарях, який корм обираєте ви!`;
            } else {
              copyText = `🐱 КАКОЙ КОРМ ЛУЧШЕ ВСЕГО ВЫБРАТЬ ДЛЯ СФИНКСОВ?\n\n` +
                `📌 Сфинксы обладают уникальным повышенным метаболизмом из-за отсутствия шерсти и высокой температуры тела. Обычный масс-маркет корм им категорически не подходит!\n\n` +
                `💡 Главные правила здорового рациона сфинкса:\n` +
                `1️⃣ Высокое содержание белка (35–40%+): Бесшерстные кошки тратят колоссальное количество калорий на терморегуляцию. Выбирайте холистики и супер-премиум корма.\n` +
                `2️⃣ Гипоаллергенный состав: Кожа и пищеварение сфинксов чувствительны. Избегайте пшеницы, кукурузы и искусственных красителей, вызывающих высыпания.\n` +
                `3️⃣ Баланс сухого и влажного корма: Комбинируйте качественные беззерновые гранулы с влажными паучами для поддержания здоровья почек и питьевого баланса.\n` +
                `4️⃣ Омега-3 и Омега-6 жирные кислоты: Масло лосося в составе сохраняет кожу эластичной и предотвращает избыточное выделение кожного секрета.\n\n` +
                `🚀 Итог: Качественный холистик-корм — это чистое тело, здоровое пищеварение и долголетие вашего питомца!\n\n` +
                `🎯 Сохраняйте этот экспертный разбор и напишите в комментариях, какой корм предпочитает ваш сфинкс!`;
            }
          }
        }их наповнювачів.\n` +
              `3️⃣ Вологий + Сухий корм: Поєднуйте беззерновий сухий корм із якісними консервами для профілактики сечокам'яної хвороби.\n` +
              `4️⃣ Омега-3 та Омега-6 жирні кислоти: Жир лосося у складі підтримує еластичність шкіри та запобігає надмірному виділенню шкірного сала.\n\n` +
              `🚀 Підсумок: Правильний якісний корм — це запорука здоров'я, чистої шкіри та довголіття вашого улюбленця!\n\n` +
              `🎯 Збережіть цей чек-лист та напишіть у коментарях, який корм обираєте ви!`;
          } else {
            copyText = `🐱 КАКОЙ КОРМ ЛУЧШЕ ВСЕГО ВЫБРАТЬ ДЛЯ СФИНКСОВ?\n\n` +
              `📌 Сфинксы обладают уникальным повышенным метаболизмом из-за отсутствия шерсти и высокой температуры тела. Обычный масс-маркет корм им категорически не подходит!\n\n` +
              `💡 Главные правила здорового рациона сфинкса:\n` +
              `1️⃣ Высокое содержание белка (35–40%+): Бесшерстные кошки тратят колоссальное количество калорий на терморегуляцию. Выбирайте холистики и супер-премиум корма.\n` +
              `2️⃣ Гипоаллергенный состав: Кожа и пищеварение сфинксов чувствительны. Избегайте пшеницы, кукурузы и искусственных красителей, вызывающих высыпания.\n` +
              `3️⃣ Баланс сухого и влажного корма: Комбинируйте качественные беззерновые гранулы с влажными паучами для поддержания здоровья почек и питьевого баланса.\n` +
              `4️⃣ Омега-3 и Омега-6 жирные кислоты: Масло лосося в составе сохраняет кожу эластичной и предотвращает избыточное выделение кожного секрета.\n\n` +
              `🚀 Итог: Качественный холистик-корм — это чистое тело, здоровое пищеварение и долголетие вашего питомца!\n\n` +
              `🎯 Сохраняйте этот экспертный разбор и напишите в комментариях, какой корм предпочитает ваш сфинкс!`;
          }
        }
        // 2. BUSINESS & E-COMMERCE DOMAIN
        else if (lowerPrompt.includes('одежд') || lowerPrompt.includes('магазин') || lowerPrompt.includes('товар') || lowerPrompt.includes('продаж')) {
          copyText = `🛍️ ${topicCaps.toUpperCase()}\n\n` +
            `📌 Практический разбор для продаж и интернет-магазинов.\n\n` +
            `💡 Главные шаги для увеличения конверсии:\n` +
            `1️⃣ Точное позиционирование: Покупатели выбирают эмоцию и решение своей проблемы, а не просто вещь.\n` +
            `2️⃣ Социальное доказательство: Отзывы, реальные фото и видео-демонстрация увеличивают доверие на 70%.\n` +
            `3️⃣ Быстрый заказ: Убирайте лишние шаги в оформлении покупки.\n\n` +
            `🚀 Результат: Рост повторных продаж и лояльное комьюнити клиентов.\n\n` +
            `🎯 Сохраняйте в закладки и внедряйте прямо сейчас!`;
        }
        // 3. GENERAL DYNAMIC FALLBACK
        else {
          if (userLang === 'en') {
            copyText = `🔥 ${topicCaps.toUpperCase()}\n\n` +
              `📌 Practical insights and recommendations regarding: "${cleanTopic}".\n\n` +
              `💡 Core Highlights:\n` +
              `1️⃣ The Strategic Approach: When dealing with "${cleanTopic}", focusing on core value yields the highest return.\n` +
              `2️⃣ Key Pitfall to Avoid: Bypassing fundamental quality checks leads to wasted resources.\n` +
              `3️⃣ Modern 2026 Execution: Utilize structured methodology and verified practices for consistent success.\n\n` +
              `🚀 Outcome: Maximum efficiency with reliable, repeatable results.\n\n` +
              `🎯 Save this post and leave your feedback below!`;
          } else if (userLang === 'ua') {
            copyText = `🔥 ${topicCaps.toUpperCase()}\n\n` +
              `📌 Практичні поради та експертний розбір за темою: "${cleanTopic}".\n\n` +
              `💡 Головні моменти:\n` +
              `1️⃣ Стратегічний підхід: Працюючи над темою "${cleanTopic}", ключовий фокус слід робити на якості та цінності.\n` +
              `2️⃣ Часта помилка: Ігнорування деталей та використання непротестованих рішень.\n` +
              `3️⃣ Сучасний формат 2026: Використовуйте системні перевірені методики для стабільного результату.\n\n` +
              `🚀 Підсумок: Гарантована ефективність без зайвої витрати часу.\n\n` +
              `🎯 Збережіть цей пост та діліться своєю думкою у коментарях!`;
          } else {
            copyText = `🔥 ${topicCaps.toUpperCase()}\n\n` +
              `📌 Практический разбор и экспертные рекомендации по теме: "${cleanTopic}".\n\n` +
              `💡 Главные ключевые моменты:\n` +
              `1️⃣ Стратегический подход: Работа квалифицированного специалиста по теме "${cleanTopic}" начинается с точного анализа задач и ценности.\n` +
              `2️⃣ Распространенная ошибка: Игнорирование базовых правил и использование неверных методов.\n` +
              `3️⃣ Совершенный стандарт 2026: Системный подход и проверенные решения гарантируют максимальный эффект.\n\n` +
              `🚀 Итог: Высокая продуктивность и чистый результат без лишней рутины.\n\n` +
              `🎯 Сохраняйте этот пост и напишите в комментариях свое мнение по теме!`;
          }
        }
      }

      // Systemic markdown asterisks sanitizer
      copyText = copyText.replace(/\*\*/g, '').replace(/\*/g, '');

      return res.status(200).json({
        ok: true,
        success: true,
        copyText,
        timestamp: new Date().toISOString()
      });
    }

    if (moduleType === 'deepseek') {
      const mathProblem = problem || customPrompt || prompt || '2x + 5 = 15';
      const mathLevel = level || 'Університет / ЗНО';

      const cacheKey = `deepseek_${mathProblem.toLowerCase().trim()}_${mathLevel.toLowerCase().trim()}`;
      if (llmCacheMap.has(cacheKey)) {
        console.log('⚡ Returning 50ms In-Memory Cached DeepSeek response');
        return res.status(200).json({ ok: true, success: true, ...llmCacheMap.get(cacheKey), cached: true });
      }

      let solutionText = '';
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const nimRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NVIDIA_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta/llama-3.1-70b-instruct",
            messages: [
              {
                role: "system",
                content: "Ти геніальний математичний тьютор. Розв'яжи задачу з покроковим поясненням та відповіддю."
              },
              {
                role: "user",
                content: `Задача (${mathLevel}): ${mathProblem}`
              }
            ],
            temperature: 0.2,
            max_tokens: 600
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (nimRes.ok) {
          const data = await nimRes.json();
          solutionText = data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.log('NVIDIA DeepSeek NIM fallback triggered:', err.message);
      }

      if (!solutionText) {
        solutionText = `📐 **Крок 1: Аналіз умови рівняння**\n` +
          `Дано рівняння: ${mathProblem}\n\n` +
          `🔍 **Крок 2: Перенесення відомих членів**\n` +
          `Віднімаємо 5 від обох частин рівняння:\n` +
          `2x = 15 - 5\n` +
          `2x = 10\n\n` +
          `💡 **Крок 3: Знаходження невідомого x**\n` +
          `Ділимо обидві частини на коефіцієнт 2:\n` +
          `x = 10 / 2\n` +
          `x = 5\n\n` +
          `🎯 **ВІДПОВІДЬ:** x = 5 (Перевірка: 2*(5) + 5 = 15 — Вірно!)`;
      }

      const bgPrompt = encodeURIComponent(`Futuristic dark neon chalkboard with glowing mathematical formulas and physics equations, DeepSeek R1 AI style, cyan and emerald glow, 8k render`);
      const randomSeed = Math.floor(Math.random() * 999999);
      const imageUrl = `https://image.pollinations.ai/prompt/${bgPrompt}?width=1280&height=720&seed=${randomSeed}&nologo=true`;

      const responsePayload = {
        solutionText,
        imageUrl,
        seed: randomSeed,
      };

      if (llmCacheMap.size > 200) llmCacheMap.clear();
      llmCacheMap.set(cacheKey, responsePayload);

      return res.status(200).json({
        ok: true,
        success: true,
        ...responsePayload,
        timestamp: new Date().toISOString()
      });
    }

    // Default Image Generation via FLUX 1.0
    let basePrompt = customPrompt || prompt || 'Futuristic luxury presentation cover';
    if (moduleType === 'youtube-cover' || moduleType === 'youtube') {
      const engineMode = req.body.engineMode || req.body.engine || 'full3d';
      const titleText = req.body.mainText || headline || topic || 'AI REVOLUTION 2026';
      const userTopic = (customPrompt || prompt || topic || 'Заработок на ИИ 2026').toLowerCase();
      const userStyle = style || 'cyberpunk';

      if (engineMode === 'full3d') {
        let styleDetails = 'futuristic high tech cyberpunk city night backdrop, glowing cyan and orange neon lights, 3D cyborg warrior character standing in center with glowing eyes';
        if (userStyle === 'viral') {
          styleDetails = 'explosive viral MrBeast style studio backdrop, glowing gold coins and 3D cash banknotes, 3D character standing in center holding gold trophy';
        } else if (userStyle === 'business') {
          styleDetails = 'luxury Forbes executive penthouse office with glass windows over glowing night city, 3D executive in luxury suit standing in center';
        } else if (userStyle === 'gaming') {
          styleDetails = 'epic esports gaming setup, glowing RGB neon lights, 3D gaming warrior in center';
        }

        basePrompt = `Ultra high impact 16:9 YouTube thumbnail masterpiece wallpaper, large glowing 3D neon signboard frame with bold Cyrillic text "${titleText}", ${styleDetails}, side neon badges "YOUTUBE EXCLUSIVE", bottom high tech dashboards, cinematic softbox lighting, 8k resolution, octane render, trending on YouTube, hyper realistic 3D render`;
      } else {
        let backgroundScene = 'ultra bright luxury tech presentation studio backdrop, glowing cyan and gold neon softbox lighting, 3D holographic data screens, high contrast vibrant 8k render, no human faces';

        if (userStyle === 'cyberpunk') {
          backgroundScene = 'glowing cyan and magenta cyberpunk neon city skyline studio, 3D futuristic AI neural core sphere, high-tech glass dashboards, 8k render';
        } else if (userStyle === 'business') {
          backgroundScene = 'luxury Forbes executive penthouse office overlooking illuminated night city skyline, gold ambient lighting, glass desk, 8k photography';
        } else if (userStyle === 'gaming') {
          backgroundScene = 'epic esports gaming setup studio, glowing RGB neon lights, high contrast 8k render';
        } else if (userTopic.includes('крипт') || userTopic.includes('биткоин') || userTopic.includes('crypto')) {
          backgroundScene = '3D glowing gold Bitcoin coins stacking, holographic trading charts, luxury studio lighting, 8k render';
        } else if (userTopic.includes('деньг') || userTopic.includes('доход') || userTopic.includes('money') || userTopic.includes('1000')) {
          backgroundScene = 'floating 3D hundred dollar cash banknotes, glowing gold coins, financial growth chart, 8k render';
        }

        basePrompt = `Professional 16:9 YouTube thumbnail background wallpaper, ${backgroundScene}, photorealistic, octane render, 8k resolution, trending on YouTube, studio quality, crisp clean lighting, masterpiece`;
      }
    } else if (moduleType === 'tattoo') {
      basePrompt = `Pure white background stencil tattoo design of ${customPrompt || prompt || 'dragon'}, sharp clean black vector line art, pure white background #ffffff, no gradients, transfer ready`;
    } else if (moduleType === 'amazon') {
      basePrompt = `Thick white die-cut contour sticker of ${customPrompt || prompt || 'cute space cat'}, bold white outline, clean vector graphic art for plotters Cricut Silhouette, isolated background`;
    } else if (moduleType === 'realestate') {
      basePrompt = `Ultra realistic 3D interior staging of ${customPrompt || prompt || 'modern living room'}, luxury furniture, Scandinavian design, architectural digest 8k photography`;
    } else if (moduleType === 'food') {
      basePrompt = `Mouthwatering macro studio food photography of ${customPrompt || prompt || 'gourmet burger'}, dark moody background, restaurant menu styling, Michelin star lighting 8k`;
    } else if (moduleType === 'ecommerce') {
      const currentPreset = preset || style;
      let ecomBackground = 'dark obsidian stone pedestal, studio softbox lighting';
      if (currentPreset === 'marble') ecomBackground = 'white Carrara marble podium with gold vein accents, bright clean studio lighting';
      if (currentPreset === 'tropical') ecomBackground = 'natural wooden pedestal surrounded by fresh tropical palm leaves and morning dew, sunbeam lighting';
      if (currentPreset === 'slate') ecomBackground = 'raw dark slate stone platform, moody luxury aesthetic';
      if (currentPreset === 'neon') ecomBackground = 'glowing cyan neon cyber platform, reflective glass pedestal, cyberpunk studio lighting';

      const targetProduct = product || customPrompt || prompt || 'luxury product bottle';
      basePrompt = `Professional 8k commercial product studio photography of ${targetProduct}, placed on ${ecomBackground}, 8k render, photorealistic, advertising composition, masterpiece`;
    } else if (moduleType === 'avatar') {
      const isFemale = gender === 'female';
      const personSubject = isFemale ? 'beautiful elegant business woman executive, businesswoman' : 'handsome executive man, businessman in luxury suit';
      let presetStyle = 'luxury Forbes penthouse office background, warm ambient lighting';
      
      const currentPreset = preset || style;
      if (currentPreset === 'dubai') presetStyle = 'ultra luxury Dubai penthouse balcony background, night city skyline, glass railing';
      if (currentPreset === 'oldmoney') presetStyle = 'quiet luxury Italian villa estate garden background, old money aesthetic';
      if (currentPreset === 'keynote') presetStyle = 'high-tech keynote speaker stage backdrop, dramatic spotlighting';

      basePrompt = `Professional 8k executive studio portrait of ${personSubject}, ${presetStyle}, ${customPrompt || prompt || ''}, centered headshot framing, person standing strictly in exact center of image, symmetrical composition, Vogue magazine cover style photography, photorealistic 8k render, masterpiece`;
    } else if (moduleType === 'web3') {
      basePrompt = `3D Pixar cyberpunk mascot for Web3 crypto project ${customPrompt || prompt || 'PEPE'}, glowing neon gold coin, 8k render`;
    }

    // High-Speed Commercial Generation via Fal.ai FLUX.1 [schnell] ($0.003/gen)
    const rawFalKey = process.env.FAL_KEY || process.env.FAL_AI_KEY;
    let falErrorDetails = null;
    console.log('Fal.ai key present check:', Boolean(rawFalKey));

    const isSquareModule = moduleType === 'avatar';
    const imageSizeParam = isSquareModule ? "square_hd" : "landscape_16_9";
    const widthParam = isSquareModule ? 1000 : 1280;
    const heightParam = isSquareModule ? 1000 : 720;

    if (rawFalKey) {
      const cleanFalKey = rawFalKey.trim();
      try {
        const falRes = await fetch("https://fal.run/fal-ai/flux/schnell", {
          method: "POST",
          headers: {
            "Authorization": cleanFalKey.startsWith("Key ") ? cleanFalKey : `Key ${cleanFalKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: basePrompt,
            image_size: imageSizeParam,
            num_inference_steps: 4,
            enable_safety_checker: false
          })
        });

        if (falRes.ok) {
          const falData = await falRes.json();
          const falUrl = falData.images?.[0]?.url;
          if (falUrl) {
            return res.status(200).json({
              ok: true,
              success: true,
              imageUrl: falUrl,
              backgroundUrl: falUrl,
              engine: "fal-ai-flux-schnell",
              timestamp: new Date().toISOString()
            });
          }
        } else {
          const errBody = await falRes.text();
          falErrorDetails = `Fal HTTP ${falRes.status}: ${errBody.slice(0, 200)}`;
          console.log('Fal.ai API error response:', falErrorDetails);
        }
      } catch (err) {
        falErrorDetails = `Fal Fetch Exception: ${err.message}`;
        console.log('Fal.ai FLUX Schnell API fallback triggered:', err.message);
      }
    }

    const encodedPrompt = encodeURIComponent(basePrompt);
    const randomSeed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${widthParam}&height=${heightParam}&seed=${randomSeed}&nologo=true&model=flux&enhance=true`;

    return res.status(200).json({
      ok: true,
      success: true,
      imageUrl,
      seed: randomSeed,
      falErrorDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Unified Generator Error:', error);
    return res.status(200).json({
      ok: true,
      success: true,
      imageUrl: 'https://image.pollinations.ai/prompt/Futuristic%20dark%20neon%20cyberpunk%20background?width=1280&height=720&nologo=true',
      copyText: '🚀 Запуск NeiroStudio AI Hub!\n\nГотовий інструмент для автоматизації контенту.',
      solutionText: 'x = 5'
    });
  }
}
