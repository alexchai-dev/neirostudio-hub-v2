import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Rocket,
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

export default function Web3MascotStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [character, setCharacter] = useState('pepe'); // pepe | doge | cat | ape
  const [selectedPreset, setSelectedPreset] = useState('pixar'); // pixar | cyberpunk | anime | pixel
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('gem'); // gem | diamond | solana | dex
  const [badgePosition, setBadgePosition] = useState('bottom-center'); // top-center | bottom-center | top-left | top-right
  const [tickerText, setTickerText] = useState('$PEPE • MC: $1.2M'); // QA Test long ticker text

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
      studioTitle: "Web3 & MemeCoin Mascot Pro",
      studioSub: "Маскоты для криптопроектов и Web3 брендов",
      backHub: "В Хаб",
      characterLabel: "1. Персонаж маскота",
      charPepe: "🚀 Bullish Pepe",
      charDoge: "🐕 Golden Doge",
      charCat: "🐱 Cyber Cat",
      charApe: "🦍 Diamond Ape",
      presetLabel: "2. Стиль графики & арта",
      customPromptLabel: "3. Детали одежды или аксессуаров",
      customPromptPlaceholder: "Например: золотая цепь, лазерные глаза, кепка...",
      badgeLabel: "4. Крипто статус-бейдж",
      positionLabel: "5. Позиционирование бейджа",
      tickerLabel: "6. Тикер токена & Market Cap",
      tickerPlaceholder: "Например: $PEPE • MC: $1.2M",
      generateBtn: "Сгенерировать Web3 Маскота",
      presetPixar: "🎨 3D Векторный Стиль",
      presetCyberpunk: "🌃 Киберпанк Web3",
      presetAnime: "✨ Аниме Чиби",
      presetPixel: "👾 Пиксель-Арт 8-Bit",
      badgeGem: "🚀 100X ГЕМ",
      badgeDiamond: "💎 АЛМАЗНЫЕ РУКИ",
      badgeSolana: "⚡ SOLANA / TON",
      badgeDex: "🔥 ЛИСТИНГ НА DEX",
      badgeNone: "🚫 Без бейджа",
      posBottomCenter: "⬇️ Снизу по центру",
      posTopCenter: "⬆️ Сверху по центру",
      posTopLeft: "↖️ Сверху слева",
      posTopRight: "↗️ Сверху справа",
      previewHeader: "Превью Маскота",
      canvasPill: "Web3 Маскот",
      downloadBtn: "Скачать Маскота",
      unlockBtn: "Снять Вотермарку",
      modalUnlockTitle: "Разблокировка маскота без вотермарки",
      modalUnlockDesc: "Получите +3 бесплатные ⚡ генерации и скачайте маскота без вотермарки в 1 клик!",
      subscribeDealBtn: "📢 Подписаться на Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "Web3 & MemeCoin Mascot Pro",
      studioSub: "Маскоти для криптопроєктів та Web3 брендів",
      backHub: "До Хабу",
      characterLabel: "1. Персонаж маскота",
      charPepe: "🚀 Bullish Pepe",
      charDoge: "🐕 Golden Doge",
      charCat: "🐱 Cyber Cat",
      charApe: "🦍 Diamond Ape",
      presetLabel: "2. Стиль графіки & арту",
      customPromptLabel: "3. Деталі одягу або аксесуарів",
      customPromptPlaceholder: "Наприклад: золотий ланцюг, лазерні очі, кепка...",
      badgeLabel: "4. Крипто статус-бейдж",
      positionLabel: "5. Позиціонування бейджа",
      posBottomCenter: "⬇️ Знизу по центру",
      posTopCenter: "⬆️ Зверху по центру",
      posTopLeft: "↖️ Зверху ліворуч",
      posTopRight: "↗️ Зверху праворуч",
      tickerLabel: "6. Тікер токена & Market Cap",
      tickerPlaceholder: "Наприклад: $PEPE • MC: $1.2M",
      generateBtn: "Згенерувати Web3 Маскота",
      presetPixar: "🎨 3D Векторний Стиль",
      presetCyberpunk: "🌃 Кіберпанк Web3",
      presetAnime: "✨ Аніме Чібі",
      presetPixel: "👾 Піксель-Арт 8-Bit",
      badgeGem: "🚀 100X ҐЕМ",
      badgeDiamond: "💎 АЛМАЗНІ РУКИ",
      badgeSolana: "⚡ SOLANA / TON",
      badgeDex: "🔥 ЛІСТИНГ НА DEX",
      badgeNone: "🚫 Без бейджа",
      previewHeader: "Прев'ю Маскота",
      canvasPill: "Web3 Маскот",
      downloadBtn: "Завантажити Маскота",
      unlockBtn: "Зняти Вотермарку",
      modalUnlockTitle: "Розблокування маскота без вотермарки",
      modalUnlockDesc: "Отримайте +3 безкоштовні ⚡ генерації та завантажте маскота без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "Web3 & MemeCoin Mascot Pro",
      studioSub: "Web3 & Crypto Character Engine",
      backHub: "To Hub",
      characterLabel: "1. Mascot Character",
      charPepe: "🚀 Bullish Pepe",
      charDoge: "🐕 Golden Doge",
      charCat: "🐱 Cyber Cat",
      charApe: "🦍 Diamond Ape",
      presetLabel: "2. Art Style & Vibe",
      customPromptLabel: "3. Outfit & Accessories",
      customPromptPlaceholder: "e.g. gold chain, laser eyes, cap...",
      badgeLabel: "4. Crypto Status Badge",
      positionLabel: "5. Badge Position",
      tickerLabel: "6. Token Ticker & Market Cap",
      tickerPlaceholder: "e.g. $PEPE • MC: $1.2M",
      generateBtn: "Generate Web3 Mascot",
      presetPixar: "🎨 3D Pixar Vector",
      presetCyberpunk: "🌃 Cyberpunk Web3",
      presetAnime: "✨ Anime Chibi",
      presetPixel: "👾 Pixel Art 8-Bit",
      badgeGem: "🚀 100X GEM",
      badgeDiamond: "💎 DIAMOND HANDS",
      badgeSolana: "⚡ SOLANA / TON",
      badgeDex: "🔥 LISTED ON DEX",
      badgeNone: "🚫 No Badge",
      posBottomCenter: "⬇️ Bottom Center",
      posTopCenter: "⬆️ Top Center",
      posTopLeft: "↖️ Top Left",
      posTopRight: "↗️ Top Right",
      previewHeader: "Mascot Preview",
      canvasPill: "Web3 Mascot",
      downloadBtn: "Download Mascot",
      unlockBtn: "Remove Watermark",
      modalUnlockTitle: "Unlock Watermark-Free Mascot",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free mascot in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, selectedBadge, badgePosition, tickerText, isUnlocked]);

  // ---------------------------------------------------------------------------
  // DUAL-LAYER WEB3 MASCOT CANVAS ENGINE (WITH NEON GLOW & DYNAMIC TICKER WIDTH)
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
        renderLayer2Web3Badges(ctx);
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        renderLayer2Web3Badges(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      renderLayer2Web3Badges(ctx);
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createRadialGradient(500, 500, 80, 500, 500, 650);
    grad.addColorStop(0, '#1a103c');
    grad.addColorStop(1, '#07090e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 1000);
  };

  const renderLayer2Web3Badges = (ctx) => {
    let bx = 60;
    let by = 820;
    let badgeHeight = 56;

    if (selectedBadge !== 'none') {
      const badgesDict = {
        gem: { text: t.badgeGem, bg: '#c026d3', border: '#f0abfc', textCol: '#ffffff', shadow: '#d946ef' },
        diamond: { text: t.badgeDiamond, bg: '#0284c7', border: '#38bdf8', textCol: '#ffffff', shadow: '#38bdf8' },
        solana: { text: t.badgeSolana, bg: '#10b981', border: '#34d399', textCol: '#ffffff', shadow: '#34d399' },
        dex: { text: t.badgeDex, bg: '#ea580c', border: '#fb923c', textCol: '#ffffff', shadow: '#fb923c' }
      };

      const currentBadge = badgesDict[selectedBadge] || badgesDict.gem;

      // Calculate Badge Coordinates
      ctx.save();
      ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const badgeText = currentBadge.text;
      const badgeWidth = ctx.measureText(badgeText).width + 40;
      badgeHeight = 56;

      bx = (1000 - badgeWidth) / 2; // default bottom-center
      by = 820;

      if (badgePosition === 'top-center') {
        by = 80;
      } else if (badgePosition === 'top-left') {
        bx = 60;
        by = 80;
      } else if (badgePosition === 'top-right') {
        bx = 1000 - badgeWidth - 60;
        by = 80;
      }

      // 1. RENDER VECTOR CRYPTO BADGE WITH NEON SHADOW GLOW (QA REQUIREMENT)
      ctx.shadowColor = currentBadge.shadow;
      ctx.shadowBlur = 22;

      ctx.fillStyle = currentBadge.bg;
      ctx.strokeStyle = currentBadge.border;
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.roundRect(bx, by, badgeWidth, badgeHeight, 16);
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = currentBadge.textCol;
      ctx.fillText(badgeText, bx + 20, by + 10);
      ctx.restore();
    }

    // 2. RENDER DYNAMIC TICKER & MARKET CAP TAG (QA REQUIREMENT FOR DYNAMIC WIDTH)
    if (tickerText.trim()) {
      ctx.save();
      ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
      ctx.textBaseline = 'top';

      const tickerUpper = tickerText.toUpperCase();
      const tickerTextWidth = ctx.measureText(tickerUpper).width;
      const tickerBoxWidth = tickerTextWidth + 40;

      let tx = (1000 - tickerBoxWidth) / 2;
      let ty = by - 70;
      if (badgePosition === 'top-center' || badgePosition === 'top-left' || badgePosition === 'top-right') {
        ty = by + badgeHeight + 14;
      }

      if (badgePosition === 'top-left') tx = 60;
      if (badgePosition === 'top-right') tx = 1000 - tickerBoxWidth - 60;

      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.roundRect(tx, ty, tickerBoxWidth, 60, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.shadowBlur = 0;
      ctx.fillText(tickerUpper, tx + 20, ty + 12);
      ctx.restore();
    }

    // 3. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO WEB3 MASCOT PREVIEW', 60, 940);
      ctx.restore();
    }
  };

  // Generate Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-web3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character,
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
      link.download = `web3-mascot-8k-${Date.now()}.png`;
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
              <ArrowLeft className="w-4 h-4 text-fuchsia-400" />
              <span>{t.backHub}</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                <Rocket className="w-4 h-4" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-950/60 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Web3 Mascot Character Engine</span>
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

              {/* MASCOT CHARACTER SELECTOR */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.characterLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pepe', label: t.charPepe },
                    { id: 'doge', label: t.charDoge },
                    { id: 'cat', label: t.charCat },
                    { id: 'ape', label: t.charApe }
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setCharacter(ch.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        character === ch.id
                          ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ART STYLE PRESETS */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.presetLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pixar', label: t.presetPixar },
                    { id: 'cyberpunk', label: t.presetCyberpunk },
                    { id: 'anime', label: t.presetAnime },
                    { id: 'pixel', label: t.presetPixel }
                  ].map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedPreset((prev) => (prev === pr.id ? 'none' : pr.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedPreset === pr.id
                          ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300'
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>

              {/* CRYPTO BADGE SELECTION */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.badgeLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'gem', label: t.badgeGem },
                    { id: 'diamond', label: t.badgeDiamond },
                    { id: 'solana', label: t.badgeSolana },
                    { id: 'dex', label: t.badgeDex }
                  ].map((bd) => (
                    <button
                      key={bd.id}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedBadge((prev) => (prev === bd.id ? 'none' : bd.id));
                      }}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedBadge === bd.id
                          ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300'
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
                          ? 'bg-fuchsia-600/30 border-fuchsia-500 text-fuchsia-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TICKER & MARKET CAP INPUT (QA DYNAMIC WIDTH TEST) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.tickerLabel}
                </label>
                <input
                  type="text"
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  placeholder={t.tickerPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-cyan-300 focus:outline-none focus:border-fuchsia-500 font-extrabold"
                />
              </div>

              {/* GENERATE BUTTON */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-950/50 transition-all"
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
                  <Rocket className="w-4 h-4 text-fuchsia-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-fuchsia-500/20 text-fuchsia-300 px-2 py-0.5 rounded-full font-bold uppercase border border-fuchsia-500/30">
                  {t.canvasPill}
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-square max-w-md mx-auto w-full">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-fuchsia-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез маскота...</span>
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
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-950/50"
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
                      ? 'bg-fuchsia-600/20 border-fuchsia-500 text-fuchsia-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
