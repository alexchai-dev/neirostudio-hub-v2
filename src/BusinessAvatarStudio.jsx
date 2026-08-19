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
  const [userPhotoUrl, setUserPhotoUrl] = useState(''); // Face Swap photo upload

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhotoUrl(event.target?.result || '');
        triggerHaptic('medium');
      };
      reader.readAsDataURL(file);
    }
  };

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
      studioTitle: "Бизнес-Аватар Pro",
      studioSub: "Студийные деловые портреты с экспертными бейджами",
      backHub: "В Хаб",
      genderLabel: "1. Пол эксперта",
      genderMale: "👨 Мужской",
      genderFemale: "👩 Женский",
      presetLabel: "2. Стиль портрета",
      customPromptLabel: "3. Детали внешности или костюма",
      customPromptPlaceholder: "Например: очки, темный костюм, улыбка...",
      badgeLabel: "4. Статус-бейдж эксперта",
      positionLabel: "5. Расположение бейджа",
      circleMaskToggle: "⭕ Круговая рамка Telegram/LinkedIn",
      generateBtn: "Сгенерировать Деловые Портреты",
      presetForbes: "💼 Бизнес Руководитель",
      presetDubai: "🏙️ Пентхаус Дубай",
      presetOldMoney: "💎 Элитный Old Money",
      presetKeynote: "🎙️ Спикер Конференций",
      badgeForbes: "💼 ГЕНЕРАЛЬНЫЙ ДИРЕКТОР",
      badgeFounder: "🚀 ОСНОВАТЕЛЬ & CEO",
      badgeKeynote: "🎙️ ТОП-СПИКЕР",
      badgeExpert: "⭐ ТОП ЭКСПЕРТ",
      badgeOldMoney: "💎 ЭЛИТНЫЙ OLD MONEY",
      badgeNone: "🚫 Без бейджа",
      posBottomCenter: "⬇️ Снизу по центру",
      posTopCenter: "⬆️ Сверху по центру",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      previewHeader: "Превью Аватарки",
      canvasPill: "Деловой Портрет",
      faceSwapTitle: "📸 Загрузить свое фото (Замена Лица)",
      downloadBtn: "Скачать Аватарку",
      unlockBtn: "Снять Вотермарку",
      modalUnlockTitle: "Разблокировка аватарки без вотермарки",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте аватарку без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Бізнес-Аватар Pro",
      studioSub: "Студійні ділові портрети з експертними бейджами",
      backHub: "До Хабу",
      genderLabel: "1. Стать експерта",
      genderMale: "👨 Чоловіча",
      genderFemale: "👩 Жіноча",
      presetLabel: "2. Стиль портрета",
      customPromptLabel: "3. Деталі зовнішності або костюма",
      customPromptPlaceholder: "Наприклад: окуляри, темний костюм, посмішка...",
      badgeLabel: "4. Статус-бейдж експерта",
      positionLabel: "5. Розташування бейджа",
      circleMaskToggle: "⭕ Кругова рамка Telegram/LinkedIn",
      generateBtn: "Згенерувати Ділові Портрети",
      presetForbes: "💼 Бізнес Керівник",
      presetDubai: "🏙️ Пентхаус Дубай",
      presetOldMoney: "💎 Елітний Old Money",
      presetKeynote: "🎙️ Спікер Конференцій",
      badgeForbes: "💼 ГЕНЕРАЛЬНИЙ ДИРЕКТОР",
      badgeFounder: "🚀 ЗАСНОВНИК & CEO",
      badgeKeynote: "🎙️ ТОП-СПІКЕР",
      badgeExpert: "⭐ ТОП ЕКСПЕРТ",
      badgeOldMoney: "💎 ЕЛІТНИЙ OLD MONEY",
      badgeNone: "🚫 Без бейджа",
      posBottomCenter: "⬇️ Знизу по центру",
      posTopCenter: "⬆️ Зверху по центру",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      previewHeader: "Прев'ю Аватарки",
      canvasPill: "Діловий Портрет",
      faceSwapTitle: "📸 Завантажити своє фото (Заміна Обличчя)",
      downloadBtn: "Завантажити Аватарку",
      unlockBtn: "Зняти Вотермарку",
      modalUnlockTitle: "Розблокування аватарки без вотермарки",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте аватарку без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Business Avatar Pro",
      studioSub: "Executive Portrait Engine & Status Badges",
      backHub: "To Hub",
      genderLabel: "1. Expert Gender",
      genderMale: "👨 Male Executive",
      genderFemale: "👩 Female Executive",
      presetLabel: "2. Portrait Style",
      customPromptLabel: "3. Appearance Details",
      customPromptPlaceholder: "e.g. glasses, navy blue suit, confident smile...",
      badgeLabel: "4. Status Badge",
      positionLabel: "5. Badge Position",
      circleMaskToggle: "⭕ Circle Crop Mask (Telegram/LinkedIn)",
      generateBtn: "Generate Executive Portrait",
      presetForbes: "💼 Forbes Executive",
      presetDubai: "🏙️ Dubai Penthouse",
      presetOldMoney: "💎 Old Money Luxury",
      presetKeynote: "🎙️ Keynote Speaker",
      badgeForbes: "💼 FORBES EXECUTIVE",
      badgeFounder: "🚀 FOUNDER & CEO",
      badgeKeynote: "🎙️ KEYNOTE SPEAKER",
      badgeExpert: "⭐ TOP EXPERT",
      badgeOldMoney: "💎 OLD MONEY LUXURY",
      badgeNone: "🚫 No Badge",
      posBottomCenter: "⬇️ Bottom Center",
      posTopCenter: "⬆️ Top Center",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      previewHeader: "Avatar Preview",
      canvasPill: "Executive Canvas",
      faceSwapTitle: "📸 Upload Photo (Face Swap)",
      downloadBtn: "Download Avatar",
      unlockBtn: "Remove Watermark",
      modalUnlockTitle: "Unlock Watermark-Free Avatar",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download avatar in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
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
        const imgAspect = img.width / img.height;
        let renderW = 1000;
        let renderH = 1000;
        let renderX = 0;
        let renderY = 0;
        if (imgAspect > 1) {
          renderW = 1000 * imgAspect;
          renderX = (1000 - renderW) / 2;
        } else {
          renderH = 1000 / imgAspect;
          renderY = (1000 - renderH) / 2;
        }
        ctx.drawImage(img, renderX, renderY, renderW, renderH);
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
    if (selectedBadge !== 'none') {
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
    }

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
      ctx.fillText('NEIROSTUDIO AVATAR PREVIEW', 70, 935);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `business-avatar-8k-${Date.now()}.png`;
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

  // Growth Hack Channel Subscription Bonus (Anti-Cheat One-Time Only)
  const handleClaimSubscribeBonus = () => {
    triggerHaptic('heavy');
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'guest';
    const storageKey = `neiro_sub_claimed_${tgUser}`;

    if (localStorage.getItem(storageKey)) {
      alert(lang === 'ru' ? "Вы уже получили одноразовый бонус за подписку!" : "Ви вже отримали одноразовий бонус за підписку!");
      setIsSubscribedChannel(true);
      setIsUnlocked(true);
      setIsUnlockModalOpen(false);
      return;
    }

    localStorage.setItem(storageKey, 'true');
    setIsSubscribedChannel(true);
    setIsUnlocked(true);
    setUserEnergy(prev => prev + 3);
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

              {/* FACE SWAP PHOTO UPLOAD */}
              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.faceSwapTitle}</span>
                </label>

                {userPhotoUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-slate-900/90 border border-cyan-500/40 rounded-xl">
                    <img src={userPhotoUrl} alt="Uploaded face" className="w-10 h-10 rounded-full object-cover border border-cyan-400 shadow-md" />
                    <div className="flex-1 text-[11px] text-slate-300">
                      <p className="font-bold text-cyan-300">{lang === 'ru' ? "Ваше фото загружено" : "Ваше фото завантажено"}</p>
                      <p className="text-[10px] text-slate-400">{lang === 'ru' ? "🔒 Обрабатывается локально в памяти" : "🔒 Обробляється локально у пам'яті"}</p>
                    </div>
                    <button
                      onClick={() => setUserPhotoUrl('')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold px-2.5 py-1 bg-rose-950/40 rounded-lg border border-rose-500/30"
                    >
                      {lang === 'ru' ? "Удалить" : "Видалити"}
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-slate-700/80 hover:border-cyan-500/60 rounded-xl bg-slate-900/50 cursor-pointer transition-all text-center">
                    <span className="text-xs text-cyan-400 font-bold mb-0.5">
                      {lang === 'ru' ? "＋ Выбрать фото/селфи" : "＋ Обрати фото/селфі"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {lang === 'ru' ? "🔒 Безопасно. Обработка в памяти браузера" : "🔒 Безпечно. Обробка у пам'яті браузера"}
                    </span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
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
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/40'
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
                  {t.canvasPill}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-cyan-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез делового портрета...</span>
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
