import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  UtensilsCrossed,
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
  Flame as FireIcon
} from 'lucide-react';

export default function FoodStylingStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [category, setCategory] = useState('burgers'); // burgers | pizza | sushi | steak | desserts
  const [selectedPreset, setSelectedPreset] = useState('michelin'); // michelin | rustic | dark | clean
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('chef'); // chef | bestseller | vegan | spicy
  const [badgePosition, setBadgePosition] = useState('top-left'); // top-left | top-right | bottom-left | bottom-right
  const [specText, setSpecText] = useState('380g • 520 kcal | 290 ₴'); // QA Test long spec text

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
      studioTitle: "Food Menu Styling AI",
      studioSub: "Dual-Layer Culinary Engine • FLUX 1.0 8K + Ресторанная Инфографика",
      backHub: "В Хаб",
      categoryLabel: "1. Категория блюда",
      catBurgers: "🍔 Бургеры",
      catPizza: "🍕 Пицца",
      catSushi: "🍣 Суши",
      catSteak: "🥩 Стейки",
      catDesserts: "🍰 Десерты",
      presetLabel: "2. Кулинарный стиль & подача",
      customPromptLabel: "3. Детали ингредиентов (необязательно)",
      customPromptPlaceholder: "Например: двойной бекон, микрозелень, пар...",
      badgeLabel: "4. Гастрономический статус-бейдж (Layer 2)",
      positionLabel: "5. Расположение бейджа (чтобы не закрывать блюдо)",
      specLabel: "6. Вес, калории & цена (с высоким контрастом)",
      specPlaceholder: "Например: 380g • 520 kcal | 290 ₴",
      generateBtn: "Сгенерировать 8K Фуд-Фотографию",
      presetMichelin: "⭐ Michelin Fine Dining",
      presetRustic: "🪵 Rustic Board",
      presetDark: "🔥 Dark Moody Gastro",
      presetClean: "☀️ Bright Clean Delivery",
      badgeChef: "🍳 CHEF SPECIAL",
      badgeBestseller: "🔥 BESTSELLER",
      badgeVegan: "🌱 100% ORGANIC",
      badgeSpicy: "🌶️ SPICY HOT",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Превью Блюда (Live 1000x1000 Canvas)",
      downloadBtn: "Скачать Фуд-Фото 8K",
      unlockBtn: "🎁 Снять Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Разблокировка 8K HD",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте фото блюда без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать в 8K за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Food Menu Styling AI",
      studioSub: "Dual-Layer Culinary Engine • FLUX 1.0 8K + Ресторанна Інфографіка",
      backHub: "До Хабу",
      categoryLabel: "1. Категорія страви",
      catBurgers: "🍔 Бургери",
      catPizza: "🍕 Піца",
      catSushi: "🍣 Суші",
      catSteak: "🥩 Стейки",
      catDesserts: "🍰 Десерти",
      presetLabel: "2. Кулінарний стиль & подача",
      customPromptLabel: "3. Деталі інгредієнтів (необов'язково)",
      customPromptPlaceholder: "Наприклад: подвійний бекон, мікрозелень, пара...",
      badgeLabel: "4. Гастрономічний статус-бейдж (Layer 2)",
      positionLabel: "5. Розташування бейджа (щоб не закривати страву)",
      specLabel: "6. Вага, калорії & ціна (з високим контрастом)",
      specPlaceholder: "Наприклад: 380g • 520 kcal | 290 ₴",
      generateBtn: "Згенерувати 8K Фуд-Фотографію",
      presetMichelin: "⭐ Michelin Fine Dining",
      presetRustic: "🪵 Rustic Board",
      presetDark: "🔥 Dark Moody Gastro",
      presetClean: "☀️ Bright Clean Delivery",
      badgeChef: "🍳 CHEF SPECIAL",
      badgeBestseller: "🔥 BESTSELLER",
      badgeVegan: "🌱 100% ORGANIC",
      badgeSpicy: "🌶️ SPICY HOT",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Прев'ю Страви (Live 1000x1000 Canvas)",
      downloadBtn: "Завантажити Фуд-Фото 8K",
      unlockBtn: "🎁 Зняти Вотермарку & 8K HD",
      modalUnlockTitle: "Growth Hack: Розблокування 8K HD",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте фото страви без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 8K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Food Menu Styling AI",
      studioSub: "Dual-Layer Culinary Engine • FLUX 1.0 8K + Restaurant Infographics",
      backHub: "To Hub",
      categoryLabel: "1. Dish Category",
      catBurgers: "🍔 Burgers",
      catPizza: "🍕 Pizza",
      catSushi: "🍣 Sushi",
      catSteak: "🥩 Steaks",
      catDesserts: "🍰 Desserts",
      presetLabel: "2. Culinary Style & Plating",
      customPromptLabel: "3. Ingredient Details (Optional)",
      customPromptPlaceholder: "e.g. double bacon, microgreens, steam...",
      badgeLabel: "4. Gastro Status Badge (Layer 2)",
      positionLabel: "5. Badge Position (prevents covering food)",
      specLabel: "6. Weight, Calories & Price (High Contrast)",
      specPlaceholder: "e.g. 380g • 520 kcal | $14.99",
      generateBtn: "Generate 8K Food Photography",
      presetMichelin: "⭐ Michelin Fine Dining",
      presetRustic: "🪵 Rustic Board",
      presetDark: "🔥 Dark Moody Gastro",
      presetClean: "☀️ Bright Clean Delivery",
      badgeChef: "🍳 CHEF SPECIAL",
      badgeBestseller: "🔥 BESTSELLER",
      badgeVegan: "🌱 100% ORGANIC",
      badgeSpicy: "🌶️ SPICY HOT",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Dish Preview (Live 1000x1000 Canvas)",
      downloadBtn: "Download 8K Food Photo",
      unlockBtn: "🎁 Remove Watermark & Get 8K",
      modalUnlockTitle: "Growth Hack: Unlock 8K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free 8K food photo in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download 8K with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, badgePosition, specText, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER CULINARY CANVAS ENGINE WITH SOLID CONTRAST VIGNETTE (QA REQUIREMENT)
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
        renderLayer2GastroBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2GastroBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2GastroBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createRadialGradient(500, 500, 100, 500, 500, 600);
    grad.addColorStop(0, '#1c1917');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2GastroBadges = (ctx) => {
    let bx = 60;
    let by = 60;
    let badgeHeight = 52;
    let badgeBg = '#ea580c';

    if (badgePosition === 'top-right') {
      bx = 560;
      by = 60;
    } else if (badgePosition === 'bottom-left') {
      bx = 60;
      by = 820;
    } else if (badgePosition === 'bottom-right') {
      bx = 560;
      by = 820;
    }

    if (selectedBadge !== 'none') {
      const badgesDict = {
        chef: { text: t.badgeChef, bg: '#ea580c', textCol: '#ffffff' },
        bestseller: { text: t.badgeBestseller, bg: '#dc2626', textCol: '#ffffff' },
        vegan: { text: t.badgeVegan, bg: '#16a34a', textCol: '#ffffff' },
        spicy: { text: t.badgeSpicy, bg: '#b91c1c', textCol: '#ffffff' }
      };

      const currentBadge = badgesDict[selectedBadge] || badgesDict.chef;
      badgeBg = currentBadge.bg;

      // 1. RENDER VECTOR GASTRO BADGE (LAYER 2)
      ctx.save();
      ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const badgeText = currentBadge.text;
      const badgeWidth = ctx.measureText(badgeText).width + 36;
      badgeHeight = 52;

      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 18;

      ctx.fillStyle = currentBadge.bg;
      ctx.beginPath();
      ctx.roundRect(bx, by, badgeWidth, badgeHeight, 14);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = currentBadge.textCol;
      ctx.fillText(badgeText, bx + 18, by + 10);
      ctx.restore();
    }

    // 2. RENDER SOLID CONTRAST VIGNETTE SPEC & PRICE TAG (QA REQUIREMENT FOR COMPLEX FOOD TEXTURES)
    if (specText.trim()) {
      ctx.save();
      ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const specUpper = specText.toUpperCase();
      const specTextWidth = ctx.measureText(specUpper).width;
      const specBoxWidth = specTextWidth + 38;
      const px = bx;
      const py = selectedBadge !== 'none' ? by + badgeHeight + 12 : by;

      // Solid Dark Vignette Background (rgba(9,13,22,0.92)) so text never merges with food ingredients
      ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
      ctx.strokeStyle = badgeBg;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 16;

      ctx.beginPath();
      ctx.roundRect(px, py, specBoxWidth, 54, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.shadowBlur = 0;
      ctx.fillText(specUpper, px + 18, py + 11);
      ctx.restore();
    }

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO FOOD STYLING PREVIEW • UNLOCK 8K', 60, 940);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-food', {
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
      link.download = `food-styling-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <UtensilsCrossed className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/30 text-orange-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Dual-Layer Culinary Engine • High Contrast Gastro Vignette</span>
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

              {/* DISH CATEGORY SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.categoryLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'burgers', label: t.catBurgers },
                    { id: 'pizza', label: t.catPizza },
                    { id: 'sushi', label: t.catSushi },
                    { id: 'steak', label: t.catSteak },
                    { id: 'desserts', label: t.catDesserts }
                  ].map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setCategory(ct.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        category === ct.id
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CULINARY STYLE PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'michelin', label: t.presetMichelin },
                    { id: 'rustic', label: t.presetRustic },
                    { id: 'dark', label: t.presetDark },
                    { id: 'clean', label: t.presetClean }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedPreset((prev) => (prev === pr.id ? 'none' : pr.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'chef', label: t.badgeChef },
                    { id: 'bestseller', label: t.badgeBestseller },
                    { id: 'vegan', label: t.badgeVegan },
                    { id: 'spicy', label: t.badgeSpicy }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300'
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
                          ? 'bg-orange-600/30 border-orange-500 text-orange-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WEIGHT, CALORIES & PRICE TAG (QA CONTRAST TEST) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.specLabel}
                </label>
                <input
                  type="text"
                  value={specText}
                  onChange={(e) => setSpecText(e.target.value)}
                  placeholder={t.specPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500 font-bold"
                />
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition-all"
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
                  <UtensilsCrossed className="w-4 h-4 text-orange-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-bold uppercase border border-orange-500/30">
                  8K Culinary Canvas
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-orange-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 8K Culinary Photography...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50"
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
                      ? 'bg-orange-600/20 border-orange-500 text-orange-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
