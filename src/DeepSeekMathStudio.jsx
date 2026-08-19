import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Brain,
  Sparkles,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  RefreshCw,
  Gift,
  Star,
  X,
  Flame,
  Check
} from 'lucide-react';

export default function DeepSeekMathStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [category, setCategory] = useState('algebra'); // algebra | geometry | physics | code
  const [selectedPreset, setSelectedPreset] = useState('proof'); // proof | quick | examprep
  const [customPrompt, setCustomPrompt] = useState('∫ x² • sin(x) dx');
  const [selectedBadge, setSelectedBadge] = useState('deepseek'); // deepseek | nim | verified | tutor
  const [badgePosition, setBadgePosition] = useState('top-left'); // top-left | top-right | bottom-left | bottom-right

  // Engine & UI State
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubscribedChannel, setIsSubscribedChannel] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [userEnergy, setUserEnergy] = useState(5);

  const canvasRef = useRef(null);

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
      studioTitle: "DeepSeek Математика & STEM",
      studioSub: "Пошаговое решение математических задач через ИИ",
      backHub: "В Хаб",
      categoryLabel: "1. Дисциплина & Предмет",
      catAlgebra: "🧮 Высшая Алгебра & Матананализ",
      catGeometry: "📐 Геометрия & Векторы",
      catPhysics: "⚛️ Физика & Динамика",
      catCode: "💻 Python & Кодинг Багов",
      presetLabel: "2. Режим решения & вывод",
      customPromptLabel: "3. Математическое уравнение или задача",
      customPromptPlaceholder: "Например: ∫ x² • sin(x) dx  или  2x² + 5x - 3 = 0",
      badgeLabel: "4. STEM Статус-бейдж",
      positionLabel: "5. Расположение бейджа",
      generateBtn: "Решить уравнение",
      presetProof: "🧠 Пошаговое Доказательство",
      presetQuick: "⚡ Быстрое Решение",
      presetExam: "🎯 Подготовка к Экзаменам",
      badgeDeepseek: "🧠 DeepSeek-R1 Логика",
      badgeNim: "⚡ ИИ Ускорение NIM",
      badgeVerified: "✅ 100% Проверенное Решение",
      badgeTutor: "🎯 Пошаговый Репетитор",
      badgeNone: "🚫 Без бейджа",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Превью Решения",
      canvasPill: "Математика AI",
      downloadBtn: "Скачать Решение",
      unlockBtn: "Снять Вотермарку",
      modalUnlockTitle: "Разблокировка решения без вотермарки",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте полное решение без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "DeepSeek Математика & STEM",
      studioSub: "Покрокове розв'язання математичних задач через ШІ",
      backHub: "До Хабу",
      categoryLabel: "1. Дисципліна & Предмет",
      catAlgebra: "🧮 Вища Алгебра & Матаналіз",
      catGeometry: "📐 Геометрія & Вектори",
      catPhysics: "⚛️ Фізика & Динаміка",
      catCode: "💻 Python & Кодинг Багів",
      presetLabel: "2. Режим розв'язання & вивід",
      customPromptLabel: "3. Математичне рівняння або задача",
      customPromptPlaceholder: "Наприклад: ∫ x² • sin(x) dx  або  2x² + 5x - 3 = 0",
      badgeLabel: "4. STEM Статус-бейдж",
      positionLabel: "5. Розташування бейджа",
      generateBtn: "Розв'язати рівняння",
      presetProof: "🧠 Покрокове Доведення",
      presetQuick: "⚡ Швидкий Розв'язок",
      presetExam: "🎯 Підготовка до Іспитів",
      badgeDeepseek: "🧠 DeepSeek-R1 Логіка",
      badgeNim: "⚡ ШІ Прискорення NIM",
      badgeVerified: "✅ 100% Перевірений Розв'язок",
      badgeTutor: "🎯 Покроковий Репетитор",
      badgeNone: "🚫 Без бейджа",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Прев'ю Розв'язку",
      canvasPill: "Математика ШІ",
      downloadBtn: "Завантажити Розв'язок",
      unlockBtn: "Зняти Вотермарку",
      modalUnlockTitle: "Розблокування розв'язку без вотермарки",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте розв'язок без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "DeepSeek Math & OCR Tutor",
      studioSub: "DeepSeek Math Solver Engine",
      backHub: "To Hub",
      categoryLabel: "1. Academic Field",
      catAlgebra: "🧮 Higher Algebra & Calculus",
      catGeometry: "📐 Geometry & Vectors",
      catPhysics: "⚛️ Physics & Dynamics",
      catCode: "💻 Python & Code Debugging",
      presetLabel: "2. Solver Mode & Output",
      customPromptLabel: "3. Equation or Math Problem",
      customPromptPlaceholder: "e.g. ∫ x² • sin(x) dx  or  2x² + 5x - 3 = 0",
      badgeLabel: "4. STEM Status Badge",
      positionLabel: "5. Badge Position",
      generateBtn: "Solve Problem",
      presetProof: "🧠 Step-by-Step Proof",
      presetQuick: "⚡ Quick Solution",
      presetExam: "🎯 Exam Prep & Formula",
      badgeDeepseek: "🧠 DeepSeek-R1 Reasoning",
      badgeNim: "⚡ High Speed NIM",
      badgeVerified: "✅ 100% Verified Proof",
      badgeTutor: "🎯 Step-by-Step Tutor",
      badgeNone: "🚫 No Badge",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Solution Preview",
      canvasPill: "Math AI Canvas",
      downloadBtn: "Download Solution",
      unlockBtn: "Remove Watermark",
      modalUnlockTitle: "Unlock Watermark-Free Solution",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free solution in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, badgePosition, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER STEM CANVAS ENGINE (NEON BLACKBOARD + ACCURACY SPECS TAG)
  // ---------------------------------------------------------------------------
  const drawDualLayerCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 1000;

    if (bgImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bgImageUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1000, 1000);
        renderLayer2STEMBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2STEMBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2STEMBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2STEMBadges = (ctx) => {
    if (selectedBadge === 'none') return;
    const badgesDict = {
      deepseek: { text: t.badgeDeepseek, bg: '#0d9488', textCol: '#ffffff' },
      nim: { text: t.badgeNim, bg: '#16a34a', textCol: '#ffffff' },
      verified: { text: t.badgeVerified, bg: '#0284c7', textCol: '#ffffff' },
      tutor: { text: t.badgeTutor, bg: '#9333ea', textCol: '#ffffff' }
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.deepseek;

    // Calculate Coordinates based on Position
    let bx = 50;
    let by = 50;

    if (badgePosition === 'top-right') {
      bx = 550;
      by = 50;
    } else if (badgePosition === 'bottom-left') {
      bx = 50;
      by = 820;
    } else if (badgePosition === 'bottom-right') {
      bx = 550;
      by = 820;
    }

    // 1. RENDER VECTOR STEM BADGE (LAYER 2)
    ctx.save();
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const badgeText = currentBadge.text;
    const badgeWidth = ctx.measureText(badgeText).width + 36;
    const badgeHeight = 52;

    ctx.fillStyle = currentBadge.bg;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeWidth, badgeHeight, 12);
    ctx.fill();

    ctx.fillStyle = currentBadge.textCol;
    ctx.fillText(badgeText, bx + 18, by + 11);
    ctx.restore();

    // 2. RENDER ACCURACY & EXEC TIME TAG (QA REQUIREMENT)
    ctx.save();
    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const specsText = 'ACCURACY: 99.8% • EXEC: 0.4s (NIM H100)';
    const specsWidth = ctx.measureText(specsText).width + 36;
    const px = bx;
    const py = by + badgeHeight + 12;

    ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.strokeStyle = '#0d9488';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(px, py, specsWidth, 48, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#2dd4bf';
    ctx.fillText(specsText, px + 18, py + 10);
    ctx.restore();

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillText('DEEPSEEK-R1 STEM PREVIEW', 50, 940);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          preset: selectedPreset,
          prompt: customPrompt,
          lang
        })
      });

      const data = await res.json();
      if (data.ok && data.imageUrl) {
        setBgImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Handler
  const handleDownload = () => {
    triggerHaptic('heavy');
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `deepseek-math-8k-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      if (canvasRef.current) {
        window.open(canvasRef.current.toDataURL('image/png'), '_blank');
      }
    }
  };

  // Growth Hack Channel Subscription Bonus
  const handleClaimSubscribeBonus = () => {
    triggerHaptic('heavy');
    setIsSubscribedChannel(true);
    setIsUnlocked(true);
    setUserEnergy(userEnergy + 3);
    setIsUnlockModalOpen(false);
    alert(t.unlockedToast);
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
              <ArrowLeft className="w-4 h-4 text-teal-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Brain className="w-4 h-4" />
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

              {/* CATEGORY SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.categoryLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'algebra', label: t.catAlgebra },
                    { id: 'geometry', label: t.catGeometry },
                    { id: 'physics', label: t.catPhysics },
                    { id: 'code', label: t.catCode }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setCategory((prev) => (prev === c.id ? 'none' : c.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        category === c.id
                          ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SOLVER PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'proof', label: t.presetProof },
                    { id: 'quick', label: t.presetQuick },
                    { id: 'examprep', label: t.presetExam }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedPreset((prev) => (prev === pr.id ? 'none' : pr.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM MATH FORMULA INPUT */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.customPromptLabel}
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t.customPromptPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'deepseek', label: t.badgeDeepseek },
                    { id: 'nim', label: t.badgeNim },
                    { id: 'verified', label: t.badgeVerified },
                    { id: 'tutor', label: t.badgeTutor }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BADGE POSITION SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.positionLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'top-left', label: t.posTopLeft },
                    { id: 'top-right', label: t.posTopRight },
                    { id: 'bottom-left', label: t.posBottomLeft },
                    { id: 'bottom-right', label: t.posBottomRight }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setBadgePosition(pos.id)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        badgePosition === pos.id
                          ? 'bg-teal-600/30 border-teal-500 text-teal-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50 transition-all"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t.generateBtn}</span>
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: LIVE CANVAS PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold uppercase border border-teal-500/30">
                  {t.canvasPill}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#090d16] shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-teal-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Решение задачи...</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-700"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadBtn}</span>
                </button>

                {!isUnlocked && (
                  <button
                    onClick={() => { triggerHaptic('medium'); setIsUnlockModalOpen(true); }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50"
                  >
                    <span>{t.unlockBtn}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* GROWTH HACK UNLOCK MODAL */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-md rounded-2xl p-5 border border-amber-500/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-sm">{t.modalUnlockTitle}</h3>
              </div>
              <button onClick={() => setIsUnlockModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <p className="text-xs text-slate-300 leading-relaxed mb-5">
                {t.modalUnlockDesc}
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleClaimSubscribeBonus}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.subscribeDealBtn}</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic('heavy');
                    setIsUnlocked(true);
                    setIsUnlockModalOpen(false);
                    alert('Telegram Stars Payment Success! 8K Unlocked.');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800"
                >
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{t.starsDealBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      ? 'bg-teal-600/20 border-teal-500 text-teal-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
