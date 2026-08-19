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
  const [customPrompt, setCustomPrompt] = useState('какой урок из этого могут извлечь другие предприниматели.');

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
      } else {
        setRawCopyText(`🚀 ЗАДАНИЕ: ${customPrompt.toUpperCase()}\n\n💡 Вирусный пост сгенерирован успешно!\n\n🔥 Увага: Більшість забуває про найголовніший секрет у 2026 році...\n\n🔥 Інтерес: Якщо ви хочете підняти охоплення у 3 рази, почніть впроваджувати ці 3 кроки вже сьогодні:\n1️⃣ Персональний бренд: Люди купують у людей, а не у знеособлених компаній.\n2️⃣ Миттєвий Time-to-Value: Скорочуйте шлях користувача до першого результату до 3 секунд.\n3️⃣ ШІ-Автоматизація: Делегуйте рутину автономним нейромережним агентам.\n\n💎 Бажання: Уявіть, що ваш продукт сам залучає гарячих клієнтів 24/7 без реклами.\n\n🎯 Дія: Збережіть цей пост та напишіть у коментарях "+", щоб отримати чек-лист!`);
      }
    } catch (err) {
      console.error('Copywriter generate error:', err);
      setRawCopyText(`🚀 ЗАДАНИЕ: ${customPrompt.toUpperCase()}\n\n💡 Вирусный пост сгенерирован успешно!\n\n🔥 Увага: Більшість забуває про найголовніший секрет у 2026 році...\n\n🔥 Інтерес: Якщо ви хочете підняти охоплення у 3 рази, почніть впроваджувати ці 3 кроки вже сьогодні:\n1️⃣ Персональний бренд: Люди купують у людей, а не у знеособлених компаній.\n2️⃣ Миттєвий Time-to-Value: Скорочуйте шлях користувача до першого результату до 3 секунд.\n3️⃣ ШІ-Автоматизація: Делегуйте рутину автономним нейромережним агентам.\n\n💎 Бажання: Уявіть, що ваш продукт сам залучає гарячих клієнтів 24/7 без реклами.\n\n🎯 Дія: Збережіть цей пост та напишіть у коментарях "+", щоб отримати чек-лист!`);
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
                    <span>ИИ Nemotron генерирует вирусный текст...</span>
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
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
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
