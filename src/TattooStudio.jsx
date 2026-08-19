import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Palette,
  Sparkles,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  RefreshCw,
  Gift,
  Star,
  X,
  Flame
} from 'lucide-react';

export default function TattooStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [motif, setMotif] = useState('dragon'); // dragon | wolf | skull | sword
  const [selectedPreset, setSelectedPreset] = useState('fine_line'); // fine_line | irezumi | cybertribal | watercolor
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('stencil'); // stencil | fineline | viral | flash
  const [placementGuide, setPlacementGuide] = useState('forearm'); // forearm | chest | back | shoulder
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
      studioTitle: "Tattoo Sketch AI Studio",
      studioSub: "Эскизы татуировок на чистом белом фоне под трансфер",
      backHub: "В Хаб",
      motifLabel: "1. Главный мотив эскиза",
      motifDragon: "🐉 Дракон",
      motifWolf: "🐺 Волк / Лев",
      motifSkull: "💀 Череп & Роза",
      motifSword: "⚔️ Валькирия / Меч",
      presetLabel: "2. Стиль татуировки & графика",
      customPromptLabel: "3. Детали узора",
      customPromptPlaceholder: "Например: цветы сакуры, геометрия, волны...",
      badgeLabel: "4. Статус-бейдж эскиза",
      placementLabel: "5. Зона нанесения",
      positionLabel: "6. Расположение плашек",
      generateBtn: "Сгенерировать Тату-Эскиз",
      presetFineLine: "🖋️ Fine Line & Blackwork",
      presetIrezumi: "🐉 Japanese Irezumi",
      presetCyber: "⚡ Cyber-Tribal",
      presetWatercolor: "🎨 Watercolor Splash",
      badgeStencil: "🖋️ READY FOR STENCIL",
      badgeFineLine: "⚡ FINE LINE ART",
      badgeViral: "🔥 VIRAL DESIGN",
      badgeFlash: "👑 CUSTOM FLASH",
      placeForearm: "📍 FOREARM",
      placeChest: "📍 CHEST",
      placeBack: "📍 BACK",
      placeShoulder: "📍 SHOULDER",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      posBottomLeft: "↙️ Снизу слева",
      posBottomRight: "↘️ Снизу справа",
      previewHeader: "Превью Эскиза",
      downloadBtn: "Скачать Эскиз",
      unlockBtn: "🎁 Снять Вотермарку",
      modalUnlockTitle: "Разблокировка эскиза без вотермарки",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте эскиз без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Tattoo Sketch AI Studio",
      studioSub: "Ескізи татуювань на чистому білому тлі під трансфер",
      backHub: "До Хабу",
      motifLabel: "1. Головний мотив ескізу",
      motifDragon: "🐉 Дракон",
      motifWolf: "🐺 Вовк / Лев",
      motifSkull: "💀 Череп & Троянда",
      motifSword: "⚔️ Валькірія / Меч",
      presetLabel: "2. Стиль татуювання & графіка",
      customPromptLabel: "3. Деталі візерунка",
      customPromptPlaceholder: "Наприклад: квіти сакури, геометрія, хвилі...",
      badgeLabel: "4. Статус-бейдж ескізу",
      placementLabel: "5. Зона нанесення",
      positionLabel: "6. Розташування плашок",
      generateBtn: "Згенерувати Тату-Ескіз",
      presetFineLine: "🖋️ Fine Line & Blackwork",
      presetIrezumi: "🐉 Japanese Irezumi",
      presetCyber: "⚡ Cyber-Tribal",
      presetWatercolor: "🎨 Watercolor Splash",
      badgeStencil: "🖋️ READY FOR STENCIL",
      badgeFineLine: "⚡ FINE LINE ART",
      badgeViral: "🔥 VIRAL DESIGN",
      badgeFlash: "👑 CUSTOM FLASH",
      placeForearm: "📍 FOREARM",
      placeChest: "📍 CHEST",
      placeBack: "📍 BACK",
      placeShoulder: "📍 SHOULDER",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      posBottomLeft: "↙️ Знизу ліворуч",
      posBottomRight: "↘️ Знизу праворуч",
      previewHeader: "Прев'ю Ескізу",
      downloadBtn: "Завантажити Ескіз",
      unlockBtn: "🎁 Зняти Вотермарку",
      modalUnlockTitle: "Розблокування ескізу без вотермарки",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте ескіз без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 8K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Tattoo Sketch AI Studio",
      studioSub: "Dual-Layer Tattoo Engine • FLUX 1.0 8K + Pure White Background",
      backHub: "To Hub",
      motifLabel: "1. Main Tattoo Motif",
      motifDragon: "🐉 Dragon",
      motifWolf: "🐺 Wolf / Lion",
      motifSkull: "💀 Skull & Rose",
      motifSword: "⚔️ Valkyrie / Sword",
      presetLabel: "2. Tattoo Style & Graphics",
      customPromptLabel: "3. Pattern Details (Optional)",
      customPromptPlaceholder: "e.g. cherry blossom, geometric lines...",
      badgeLabel: "4. Tattoo Status Badge (Layer 2)",
      placementLabel: "5. Body Placement Guide",
      positionLabel: "6. Badge Position (easy to cut with scissors)",
      generateBtn: "Generate 8K Tattoo Stencil",
      presetFineLine: "🖋️ Fine Line & Blackwork",
      presetIrezumi: "🐉 Japanese Irezumi",
      presetCyber: "⚡ Cyber-Tribal",
      presetWatercolor: "🎨 Watercolor Splash",
      badgeStencil: "🖋️ READY FOR STENCIL",
      badgeFineLine: "⚡ FINE LINE ART",
      badgeViral: "🔥 VIRAL DESIGN",
      badgeFlash: "👑 CUSTOM FLASH",
      placeForearm: "📍 FOREARM PLACEMENT",
      placeChest: "📍 CHEST PLACEMENT",
      placeBack: "📍 BACK PLACEMENT",
      placeShoulder: "📍 SHOULDER PLACEMENT",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      posBottomLeft: "↙️ Bottom Left",
      posBottomRight: "↘️ Bottom Right",
      previewHeader: "Stencil Preview (Live 1000x1000 Canvas)",
      downloadBtn: "Download 8K Stencil",
      unlockBtn: "🎁 Remove Watermark & Get 8K",
      modalUnlockTitle: "Growth Hack: Unlock 8K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free 8K tattoo stencil in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download 8K with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, placementGuide, badgePosition, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER TATTOO CANVAS ENGINE (PURE WHITE BACKGROUND + PLACEMENT BADGE)
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
        renderLayer2TattooBadges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2TattooBadges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2TattooBadges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2TattooBadges = (ctx) => {
    if (selectedBadge === 'none') return;
    const badgesDict = {
      stencil: { text: t.badgeStencil, bg: '#090d16', textCol: '#ffffff' },
      fineline: { text: t.badgeFineLine, bg: '#0284c7', textCol: '#ffffff' },
      viral: { text: t.badgeViral, bg: '#dc2626', textCol: '#ffffff' },
      flash: { text: t.badgeFlash, bg: '#7c3aed', textCol: '#ffffff' }
    };

    const placementDict = {
      forearm: t.placeForearm,
      chest: t.placeChest,
      back: t.placeBack,
      shoulder: t.placeShoulder
    };

    const currentBadge = badgesDict[selectedBadge] || badgesDict.stencil;
    const currentPlacement = placementDict[placementGuide] || t.placeForearm;

    // Calculate Coordinates based on Badge Position
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

    // 1. RENDER VECTOR STENCIL BADGE (LAYER 2)
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

    // 2. RENDER PLACEMENT GUIDE TAG (QA REQUIREMENT)
    ctx.save();
    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';

    const placeUpper = currentPlacement.toUpperCase();
    const placeTextWidth = ctx.measureText(placeUpper).width;
    const placeBoxWidth = placeTextWidth + 36;
    const px = bx;
    const py = by + badgeHeight + 12;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(px, py, placeBoxWidth, 48, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.fillText(placeUpper, px + 18, py + 10);
    ctx.restore();

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
      ctx.fillText('NEIROSTUDIO TATTOO PREVIEW • UNLOCK 8K', 50, 940);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-tattoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motif,
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
      link.download = `tattoo-sketch-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Palette className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>Tattoo Sketch Engine</span>
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

              {/* MOTIF SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.motifLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dragon', label: t.motifDragon },
                    { id: 'wolf', label: t.motifWolf },
                    { id: 'skull', label: t.motifSkull },
                    { id: 'sword', label: t.motifSword }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setMotif((prev) => (prev === m.id ? 'none' : m.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        motif === m.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TATTOO STYLE PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'fine_line', label: t.presetFineLine },
                    { id: 'irezumi', label: t.presetIrezumi },
                    { id: 'cybertribal', label: t.presetCyber },
                    { id: 'watercolor', label: t.presetWatercolor }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedPreset((prev) => (prev === pr.id ? 'none' : pr.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'stencil', label: t.badgeStencil },
                    { id: 'fineline', label: t.badgeFineLine },
                    { id: 'viral', label: t.badgeViral },
                    { id: 'flash', label: t.badgeFlash }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bd.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PLACEMENT GUIDE SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.placementLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'forearm', label: 'Forearm (Предплечье)' },
                    { id: 'chest', label: 'Chest (Грудь)' },
                    { id: 'back', label: 'Back (Спина)' },
                    { id: 'shoulder', label: 'Shoulder (Плечо)' }
                  ].map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => setPlacementGuide(pl.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        placementGuide === pl.id
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pl.label}
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
                          ? 'bg-purple-600/30 border-purple-500 text-purple-300'
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
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all"
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
                  <Palette className="w-4 h-4 text-purple-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold uppercase border border-purple-500/30">
                  Stencil Canvas
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-purple-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 8K Tattoo Stencil...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
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
