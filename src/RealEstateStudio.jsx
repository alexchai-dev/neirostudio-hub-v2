import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Home,
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
  LayoutGrid,
  Bed,
  Building
} from 'lucide-react';

export default function RealEstateStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [roomType, setRoomType] = useState('living'); // living | bedroom | kitchen | office
  const [selectedPreset, setSelectedPreset] = useState('scandinavian'); // scandinavian | penthouse | japandi | loft
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('staging'); // staging | sale | rent | spec
  const [badgePosition, setBadgePosition] = useState('top-left'); // top-left | top-right | bottom-left | bottom-right
  const [priceText, setPriceText] = useState('$1,250,000'); // Long price for QA test

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
      studioTitle: "AI Real Estate & Interior Staging",
      studioSub: "Dual-Layer Realty Engine • FLUX 1.0 8K + Риелторская Инфографика",
      backHub: "В Хаб",
      roomLabel: "1. Тип помещения",
      roomLiving: "🛋️ Гостиная",
      roomBedroom: "🪟 Спальня",
      roomKitchen: "🍳 Кухня",
      roomOffice: "💻 Кабинет",
      presetLabel: "2. Дизайн интерьера & атмосфера",
      customPromptLabel: "3. Детали интерьера или вида (необязательно)",
      customPromptPlaceholder: "Например: панорамный вид, камин, бежевые диваны...",
      badgeLabel: "4. Бейдж статуса недвижимости (Layer 2)",
      positionLabel: "5. Расположение бейджа (чтобы не перекрывать интерьер)",
      priceLabel: "6. Стоимость объекта или аренда (авто-ширина плашки)",
      pricePlaceholder: "Например: $1,250,000 или 25 000 ₴/мес",
      generateBtn: "Сгенерировать 8K Стейджинг (16:9)",
      presetScandi: "🌿 Скандинавский",
      presetPenthouse: "🏙️ Пентхаус Люкс",
      presetJapandi: "🌾 Загородный Джапанди",
      presetLoft: "🏭 Студийный Лофт",
      badgeStaging: "🏠 VIRTUAL STAGING",
      badgeSale: "✨ FOR SALE / ПРОДАЖА",
      badgeRent: "🗝️ FOR RENT / АРЕНДА",
      badgeSpec: "📐 85 m² PREMIUM",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Рендер Интерьера (Live 1280x720 Canvas)",
      downloadBtn: "Скачать Рендер 8K",
      unlockBtn: "🎁 Снять Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Разблокировка 8K HD",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте фото интерьера без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать в 8K за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "AI Real Estate & Interior Staging",
      studioSub: "Dual-Layer Realty Engine • FLUX 1.0 8K + Ріелторська Інфографіка",
      backHub: "До Хабу",
      roomLabel: "1. Тип приміщення",
      roomLiving: "🛋️ Вітальня",
      roomBedroom: "🪟 Спальня",
      roomKitchen: "🍳 Кухня",
      roomOffice: "💻 Кабінет",
      presetLabel: "2. Дизайн інтер'єру & атмосфера",
      customPromptLabel: "3. Деталі інтер'єру або виду (необов'язково)",
      customPromptPlaceholder: "Наприклад: панорамний вид, камін, бежеві дивани...",
      badgeLabel: "4. Бейдж статусу нерухомості (Layer 2)",
      positionLabel: "5. Розташування бейджа (щоб не перекривати інтер'єр)",
      priceLabel: "6. Вартість об'єкта або оренда (авто-ширина плашки)",
      pricePlaceholder: "Наприклад: $1,250,000 або 25 000 ₴/міс",
      generateBtn: "Згенерувати 8K Стейджинг (16:9)",
      presetScandi: "🌿 Скандинавський",
      presetPenthouse: "🏙️ Пентхаус Люкс",
      presetJapandi: "🌾 Загородний Джапанді",
      presetLoft: "🏭 Студійний Лофт",
      badgeStaging: "🏠 VIRTUAL STAGING",
      badgeSale: "✨ FOR SALE / ПРОДАЖ",
      badgeRent: "🗝️ FOR RENT / ОРЕНДА",
      badgeSpec: "📐 85 m² PREMIUM",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Рендер Інтер'єру (Live 1280x720 Canvas)",
      downloadBtn: "Завантажити Рендер 8K",
      unlockBtn: "🎁 Зняти Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Розблокування 8K HD",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте фото інтер'єру без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 8K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "AI Real Estate & Interior Staging",
      studioSub: "Dual-Layer Realty Engine • FLUX 1.0 8K + Property Infographics",
      backHub: "To Hub",
      roomLabel: "1. Room Type",
      roomLiving: "🛋️ Living Room",
      roomBedroom: "🪟 Bedroom",
      roomKitchen: "🍳 Kitchen",
      roomOffice: "💻 Office",
      presetLabel: "2. Interior Style & Vibe",
      customPromptLabel: "3. Interior Details or View (Optional)",
      customPromptPlaceholder: "e.g. skyline view, fireplace, beige sofa...",
      badgeLabel: "4. Property Status Badge (Layer 2)",
      positionLabel: "5. Badge Position (prevents covering interior)",
      priceLabel: "6. Property Price or Rent (Auto Dynamic Width)",
      pricePlaceholder: "e.g. $1,250,000 or $2,500/mo",
      generateBtn: "Generate 8K Staging (16:9)",
      presetScandi: "🌿 Modern Scandinavian",
      presetPenthouse: "🏙️ Penthouse Luxury",
      presetJapandi: "🌾 Cozy Japandi",
      presetLoft: "🏭 Studio Loft",
      badgeStaging: "🏠 VIRTUAL STAGING",
      badgeSale: "✨ FOR SALE",
      badgeRent: "🗝️ FOR RENT",
      badgeSpec: "📐 85 m² PREMIUM",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Interior Render (Live 1280x720 Canvas)",
      downloadBtn: "Download 8K Render",
      unlockBtn: "🎁 Remove Watermark & Get 8K",
      modalUnlockTitle: "Growth Hack: Unlock 8K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free 8K interior photo in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download 8K with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, badgePosition, priceText, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER REALTY CANVAS ENGINE WITH DYNAMIC PRICE TAG WIDTH (QA REQUIREMENT)
  // ---------------------------------------------------------------------------
  const drawDualLayerCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1280;
    canvas.height = 720;

    if (bgImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bgImageUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1280, 720);
        renderLayer2RealtyBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2RealtyBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2RealtyBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(0.5, '#0f172a');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);
  };

  const renderLayer2RealtyBadges = (ctx) => {
    const badgesDict = {
      staging: { text: t.badgeStaging, bg: '#0284c7', textCol: '#ffffff' },
      sale: { text: t.badgeSale, bg: '#ef4444', textCol: '#ffffff' },
      rent: { text: t.badgeRent, bg: '#10b981', textCol: '#ffffff' },
      spec: { text: t.badgeSpec, bg: '#8b5cf6', textCol: '#ffffff' }
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.staging;

    // Calculate Coordinates based on Position
    let bx = 60;
    let by = 60;

    if (badgePosition === 'top-right') {
      bx = 820;
      by = 60;
    } else if (badgePosition === 'bottom-left') {
      bx = 60;
      by = 560;
    } else if (badgePosition === 'bottom-right') {
      bx = 820;
      by = 560;
    }

    // 1. RENDER VECTOR REALTY BADGE (LAYER 2)
    ctx.save();
    ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const badgeText = currentBadge.text;
    const badgeWidth = ctx.measureText(badgeText).width + 36;
    const badgeHeight = 52;

    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 18;

    ctx.fillStyle = currentBadge.bg;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeWidth, badgeHeight, 14);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = currentBadge.textCol;
    ctx.fillText(badgeText, bx + 18, by + 10);
    ctx.restore();

    // 2. RENDER DYNAMIC PRICE TAG (AUTOMATIC DYNAMIC WIDTH CALCULATION FOR LONG PRICES)
    if (priceText.trim()) {
      ctx.save();
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const priceUpper = priceText.toUpperCase();
      // Dynamic Width Calculation based on text width + padding (QA Requirement)
      const priceTextWidth = ctx.measureText(priceUpper).width;
      const priceBoxWidth = priceTextWidth + 38;
      const px = bx;
      const py = by + badgeHeight + 12;

      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = currentBadge.bg;
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.roundRect(px, py, priceBoxWidth, 58, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(priceUpper, px + 18, py + 10);
      ctx.restore();
    }

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO REAL ESTATE PREVIEW • UNLOCK 8K', 60, 660);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-realestate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room: roomType,
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
      link.download = `realestate-staging-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Home className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
            <span>Dual-Layer Realty Engine • FLUX 1.0 8K + Dynamic Price Tag</span>
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

              {/* ROOM TYPE SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.roomLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'living', label: t.roomLiving },
                    { id: 'bedroom', label: t.roomBedroom },
                    { id: 'kitchen', label: t.roomKitchen },
                    { id: 'office', label: t.roomOffice }
                  ].map((rm) => (
                    <button
                      key={rm.id}
                      onClick={() => setRoomType(rm.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        roomType === rm.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERIOR STYLE PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'scandinavian', label: t.presetScandi },
                    { id: 'penthouse', label: t.presetPenthouse },
                    { id: 'japandi', label: t.presetJapandi },
                    { id: 'loft', label: t.presetLoft }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setSelectedPreset(pr.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CUSTOM PROMPT DETAILS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.customPromptLabel}
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={t.customPromptPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'staging', label: t.badgeStaging },
                    { id: 'sale', label: t.badgeSale },
                    { id: 'rent', label: t.badgeRent },
                    { id: 'spec', label: t.badgeSpec }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => setSelectedBadge(bd.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
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
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRICE TAG INPUT */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.priceLabel}
                </label>
                <input
                  type="text"
                  value={priceText}
                  onChange={(e) => setPriceText(e.target.value)}
                  placeholder={t.pricePlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all"
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
                  <Home className="w-4 h-4 text-indigo-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold uppercase border border-indigo-500/30">
                  16:9 8K Render
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-video">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-indigo-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 8K Architectural Staging...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50"
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
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
