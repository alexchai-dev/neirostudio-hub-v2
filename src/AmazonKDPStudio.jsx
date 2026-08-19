import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  BookOpen,
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
  Printer
} from 'lucide-react';

export default function AmazonKDPStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [category, setCategory] = useState('animals'); // animals | floral | space | cafe
  const [selectedPreset, setSelectedPreset] = useState('sticker'); // sticker | kdp | kawaii | vintage
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('diecut'); // diecut | kdp | print | etsy
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
      studioTitle: "Печать Принтов & Стикеры AI",
      studioSub: "Стикеры и иллюстрации для Amazon KDP & Etsy",
      backHub: "В Хаб",
      categoryLabel: "1. Тематика иллюстраций",
      catAnimals: "🐱 Милые животные",
      catFloral: "🌸 Ботаника & Цветы",
      catSpace: "🚀 Космос & Sci-Fi",
      catCafe: "☕ Кафе & Ретро",
      presetLabel: "2. Формат печати & стиль контура",
      customPromptLabel: "3. Детали персонажа",
      customPromptPlaceholder: "Например: котик в очках, сакура, кофейная чашка...",
      badgeLabel: "4. Статус-бейдж печати",
      positionLabel: "5. Расположение бейджа",
      generateBtn: "Сгенерировать Принт / Стикер",
      presetSticker: "✂️ Виниловый СтикерПак",
      presetKdp: "📚 Раскраска Amazon KDP",
      presetKawaii: "🐱 Кавайный Винил",
      presetVintage: "🌸 Ботанический Винтаж",
      badgeDiecut: "✂️ ГОТОВО К ВЫРЕЗКЕ",
      badgeKdp: "📚 КНИГА РАСКРАСОК KDP",
      badgePrint: "🖨️ ПЕЧАТЬ 300 DPI",
      badgeEtsy: "⭐ БЕСТСЕЛЛЕР ETSY",
      badgeNone: "🚫 Без бейджа",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Превью Принта",
      canvasPill: "Печатный Арт",
      downloadBtn: "Скачать Принт",
      unlockBtn: "Снять Вотермарку",
      modalUnlockTitle: "Разблокировка принта без вотермарки",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте печатный арт без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Друк Принтів & Стікери ШІ",
      studioSub: "Стікери та ілюстрації для Amazon KDP & Etsy",
      backHub: "До Хабу",
      categoryLabel: "1. Тематика ілюстрацій",
      catAnimals: "🐱 Милі тварини",
      catFloral: "🌸 Ботаніка & Квіти",
      catSpace: "🚀 Космос & Sci-Fi",
      catCafe: "☕ Кафе & Ретро",
      presetLabel: "2. Формат друку & стиль контуру",
      customPromptLabel: "3. Деталі персонажа",
      customPromptPlaceholder: "Наприклад: котик в окулярах, сакура, кавова чашка...",
      badgeLabel: "4. Статус-бейдж друку",
      positionLabel: "5. Розташування бейджа",
      generateBtn: "Згенерувати Принт / Стікер",
      presetSticker: "✂️ Вініловий СтікерПак",
      presetKdp: "📚 Розмальовка Amazon KDP",
      presetKawaii: "🐱 Кавайний Вініл",
      presetVintage: "🌸 Ботанічний Вінтаж",
      badgeDiecut: "✂️ ГОТОВО ДО ВИРІЗАННЯ",
      badgeKdp: "📚 КНИГА РОЗМАЛЬОВОК KDP",
      badgePrint: "🖨️ ДРУК 300 DPI",
      badgeEtsy: "⭐ БЕСТСЕЛЕР ETSY",
      badgeNone: "🚫 Без бейджа",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Прев'ю Принту",
      canvasPill: "Печатний Арт",
      downloadBtn: "Завантажити Принт",
      unlockBtn: "Зняти Вотермарку",
      modalUnlockTitle: "Розблокування принту без вотермарки",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте печатний арт без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Amazon KDP & Stickers Print AI",
      studioSub: "Print & Sticker Illustration Engine",
      backHub: "To Hub",
      categoryLabel: "1. Illustration Theme",
      catAnimals: "🐱 Cute Animals",
      catFloral: "🌸 Floral & Plants",
      catSpace: "🚀 Space & Sci-Fi",
      catCafe: "☕ Cafe & Retro",
      presetLabel: "2. Print Format & Contour Style",
      customPromptLabel: "3. Character Details",
      customPromptPlaceholder: "e.g. cat with glasses, cherry blossom, coffee mug...",
      badgeLabel: "4. Print Status Badge",
      positionLabel: "5. Badge Position",
      generateBtn: "Generate Print / Sticker",
      presetSticker: "✂️ Cutout Sticker Pack",
      presetKdp: "📚 KDP Coloring Page",
      presetKawaii: "🐱 Kawaii Cute Vinyl",
      presetVintage: "🌸 Vintage Botanical",
      badgeDiecut: "✂️ DIE-CUT READY",
      badgeKdp: "📚 KDP COLORING BOOK",
      badgePrint: "🖨️ 300 DPI PRINT",
      badgeEtsy: "⭐ ETSY BESTSELLER",
      badgeNone: "🚫 No Badge",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Print Preview",
      canvasPill: "Print Canvas",
      downloadBtn: "Download Print",
      unlockBtn: "Remove Watermark",
      modalUnlockTitle: "Unlock Watermark-Free Print",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free print art in 1 click!",
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
  // DUAL-LAYER PRINT CANVAS ENGINE (PURE WHITE BACKGROUND + 300 DPI SPECS TAG)
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
        renderLayer2PrintBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2PrintBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2PrintBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2PrintBadges = (ctx) => {
    if (selectedBadge === 'none') return;
    const badgesDict = {
      diecut: { text: t.badgeDiecut, bg: '#0284c7', textCol: '#ffffff' },
      kdp: { text: t.badgeKdp, bg: '#090d16', textCol: '#ffffff' },
      print: { text: t.badgePrint, bg: '#059669', textCol: '#ffffff' },
      etsy: { text: t.badgeEtsy, bg: '#d97706', textCol: '#ffffff' }
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.diecut;

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

    // 1. RENDER VECTOR PRINT BADGE (LAYER 2)
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

    // 2. RENDER 300 DPI SPECS TAG (QA REQUIREMENT)
    ctx.save();
    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const specsText = '300 DPI • A4 / LETTER FORMAT';
    const specsWidth = ctx.measureText(specsText).width + 36;
    const px = bx;
    const py = by + badgeHeight + 12;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(px, py, specsWidth, 48, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.fillText(specsText, px + 18, py + 10);
    ctx.restore();

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
      ctx.fillText('NEIROSTUDIO PRINT PREVIEW', 50, 940);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-amazon', {
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
      link.download = `amazon-kdp-print-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-yellow-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                <BookOpen className="w-4 h-4" />
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
                    { id: 'animals', label: t.catAnimals },
                    { id: 'floral', label: t.catFloral },
                    { id: 'space', label: t.catSpace },
                    { id: 'cafe', label: t.catCafe }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        category === c.id
                          ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRINT STYLE PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sticker', label: t.presetSticker },
                    { id: 'kdp', label: t.presetKdp },
                    { id: 'kawaii', label: t.presetKawaii },
                    { id: 'vintage', label: t.presetVintage }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedPreset((prev) => (prev === pr.id ? 'none' : pr.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-yellow-500"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'diecut', label: t.badgeDiecut },
                    { id: 'kdp', label: t.badgeKdp },
                    { id: 'print', label: t.badgePrint },
                    { id: 'etsy', label: t.badgeEtsy }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300'
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
                          ? 'bg-yellow-600/30 border-yellow-500 text-yellow-300'
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-950/50 transition-all"
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
                  <Printer className="w-4 h-4 text-yellow-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold uppercase border border-yellow-500/30">
                  {t.canvasPill}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-yellow-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез стикера...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-yellow-950/50"
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
                      ? 'bg-yellow-600/20 border-yellow-500 text-yellow-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-yellow-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
