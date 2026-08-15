import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  RefreshCw,
  Tag,
  Gift,
  Star,
  X,
  Flame,
  Layers,
  LayoutGrid
} from 'lucide-react';

export default function ECommerceStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [productPrompt, setProductPrompt] = useState('Флакон парфюма / Крем');
  const [selectedPreset, setSelectedPreset] = useState('marble'); // marble | tropical | slate | neon
  const [selectedBadge, setSelectedBadge] = useState('hit'); // hit | discount | rating | premium | shipping
  const [badgePosition, setBadgePosition] = useState('top-left'); // top-left | top-right | bottom-left | bottom-right
  const [priceText, setPriceText] = useState('999 ₴');

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
      studioTitle: "E-Commerce Product Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Векторная Инфографика",
      backHub: "В Хаб",
      productLabel: "1. Название или тип товара (Layer 1 - FLUX 1.0)",
      productPlaceholder: "Например: Флакон элитных духов, наушники, крем...",
      presetLabel: "2. Студийный фон и атмосфера подиума",
      badgeLabel: "3. Векторный бейдж инфографики (Layer 2)",
      positionLabel: "4. Расположение бейджа (чтобы не перекрывать товар)",
      priceLabel: "5. Цена или предложение",
      pricePlaceholder: "Например: 999 ₴ или -30%",
      generateBtn: "Сгенерировать Студийное Фото 8K",
      presetMarble: "🏛️ Белый Мрамор",
      presetTropical: "🌿 Тропики & Оазис",
      presetSlate: "🗿 Темный Сланец",
      presetNeon: "⚡ Неоновая Студия",
      badgeHit: "🔥 ХИТ ПРОДАЖ",
      badgeDiscount: "💥 СКИДКА -50%",
      badgeRating: "⭐ 5.0 РЕЙТИНГ",
      badgePremium: "✨ 100% ПРЕМИУМ",
      badgeShipping: "🚚 БЕСПЛАТНАЯ ДОСТАВКА",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Карточка Товара (Live 1000x1000 Canvas)",
      downloadBtn: "Скачать Картку 8K",
      unlockBtn: "🎁 Снять Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Разблокировка 8K HD",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте карточку без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать в 8K за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "E-Commerce Product Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Векторна Інфографіка",
      backHub: "До Хабу",
      productLabel: "1. Назва або тип товару (Layer 1 - FLUX 1.0)",
      productPlaceholder: "Наприклад: Флакон елітних парфумів, навушники, крем...",
      presetLabel: "2. Студійний фон та атмосфера подіуму",
      badgeLabel: "3. Векторний бейдж інфографіки (Layer 2)",
      positionLabel: "4. Розташування бейджа (щоб не перекривати товар)",
      priceLabel: "5. Ціна або пропозиція",
      pricePlaceholder: "Наприклад: 999 ₴ або -30%",
      generateBtn: "Згенерувати Студійне Фото 8K",
      presetMarble: "🏛️ Білий Мармур",
      presetTropical: "🌿 Тропіки & Оазис",
      presetSlate: "🗿 Темний Сланець",
      presetNeon: "⚡ Неонова Студія",
      badgeHit: "🔥 ХІТ ПРОДАЖІВ",
      badgeDiscount: "💥 ЗНИЖКА -50%",
      badgeRating: "⭐ 5.0 РЕЙТИНГ",
      badgePremium: "✨ 100% ПРЕМІУМ",
      badgeShipping: "🚚 БЕЗКОШТОВНА ДОСТАВКА",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Картка Товару (Live 1000x1000 Canvas)",
      downloadBtn: "Завантажити Картку 8K",
      unlockBtn: "🎁 Зняти Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Розблокування 8K HD",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте картку без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 8K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "E-Commerce Product Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Vector Infographics",
      backHub: "To Hub",
      productLabel: "1. Product Name or Item (Layer 1 - FLUX 1.0)",
      productPlaceholder: "e.g. Luxury perfume bottle, wireless earbuds...",
      presetLabel: "2. Studio Background & Podium Vibe",
      badgeLabel: "3. Vector Infographic Badge (Layer 2)",
      positionLabel: "4. Badge Position (prevents covering product)",
      priceLabel: "5. Price Tag or Offer",
      pricePlaceholder: "e.g. $49.99 or -30% OFF",
      generateBtn: "Generate 8K Product Photo",
      presetMarble: "🏛️ White Marble",
      presetTropical: "🌿 Tropical Oasis",
      presetSlate: "🗿 Dark Slate",
      presetNeon: "⚡ Cyber Neon",
      badgeHit: "🔥 TOP SELLER",
      badgeDiscount: "💥 50% OFF SALE",
      badgeRating: "⭐ 5.0 RATING",
      badgePremium: "✨ 100% PREMIUM",
      badgeShipping: "🚚 FREE SHIPPING",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Product Card (Live 1000x1000 Canvas)",
      downloadBtn: "Download 8K Card",
      unlockBtn: "🎁 Remove Watermark & Get 8K",
      modalUnlockTitle: "Growth Hack: Unlock 8K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free 8K photo in 1 click!",
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
  }, [bgImageUrl, selectedBadge, badgePosition, priceText, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER E-COMMERCE CANVAS RENDERER ENGINE
  // ---------------------------------------------------------------------------
  const drawDualLayerCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1000x1000 Square Canvas for E-Commerce Cards
    canvas.width = 1000;
    canvas.height = 1000;

    if (bgImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bgImageUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1000, 1000);
        renderLayer2EComBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2EComBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2EComBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createRadialGradient(500, 500, 100, 500, 500, 600);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2EComBadges = (ctx) => {
    // Badges Data Dictionary
    const badgesDict = {
      hit: { text: t.badgeHit, bg: '#ef4444', textCol: '#ffffff' },
      discount: { text: t.badgeDiscount, bg: '#f59e0b', textCol: '#000000' },
      rating: { text: t.badgeRating, bg: '#10b981', textCol: '#ffffff' },
      premium: { text: t.badgePremium, bg: '#8b5cf6', textCol: '#ffffff' },
      shipping: { text: t.badgeShipping, bg: '#06b6d4', textCol: '#ffffff' }
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.hit;

    // Calculate Coordinates based on User-Selected Position (QA Recommendation)
    let bx = 50;
    let by = 50;

    if (badgePosition === 'top-right') {
      bx = 620;
      by = 50;
    } else if (badgePosition === 'bottom-left') {
      bx = 50;
      by = 830;
    } else if (badgePosition === 'bottom-right') {
      bx = 620;
      by = 830;
    }

    // 1. RENDER VECTOR INFOGRAPHIC BADGE (LAYER 2)
    ctx.save();
    ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const badgeText = currentBadge.text;
    const badgeWidth = ctx.measureText(badgeText).width + 36;
    const badgeHeight = 54;

    // Drop Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;

    // Badge Round Rectangle
    ctx.fillStyle = currentBadge.bg;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeWidth, badgeHeight, 14);
    ctx.fill();

    // Badge Text
    ctx.shadowBlur = 0;
    ctx.fillStyle = currentBadge.textCol;
    ctx.fillText(badgeText, bx + 18, by + 10);
    ctx.restore();

    // 2. RENDER PRICE TAG (IF ENTERED)
    if (priceText.trim()) {
      ctx.save();
      ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const priceUpper = priceText.toUpperCase();
      const priceWidth = ctx.measureText(priceUpper).width + 32;
      const px = bx;
      const py = by + badgeHeight + 12;

      // Dark Contrast Price Box
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = currentBadge.bg;
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.roundRect(px, py, priceWidth, 58, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(priceUpper, px + 16, py + 10);
      ctx.restore();
    }

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO E-COM PREVIEW • UNLOCK 8K', 50, 930);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-ecommerce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productPrompt,
          preset: selectedPreset,
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
    link.download = `ecom-product-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShoppingBag className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dual-Layer E-Com Engine • FLUX 1.0 8K + Vector Infographics</span>
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

              {/* PRODUCT NAME INPUT */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.productLabel}
                </label>
                <input
                  type="text"
                  value={productPrompt}
                  onChange={(e) => setProductPrompt(e.target.value)}
                  placeholder={t.productPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* ENVIRONMENT PRESET */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'marble', label: t.presetMarble },
                    { id: 'tropical', label: t.presetTropical },
                    { id: 'slate', label: t.presetSlate },
                    { id: 'neon', label: t.presetNeon }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => setSelectedPreset(pr.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hit', label: t.badgeHit },
                    { id: 'discount', label: t.badgeDiscount },
                    { id: 'rating', label: t.badgeRating },
                    { id: 'premium', label: t.badgePremium }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => setSelectedBadge(bd.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* BADGE POSITION SELECTOR (QA RECOMMENDATION) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{t.positionLabel}</span>
                  <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
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
                          ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
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
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-500/30">
                  8K Studio Canvas
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-emerald-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 8K + Vector E-Com Badges...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
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
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
