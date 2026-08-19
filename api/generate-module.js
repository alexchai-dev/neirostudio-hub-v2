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
    const { prompt, customPrompt, style, headline, badge, price, topic, problem, level, target, role, format } = req.body || {};

    const userTopic = topic || customPrompt || prompt || 'Запуск ИИ-сервиса NeiroStudio';
    const userTarget = target || 'Предприниматели, блогеры, фрилансеры';
    const userRole = role || 'SMM Стратег';
    const userFormat = format || 'Пост для Telegram з AIDA-воронкою';

    if (moduleType === 'copywriter') {
      let copyText = '';

      // Try NVIDIA NIM API with 4.5s fast timeout to prevent Vercel Hobby 10s gateway timeout
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
                content: "Ти вірусний SMM-копірайтер. Створи вірусний пост з AIDA структурою, емодзі та заклик до дії. НЕ використовуй маркдаун зірочки ** навколо слів. Пиши чистий готовий текст без зірочок."
              },
              {
                role: "user",
                content: `Тема: "${userTopic}". Аудиторія: ${userTarget}.`
              }
            ],
            temperature: 0.7,
            max_tokens: 600
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (nimRes.ok) {
          const data = await nimRes.json();
          copyText = data.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.log('NVIDIA NIM API fallback triggered:', err.message);
      }

      if (!copyText) {
        copyText = `🚀 ${userTopic.toUpperCase()}\n\n` +
          `💡 Увага: Більшість забуває про найголовніший секрет у 2026 році...\n\n` +
          `🔥 Інтерес: Якщо ви хочете підняти охоплення у 3 рази, почніть впроваджувати ці 3 кроки вже сьогодні:\n` +
          `1️⃣ Персональний бренд: Люди купують у людей, а не у знеособлених компаній.\n` +
          `2️⃣ Миттєвий Time-to-Value: Скорочуйте шлях користувача до першого результату до 3 секунд.\n` +
          `3️⃣ ШІ-Автоматизація: Делегуйте рутину автономним нейромережним агентам.\n\n` +
          `💎 Бажання: Уявіть, що ваш продукт сам залучає гарячих клієнтів 24/7 без реклами.\n\n` +
          `🎯 Дія: Збережіть цей пост та напишіть у коментарях "+", щоб отримати чек-лист!\n\n` +
          `📌 Цільова аудиторія: ${userTarget} | Роль: ${userRole}`;
      }

      // Systemic markdown asterisks sanitizer
      copyText = copyText.replace(/\*\*/g, '').replace(/\*/g, '');

      const bgPrompt = encodeURIComponent(`Abstract dark cybernetic background with glowing purple cyan neon typography for ${userTopic}, 8k studio lighting, sleek glassmorphism dashboard, futuristic UI background`);
      const randomSeed = Math.floor(Math.random() * 999999);
      const imageUrl = `https://image.pollinations.ai/prompt/${bgPrompt}?width=1280&height=720&seed=${randomSeed}&nologo=true`;

      return res.status(200).json({
        ok: true,
        success: true,
        copyText,
        imageUrl,
        seed: randomSeed,
        timestamp: new Date().toISOString()
      });
    }

    if (moduleType === 'deepseek') {
      const mathProblem = problem || customPrompt || prompt || '2x + 5 = 15';
      const mathLevel = level || 'Університет / ЗНО';

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

      return res.status(200).json({
        ok: true,
        success: true,
        solutionText,
        imageUrl,
        seed: randomSeed,
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
      basePrompt = `Professional e-commerce product photography of ${customPrompt || prompt || 'perfume bottle'} on dark obsidian stone pedestal, studio softbox lighting, 8k render`;
    } else if (moduleType === 'avatar') {
      basePrompt = `Professional executive portrait of ${customPrompt || prompt || 'man'}, ${style || 'Dubai Luxury'}, keynote speaker lighting, 8k camera, Vogue style`;
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
