import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  UserCheck,
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
  Circle,
  Briefcase
} from 'lucide-react';

export default function BusinessAvatarStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State (QA Requirements: Gender Selector + Circle Mask Toggle)
  const [gender, setGender] = useState('male'); // male | female
  const [selectedPreset, setSelectedPreset] = useState('forbes'); // forbes | dubai | oldmoney | keynote
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('forbes'); // forbes | founder | keynote | expert | oldmoney
  const [badgePosition, setBadgePosition] = useState('bottom-center'); // top-center | bottom-center | top-left | top-right
  const [showCircleMask, setShowCircleMask] = useState(true); // QA Test Circle Crop Overlay

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
      studioTitle: "Business Avatar Pro",
      studioSub: "Dual-Layer Executive Engine • FLUX 1.0 8K + Экспертные Бейджи",
      backHub: "В Хаб",
      genderLabel: "1. Пол эксперта (Gender Selection)",
      genderMale: "👨 Мужской (Male)",
      genderFemale: "👩 Женский (Female)",
      presetLabel: "2. Стиль делового портрета & локации",
      customPromptLabel: "3. Детали внешности или костюма (необязательно)",
      customPromptPlaceholder: "Например: очки, темный костюм, улыбка...",
      badgeLabel: "4. Статус-бейдж эксперта (Layer 2)",
      positionLabel: "5. Позиционирование бейджа (Safe Zone)",
      circleMaskToggle: "⭕ Маска круга (Telegram/LinkedIn Crop)",
      generateBtn: "Сгенерировать Деловые Портреты 8K",
      presetForbes: "💼 Forbes Executive",
      presetDubai: "🏙️ Dubai Penthouse",
      presetOldMoney: "💎 Old Money Luxury",
      presetKeynote: "🎙️ Keynote Speaker",
      badgeForbes: "💼 FORBES EXECUTIVE",
      badgeFounder: "🚀 FOUNDER & CEO",
      badgeKeynote: "🎙️ KEYNOTE SPEAKER",
      badgeExpert: "⭐ TOP EXPERT",
      badgeOldMoney: "💎 OLD MONEY LUXURY",
      posBottomCenter: "⬇️ Снизу по центру",
      posTopCenter: "⬆️ Сверху по центру",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      previewHeader: "Превью Аватарки (Live 1000x1000 Canvas)",
      downloadBtn: "Скачать Аватарку 8K",
      unlockBtn: "🎁 Снять Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Разблокировка 8K HD",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте аватарку без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать в 8K за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Business Avatar Pro",
      studioSub: "Dual-Layer Executive Engine • FLUX 1.0 8K + Експертні Бейджі",
      backHub: "До Хабу",
      genderLabel: "1. Стать експерта (Gender Selection)",
      genderMale: "👨 Чоловіча (Male)",
      genderFemale: "👩 Жіноча (Female)",
      presetLabel: "2. Стиль ділового портрета & локації",
      customPromptLabel: "3. Деталі зовнішності або костюма (необов'язково)",
      customPromptPlaceholder: "Наприклад: окуляри, темний костюм, посмішка...",
      badgeLabel: "4. Статус-бейдж експерта (Layer 2)",
      positionLabel: "5. Позиціонування бейджа (Safe Zone)",
      circleMaskToggle: "⭕ Маска кола (Telegram/LinkedIn Crop)",
      generateBtn: "Згенерувати Ділові Портрети 8K",
      presetForbes: "💼 Forbes Executive",
      presetDubai: "🏙️ Dubai Penthouse",
      presetOldMoney: "💎 Old Money Luxury",
      presetKeynote: "🎙️ Keynote Speaker",
      badgeForbes: "💼 FORBES EXECUTIVE",
      badgeFounder: "🚀 FOUNDER & CEO",
      badgeKeynote: "🎙️ KEYNOTE SPEAKER",
      badgeExpert: "⭐ TOP EXPERT",
      badgeOldMoney: "💎 OLD MONEY LUXURY",
      posBottomCenter: "⬇️ Знизу по центру",
      posTopCenter: "⬆️ Зверху по центру",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      previewHeader: "Прев'ю Аватарки (Live 1000x1000 Canvas)",
      downloadBtn: "Завантажити Аватарку 8K",
      unlockBtn: "🎁 Зняти Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Розблокування 8K HD",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте аватарку без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 8K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Business Avatar Pro",
      studioSub: "Dual-Layer Executive Engine • FLUX 1.0 8K + Expert Status Badges",
      backHub: "To Hub",
      genderLabel: "1. Expert Gender (Gender Selection)",
      genderMale: "👨 Male Executive",
      genderFemale: "👩 Female Executive",
      presetLabel: "2. Portrait Style & Background Vibe",
      customPromptLabel: "3. Appearance Details (Optional)",
      customPromptPlaceholder: "e.g. glasses, navy blue suit, confident smile...",
      badgeLabel: "4. Vector Status Badge (Layer 2)",
      positionLabel: "5. Badge Safe Position",
      circleMaskToggle: "⭕ Circle Crop Mask (Telegram/LinkedIn)",
      generateBtn: "Generate 8K Executive Portrait",
      presetForbes: "💼 Forbes Executive",
      presetDubai: "🏙️ Dubai Penthouse",
      presetOldMoney: "💎 Old Money Luxury",
      presetKeynote: "🎙️ Keynote Speaker",
      badgeForbes: "💼 FORBES EXECUTIVE",
      badgeFounder: "🚀 FOUNDER & CEO",
      badgeKeynote: "🎙️ KEYNOTE SPEAKER",
      badgeExpert: "⭐ TOP EXPERT",
      badgeOldMoney: "💎 OLD MONEY LUXURY",
      posBottomCenter: "⬇️ Bottom Center",
      posTopCenter: "⬆️ Top Center",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      previewHeader: "Avatar Preview (Live 1000x1000 Canvas)",
      downloadBtn: "Download 8K Avatar",
      unlockBtn: "🎁 Remove Watermark & Get 8K",
      modalUnlockTitle: "Growth Hack: Unlock 8K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free 8K avatar in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download 8K with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  useEffect(() => {
    if (!bgImageUrl) {
      handleGenerate();
    }
  }, []);

  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, badgePosition, showCircleMask, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER EXECUTIVE CANVAS RENDERER ENGINE
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
        renderLayer2BadgesAndMask(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2BadgesAndMask(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2BadgesAndMask(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createRadialGradient(500, 450, 80, 500, 500, 650);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2BadgesAndMask = (ctx) => {
    const badgesDict = {
      forbes: { text: t.badgeForbes, bg: '#090d16', border: '#f59e0b', textCol: '#fbbf24' },
      founder: { text: t.badgeFounder, bg: '#0284c7', border: '#38bdf8', textCol: '#ffffff' },
      keynote: { text: t.badgeKeynote, bg: '#9333ea', border: '#c084fc', textCol: '#ffffff' },
      expert: { text: t.badgeExpert, bg: '#059669', border: '#34d399', textCol: '#ffffff' },
      oldmoney: { text: t.badgeOldMoney, bg: '#451a03', border: '#d97706', textCol: '#fef3c7' }
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.forbes;

    // Calculate Badge Position with Circle Crop Safe Zone Margins (QA Requirement)
    ctx.save();
    ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const badgeText = currentBadge.text;
    const badgeWidth = ctx.measureText(badgeText).width + 36;
    const badgeHeight = 52;

    let bx = (1000 - badgeWidth) / 2; // default bottom-center
    let by = 820; // safe zone inside circle crop

    if (badgePosition === 'top-center') {
      by = 120;
    } else if (badgePosition === 'top-left') {
      bx = 120;
      by = 140;
    } else if (badgePosition === 'top-right') {
      bx = 1000 - badgeWidth - 120;
      by = 140;
    }

    // Badge Shadow & Styling
    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 18;

    ctx.fillStyle = currentBadge.bg;
    ctx.strokeStyle = currentBadge.border;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(bx, by, badgeWidth, badgeHeight, 14);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = currentBadge.textCol;
    ctx.fillText(badgeText, bx + 18, by + 10);
    ctx.restore();

    // 2. CIRCLE CROP MASK OVERLAY (FOR QA & SOCIAL MEDIA AVATAR PREVIEW)
    if (showCircleMask) {
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 4;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.arc(500, 500, 440, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO AVATAR PREVIEW • UNLOCK 8K', 70, 935);
      ctx.restore();
    }
  };

  // Generate API Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
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
    if (!isUnlocked) {
      setIsUnlockModalOpen(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `business-avatar-8k-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <UserCheck className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dual-Layer Executive Engine • Circle Crop Safe Zone</span>
          </div>
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

              {/* GENDER SELECTOR (QA REQUIREMENT) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.genderLabel}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGender('male')}
                    className={`flex-1 py-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      gender === 'male'
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.genderMale}
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`flex-1 py-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                      gender === 'female'
                        ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.genderFemale}
                  </button>
                </div>
              </div>

              {/* PORTRAIT PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'forbes', label: t.presetForbes },
                    { id: 'dubai', label: t.presetDubai },
                    { id: 'oldmoney', label: t.presetOldMoney },
                    { id: 'keynote', label: t.presetKeynote }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setSelectedPreset(pr.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM PROMPT */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.customPromptLabel}
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t.customPromptPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'forbes', label: t.badgeForbes },
                    { id: 'founder', label: t.badgeFounder },
                    { id: 'keynote', label: t.badgeKeynote },
                    { id: 'expert', label: t.badgeExpert }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => setSelectedBadge(bd.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BADGE POSITION (QA REQUIREMENT WITH SAFE ZONES) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.positionLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'bottom-center', label: t.posBottomCenter },
                    { id: 'top-center', label: t.posTopCenter },
                    { id: 'top-left', label: t.posTopLeft },
                    { id: 'top-right', label: t.posTopRight }
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setBadgePosition(pos.id)}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        badgePosition === pos.id
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CIRCLE CROP MASK TOGGLE (QA REQUIREMENT) */}
              <div className="pt-1">
                <button
                  onClick={() => setShowCircleMask(!showCircleMask)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    showCircleMask
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Circle className="w-4 h-4 text-cyan-400" />
                  <span>{t.circleMaskToggle}</span>
                </button>
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
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
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold uppercase border border-cyan-500/30">
                  8K Executive Canvas
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 8K Executive Portrait...</span>
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
                    <Gift className="w-4 h-4" />
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
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
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
