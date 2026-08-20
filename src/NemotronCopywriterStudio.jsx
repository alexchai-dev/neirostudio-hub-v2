import React, { useState } from 'react';
import {
  ArrowLeft,
  Mic,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  RefreshCw,
  X,
  Copy,
  Check
} from 'lucide-react';

export default function NemotronCopywriterStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [category, setCategory] = useState('post'); // post | hook | aida | story
  const [customPrompt, setCustomPrompt] = useState('Подбираем корм для сфинкса');

  // Engine & UI State
  const [rawCopyText, setRawCopyText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userEnergy, setUserEnergy] = useState(5);
  const [isCopied, setIsCopied] = useState(false);

  // Haptic feedback helper
  const triggerHaptic = (style = 'light') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        if (style === 'heavy') window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        else if (style === 'medium') window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        else window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  // Trilingual Dictionary
  const t = {
    ru: {
      studioTitle: "SMM Копирайтер",
      studioSub: "Вирусные тексты и посты для SMM от AI",
      backHub: "В Хаб",
      categoryLabel: "1. Формат SMM контента",
      catPost: "🔥 Вирусный Telegram Пост",
      catHook: "🎬 TikTok / Reels Сценарий",
      catAida: "🛍️ Продающая AIDA Воронка",
      catStory: "💬 Экспертный Сторителлинг",
      customPromptLabel: "2. Тема поста или задание для ИИ",
      customPromptPlaceholder: "Например: какой урок из этого могут извлечь другие предприниматели...",
      generateBtn: "Сгенерировать Текст",
      previewHeader: "Готовый Текст Поста",
      canvasPill: "SMM COPYWRITER",
      copyBtn: "📋 Скопировать Текст Поста",
      copiedText: "Скопировано в буфер!",
      unlockedToast: "Текст скопирован в буфер обмена!"
    },
    ua: {
      studioTitle: "SMM Копірайтер",
      studioSub: "Вірусні тексти та пости для SMM від AI",
      backHub: "До Хабу",
      categoryLabel: "1. Формат SMM контенту",
      catPost: "🔥 Вірусний Telegram Пост",
      catHook: "🎬 TikTok / Reels Сценарій",
      catAida: "🛍️ Продаюча AIDA Воронка",
      catStory: "💬 Експертний Сторітеллінг",
      customPromptLabel: "2. Тема поста або завдання для ШІ",
      customPromptPlaceholder: "Наприклад: який урок з цього можуть винести інші підприємці...",
      generateBtn: "Згенерувати Текст",
      previewHeader: "Готовий Текст Поста",
      canvasPill: "SMM COPYWRITER",
      copyBtn: "📋 Скопіювати Текст Поста",
      copiedText: "Скопійовано у буфер!",
      unlockedToast: "Текст скопійовано в буфер обміну!"
    },
    en: {
      studioTitle: "SMM Copywriter",
      studioSub: "Viral Text & Sales Funnel Copywriter Engine",
      backHub: "To Hub",
      categoryLabel: "1. SMM Content Format",
      catPost: "🔥 Viral Telegram Post",
      catHook: "🎬 TikTok / Reels Script",
      catAida: "🛍️ High-Converting AIDA Funnel",
      catStory: "💬 Expert Storytelling",
      customPromptLabel: "2. Post Topic or Prompt Assignment",
      customPromptPlaceholder: "e.g. key lessons entrepreneurs can learn from this situation...",
      generateBtn: "Generate Copy",
      previewHeader: "Generated Post Text",
      canvasPill: "SMM COPYWRITER",
      copyBtn: "📋 Copy Post Text",
      copiedText: "Copied to clipboard!",
      unlockedToast: "Text copied to clipboard!"
    }
  }[lang] || t.ru;

  const cleanMarkdownStars = (str) => {
    if (!str) return '';
    return str.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  const getDynamicFallbackText = (cat, promptText, userLang) => {
    const clean = (promptText || 'Подбираем корм для сфинкса').trim();
    const cleanCaps = clean.charAt(0).toUpperCase() + clean.slice(1);

    if (cat === 'hook') {
      if (userLang === 'en') {
        return `🎬 TIKTOK / REELS SCRIPT: ${cleanCaps.toUpperCase()}\n\n` +
          `⏱️ [00:00 - 00:03] HOOK (Visual: Close-up frame):\n` +
          `"Stop making this huge mistake when it comes to ${clean}!"\n\n` +
          `⏱️ [00:03 - 00:15] PROBLEM (Visual: Fast text overlay):\n` +
          `"Most people ignore the single most crucial factor about ${clean} and end up wasting time and money."\n\n` +
          `⏱️ [00:15 - 00:35] SOLUTION (Visual: Pointing to screen tips):\n` +
          `"Here are the top 3 proven rules you need to follow starting today:\n` +
          `1. Always prioritize quality over cheap alternatives.\n` +
          `2. Maintain a balanced daily routine.\n` +
          `3. Consult verified expert guidelines."\n\n` +
          `⏱️ [00:35 - 00:45] CALL TO ACTION:\n` +
          `"Hit follow for more daily expert tips on ${clean}!"`;
      } else if (userLang === 'ua') {
        return `🎬 СЦЕНАРІЙ ДЛЯ REELS / TIKTOK: ${cleanCaps.toUpperCase()}\n\n` +
          `⏱️ [00:00 - 00:03] ХУК (Кадр в кадр):\n` +
          `"Перестаньте робити цю помилку, якщо вас цікавить тема: ${clean}!"\n\n` +
          `⏱️ [00:03 - 00:15] ПРОБЛЕМА (Швидкий монтаж):\n` +
          `"Більшість ігнорує найголовніший фактор у питанні ${clean} і в результаті отримує нульовий результат."\n\n` +
          `⏱️ [00:15 - 00:35] РІШЕННЯ ТА ПОРАДИ (Почергові текстові плашки):\n` +
          `"Ось 3 ключові правила, які працюють на 100%:\n` +
          `1. Обирайте тільки перевірену якість та склад.\n` +
          `2. Дотримуйтесь регулярного графіка.\n` +
          `3. Звертайте увагу на індивідуальні особливості."\n\n` +
          `⏱️ [00:35 - 00:45] ЗАКЛИК ДО ДІЇ:\n` +
          `"Підписуйтесь на профіль, щоб не пропустити нові корисні розбори!"`;
      } else {
        return `🎬 СЦЕНАРИЙ ДЛЯ REELS / TIKTOK: ${cleanCaps.toUpperCase()}\n\n` +
          `⏱️ [00:00 - 00:03] ХУК (Эмоциональный кадр):\n` +
          `"Перестаньте делать эту ошибку, если вас интересует тема: ${clean}!"\n\n` +
          `⏱️ [00:03 - 00:15] ПРОБЛЕМА (Динамичный монтаж):\n` +
          `"Большинство людей совершают одну и ту же фатальную ошибку в вопросе ${clean} и теряют результат."\n\n` +
          `⏱️ [00:15 - 00:35] РЕШЕНИЕ И СОВЕТЫ (Поочередный вывод текста):\n` +
          `"Вот 3 главных правила, которые решают задачу на 100%:\n` +
          `1. Выбирайте только проверенную продукцию и состав.\n` +
          `2. Соблюдайте четкую норму и регулярность.\n` +
          `3. Учитывайте индивидуальные потребности."\n\n` +
          `⏱️ [00:35 - 00:45] ПРИЗЫВ К ДЕЙСТВИЮ:\n` +
          `"Подписывайтесь на канал, чтобы не пропустить свежие разборы!"`;
      }
    } else if (cat === 'aida') {
      if (userLang === 'en') {
        return `🛍️ HIGH-CONVERTING AIDA FUNNEL: ${cleanCaps.toUpperCase()}\n\n` +
          `🅰️ ATTENTION (Attention):\n` +
          `Are you looking for the ideal solution regarding "${clean}"?\n\n` +
          `ℹ️ INTEREST (Interest):\n` +
          `Did you know that 85% of people fail to get results simply because they choose inappropriate options without knowing key guidelines?\n\n` +
          `💎 DESIRE (Desire):\n` +
          `Imagine having a complete, hassle-free setup tailored specifically for ${clean} that delivers guaranteed quality every single day.\n\n` +
          `🎯 ACTION (Action):\n` +
          `Save this post and drop a "+" in the comments to receive your exclusive step-by-step checklist!`;
      } else if (userLang === 'ua') {
        return `🛍️ ПРОДАЮЧА AIDA ВОРОНКА: ${cleanCaps.toUpperCase()}\n\n` +
          `🅰️ ATTENTION (Увага):\n` +
          `Шукаєте ідеальне рішення за темою "${clean}"?\n\n` +
          `ℹ️ INTEREST (Інтерес):\n` +
          `Чи знаєте ви, що 85% людей не отримують бажаного результату лише через те, що обирають невідповідні варіанти без урахування правил?\n\n` +
          `💎 DESIRE (Бажання):\n` +
          `Уявіть, що ви отримуєте повністю готове, якісне та перевірене рішення за темою ${clean}, яке працює на 100% без зайвого клопоту.\n\n` +
          `🎯 ACTION (Дія):\n` +
          `Збережіть цей пост та напишіть "+" у коментарях, щоб отримати покроковий гайд!`;
      } else {
        return `🛍️ ПРОДАЮЩАЯ AIDA ВОРОНКА: ${cleanCaps.toUpperCase()}\n\n` +
          `🅰️ ATTENTION (Внимание):\n` +
          `Ищете идеальное решение по теме "${clean}"?\n\n` +
          `ℹ️ INTEREST (Интерес):\n` +
          `Знаете ли вы, что 85% людей совершают ошибки в теме ${clean} только из-за того, что выбирают некачественные варианты без учета рекомендаций?\n\n` +
          `💎 DESIRE (Желание):\n` +
          `Представьте, что вы получаете проверенное, сбалансированное и безопасное решение, которое дает результат на 100% без лишней рутины.\n\n` +
          `🎯 ACTION (Действие):\n` +
          `Сохраняйте этот пост и напишите "+" в комментариях, чтобы получить экспертный чек-лист!`;
      }
    } else if (cat === 'story') {
      if (userLang === 'en') {
        return `💬 EXPERT STORYTELLING: ${cleanCaps.toUpperCase()}\n\n` +
          `📖 "How I discovered the truth about ${clean}..."\n\n` +
          `Recently, a colleague asked me: "${clean} — where should I start and what's the biggest trap?"\n\n` +
          `It brought back memories of when I first approached this subject. I thought it was simple, but after months of testing, I discovered 2 game-changing insights:\n\n` +
          `1️⃣ Quality is non-negotiable. Trying shortcuts always backfires.\n` +
          `2️⃣ Consistency beats sporadic efforts every single time.\n\n` +
          `💡 The Key Lesson: Master the fundamentals of ${clean} and the results will follow automatically.\n\n` +
          `💬 Have you ever faced a similar challenge? Let me know in the comments!`;
      } else if (userLang === 'ua') {
        return `💬 ЕКСПЕРТНИЙ СТОРІТЕЛЛІНГ: ${cleanCaps.toUpperCase()}\n\n` +
          `📖 "Як я відкрив головну таємницю теми: ${clean}..."\n\n` +
          `Нещодавно мене запитали: "${clean} — з чого взагалі почати та як не припуститися помилки?"\n\n` +
          `Це нагадало мені час, коли я вперше зіткнувся з цим питанням. Спочатку здавалося, що все просто. Але заглибившись у деталі, відкрилися 2 важливі істини:\n\n` +
          `1️⃣ Якість — це головний пріоритет. Спроба зекономити завжди веде до втрат.\n` +
          `2️⃣ Системність вирішує все. Послідовні кроки дають 10-разовий результат.\n\n` +
          `💡 Головний інсайт: Обирайте перевірений підхід до теми ${clean} та не бійтеся радитися з професіоналами.\n\n` +
          `💬 А ви стикалися з подібним у своєму досвіді? Пишіть у коментарях!`;
      } else {
        return `💬 ЭКСПЕРТНЫЙ СТОРИТЕЛЛИНГ: ${cleanCaps.toUpperCase()}\n\n` +
          `📖 "Как я открыл главный секрет темы: ${clean}..."\n\n` +
          `Недавно меня спросили: "${clean} — с чего вообще начать и как не совершить ошибку?"\n\n` +
          `Это напомнило мне время, когда я впервые погрузился в этот вопрос. Сначала казалось, что все элементарно. Но изучив детали, я понял 2 ключевые истины:\n\n` +
          `1️⃣ Качество — не терпит компромиссов. Экономия на важных деталях всегда ведет к переплате.\n` +
          `2️⃣ Системный подход побеждает хаос. Регулярность дает 10-кратный эффект.\n\n` +
          `💡 Главный инсайт: Подходите к теме ${clean} осознанно и выбирайте лучшее.\n\n` +
          `💬 А вы сталкивались с подобной ситуацией? Поделитесь в комментариях!`;
      }
    } else {
      if (userLang === 'en') {
        return `🔥 VIRAL TELEGRAM POST: ${cleanCaps.toUpperCase()}\n\n` +
          `📌 Practical insights and recommendations regarding: "${clean}".\n\n` +
          `💡 Core Highlights:\n` +
          `1️⃣ The Strategic Approach: When dealing with "${clean}", focusing on core value yields the highest return.\n` +
          `2️⃣ Key Pitfall to Avoid: Bypassing fundamental quality checks leads to wasted resources.\n` +
          `3️⃣ Modern Execution: Utilize structured methodology and verified practices for consistent success.\n\n` +
          `🚀 Outcome: Maximum efficiency with reliable, repeatable results.\n\n` +
          `🎯 Save this post and leave your feedback below!`;
      } else if (userLang === 'ua') {
        return `🔥 ВІРУСНИЙ TELEGRAM ПОСТ: ${cleanCaps.toUpperCase()}\n\n` +
          `📌 Практичні поради та експертний розбір за темою: "${clean}".\n\n` +
          `💡 Головні моменти:\n` +
          `1️⃣ Стратегічний підхід: Працюючи над темою "${clean}", ключовий фокус слід робити на якості та цінності.\n` +
          `2️⃣ Часта помилка: Ігнорування деталей та використання непротестованих рішень.\n` +
          `3️⃣ Сучасний формат: Використовуйте системні перевірені методики для стабільного результату.\n\n` +
          `🚀 Підсумок: Гарантована ефективність без зайвої витрати часу.\n\n` +
          `🎯 Збережіть цей пост та діліться своєю думкою у коментарях!`;
      } else {
        return `🔥 ВИРУСНЫЙ TELEGRAM ПОСТ: ${cleanCaps.toUpperCase()}\n\n` +
          `📌 Практический разбор и экспертные рекомендации по теме: "${clean}".\n\n` +
          `💡 Главные ключевые моменты:\n` +
          `1️⃣ Стратегический подход: Работа по теме "${clean}" начинается с точного анализа задач и ценности.\n` +
          `2️⃣ Распространенная ошибка: Игнорирование базовых правил и использование неверных методов.\n` +
          `3️⃣ Совершенный стандарт: Системный подход и проверенные решения гарантируют максимальный эффект.\n\n` +
          `🚀 Итог: Высокая продуктивность и чистый результат без лишней рутины.\n\n` +
          `🎯 Сохраняйте этот пост и напишите в комментариях свое мнение по теме!`;
      }
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);
    setIsCopied(false);

    try {
      const res = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'copywriter',
          category,
          topic: customPrompt,
          customPrompt: customPrompt,
          lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.copyText) setRawCopyText(cleanMarkdownStars(data.copyText));
        else setRawCopyText(getDynamicFallbackText(category, customPrompt, lang));
      } else {
        setRawCopyText(getDynamicFallbackText(category, customPrompt, lang));
      }
    } catch (err) {
      console.error('Copywriter generate error:', err);
      setRawCopyText(getDynamicFallbackText(category, customPrompt, lang));
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy to Clipboard Handler
  const handleCopyText = () => {
    triggerHaptic('heavy');
    if (rawCopyText) {
      const cleaned = cleanMarkdownStars(rawCopyText);
      navigator.clipboard.writeText(cleaned);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pb-20">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { triggerHaptic('light'); onBackToHub(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mic className="w-4 h-4" />
              </div>
              <h1 className="font-extrabold text-base text-white tracking-tight hidden sm:block">
                {t.studioTitle}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userEnergy} ⚡</span>
            </div>

            <button
              onClick={() => setIsLangModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold uppercase"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 pt-6">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            {t.studioTitle}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {t.studioSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: CONTROLS (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">

              {/* 1. CATEGORY SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.categoryLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'post', label: t.catPost },
                    { id: 'hook', label: t.catHook },
                    { id: 'aida', label: t.catAida },
                    { id: 'story', label: t.catStory }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setCategory(c.id);
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        category === c.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CUSTOM PROMPT / TASK ASSIGNMENT */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.customPromptLabel}
                </label>
                <textarea
                  rows={6}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t.customPromptPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                />
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t.generateBtn}</span>
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: RAW TEXT DISPLAY & COPYING (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full font-bold uppercase border border-purple-500/30">
                  {t.canvasPill}
                </span>
              </div>

              {/* TEXT DISPLAY BOX */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-100 leading-relaxed font-sans relative whitespace-pre-wrap min-h-[320px] max-h-[460px] overflow-y-auto shadow-inner">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64 text-purple-400 text-xs space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>ИИ генерирует вирусный текст...</span>
                  </div>
                ) : (
                  rawCopyText || '🚀 Введите тему или задание слева и нажмите "Сгенерировать Текст".'
                )}
              </div>

              {/* COPY ACTION BUTTON */}
              <button
                onClick={handleCopyText}
                disabled={!rawCopyText}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isCopied
                    ? 'bg-emerald-600 text-white shadow-emerald-950/50'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/50'
                }`}
              >
                <span>{isCopied ? t.copiedText : t.copyBtn}</span>
              </button>

            </div>
          </div>

        </div>
      </main>

      {/* LANGUAGE SELECTOR MODAL */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-sm rounded-2xl p-5 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">Select Language</h3>
              <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { code: 'ru', label: 'Русский (RU)' },
                { code: 'ua', label: 'Українська (UA)' },
                { code: 'en', label: 'English (EN)' }
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => { setLang(item.code); setIsLangModalOpen(false); }}
                  className={`w-full py-2.5 px-4 rounded-xl border text-left font-semibold text-xs flex items-center justify-between transition-all ${
                    lang === item.code
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
