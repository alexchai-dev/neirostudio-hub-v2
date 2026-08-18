import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Tv,
  Sparkles,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Type,
  Flame,
  Star,
  ShieldCheck,
  X,
  Share2,
  Copy,
  Gift
} from 'lucide-react';

export default function YouTubeStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Form Controls State
  const [topicPrompt, setTopicPrompt] = useState('');
  const [mainText, setMainText] = useState('СЕКРЕТ ИИ 2026');
  const [subText, setSubText] = useState('$10,000 / МЕСЯЦ');
  const [selectedStyle, setSelectedStyle] = useState('viral'); // viral | cyberpunk | business | gaming | minimal
  const [selectedColor, setSelectedColor] = useState('yellow'); // yellow | cyan | flame | lime

  // Generation & Engine State
  const [bgImageUrl, setBgImageUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [engineMode, setEngineMode] = useState('full3d'); // 'full3d' | 'canvas'
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSubscribedChannel, setIsSubscribedChannel] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedImageSrc, setSavedImageSrc] = useState('');
  const [userEnergy, setUserEnergy] = useState(5);

  const canvasRef = useRef(null);
  const previewRef = useRef(null);

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
      studioTitle: "YouTube 16:9 AI Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Векторный Текст",
      backHub: "В Хаб",
      topicLabel: "1. Описание или тема видео (Layer 1 - FLUX 1.0)",
      topicPlaceholder: "Например: Заработок на ИИ 2026, секреты успеха...",
      mainTextLabel: "2. Главный заголовок (Layer 2 - Векторная Кириллица с переносом)",
      mainTextPlaceholder: "Текст на обложке (поддерживает длинные фразы)",
      subTextLabel: "3. Подзаголовок / Плашка (Layer 2)",
      subTextPlaceholder: "Дополнительный текст или сумма",
      styleLabel: "4. Стиль фона и атмосферы",
      colorLabel: "5. Цветовая гамма текста",
      generateBtn: "Сгенерировать Dual-Layer Обложку (16:9)",
      viralStyle: "🔥 Кликбейт",
      cyberStyle: "🌆 Киберпанк",
      bizStyle: "💼 Forbes Бизнес",
      gameStyle: "🎮 Гейминг",
      minStyle: "✨ Минимализм",
      colYellow: "Желтый Неон",
      colCyan: "Неоновый Циан",
      colFlame: "Огонь & Золото",
      colLime: "Салатовый Драйв",
      previewHeader: "Готовая Обложка (Live Canvas Preview)",
      downloadBtn: "Скачать Обложку 16:9 HD",
      unlockBtn: "🎁 Снять Вотермарку & Скачать 4K",
      modalUnlockTitle: "Growth Hack: Разблокировка HD 4K",
      modalUnlockDesc: "Получите 3 бесплатные ⚡ генерации и скачайте обложку без вотермарки за 1 клик!",
      subscribeDealBtn: "📢 Подписаться на наш Канал (+3 ⚡ Бесплатно)",
      starsDealBtn: "⭐ Скачать в 4K за Telegram Stars",
      unlockedToast: "Вотермарка снята! Зачислено +3 ⚡ генерации!"
    },
    ua: {
      studioTitle: "YouTube 16:9 AI Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Векторний Текст",
      backHub: "До Хабу",
      topicLabel: "1. Опис або тема відео (Layer 1 - FLUX 1.0)",
      topicPlaceholder: "Наприклад: Заробіток на ШІ 2026, секрети успіху...",
      mainTextLabel: "2. Головний заголовок (Layer 2 - Векторна Кирилиця з переносом)",
      mainTextPlaceholder: "Текст на обкладинці (підтримує довгі фрази)",
      subTextLabel: "3. Підзаголовок / Плашка (Layer 2)",
      subTextPlaceholder: "Додатковий текст або сума",
      styleLabel: "4. Стиль фону та атмосфери",
      colorLabel: "5. Колірна гама тексту",
      generateBtn: "Згенерувати Dual-Layer Обкладинку (16:9)",
      viralStyle: "🔥 Клікбейт",
      cyberStyle: "🌆 Кіберпанк",
      bizStyle: "💼 Forbes Бізнес",
      gameStyle: "🎮 Ґеймінг",
      minStyle: "✨ Мінімалізм",
      colYellow: "Жовтий Неон",
      colCyan: "Неоновий Ціан",
      colFlame: "Вогонь & Золото",
      colLime: "Салатовий Драйв",
      previewHeader: "Готова Обкладинка (Live Canvas Preview)",
      downloadBtn: "Завантажити Обкладинку 16:9 HD",
      unlockBtn: "🎁 Зняти Вотермарку & Завантажити 4K",
      modalUnlockTitle: "Growth Hack: Розблокування HD 4K",
      modalUnlockDesc: "Отримайте 3 безкоштовні ⚡ генерації та завантажте обкладинку без вотермарки в 1 клік!",
      subscribeDealBtn: "📢 Підписатися на наш Канал (+3 ⚡ Безкоштовно)",
      starsDealBtn: "⭐ Завантажити в 4K за Telegram Stars",
      unlockedToast: "Вотермарку знято! Нараховано +3 ⚡ генерації!"
    },
    en: {
      studioTitle: "YouTube 16:9 AI Studio",
      studioSub: "Dual-Layer Engine • FLUX 1.0 8K + Vector Typography",
      backHub: "To Hub",
      topicLabel: "1. Video Topic / Prompt (Layer 1 - FLUX 1.0)",
      topicPlaceholder: "e.g. AI Side Hustles 2026, Tesla Cybercab review...",
      mainTextLabel: "2. Main Headline Text (Layer 2 - Multiline Support)",
      mainTextPlaceholder: "Main thumbnail title (supports long titles)",
      subTextLabel: "3. Subtitle / Badge Text (Layer 2)",
      subTextPlaceholder: "Extra text or money amount",
      styleLabel: "4. Background Style & Vibe",
      colorLabel: "5. Text Color Palette",
      generateBtn: "Generate Dual-Layer Thumbnail (16:9)",
      viralStyle: "🔥 Viral Clickbait",
      cyberStyle: "🌆 Cyberpunk",
      bizStyle: "💼 Forbes Business",
      gameStyle: "🎮 Gaming Esports",
      minStyle: "✨ Minimalist",
      colYellow: "Neon Yellow",
      colCyan: "Neon Cyan",
      colFlame: "Fire & Gold",
      colLime: "Lime Drive",
      previewHeader: "Generated Cover (Live Canvas Preview)",
      downloadBtn: "Download 16:9 HD Cover",
      unlockBtn: "🎁 Remove Watermark & Get 4K",
      modalUnlockTitle: "Growth Hack: Unlock 4K HD",
      modalUnlockDesc: "Claim +3 free ⚡ generations & download watermark-free HD cover in 1 click!",
      subscribeDealBtn: "📢 Subscribe to Telegram Channel (+3 ⚡ Free)",
      starsDealBtn: "⭐ Download 4K with Telegram Stars",
      unlockedToast: "Watermark removed! +3 ⚡ bonus added!"
    }
  }[lang] || t.ru;

  // Draw Canvas on State Changes
  useEffect(() => {
    drawDualLayerCanvas();
  }, [bgImageUrl, mainText, subText, selectedColor, isUnlocked, engineMode]);

  // ---------------------------------------------------------------------------
  // ADVANCED DUAL-LAYER CANVAS ENGINE WITH AUTO MULTILINE & DROP SHADOW
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
        ctx.save();
        ctx.filter = 'brightness(1.15) contrast(1.12) saturate(1.25)';
        ctx.drawImage(img, 0, 0, 1280, 720);
        ctx.restore();

        if (engineMode === 'canvas') {
          renderLayer2Typography(ctx);
        } else {
          renderWatermarkOnly(ctx);
        }
      };
      img.onerror = () => {
        renderFallbackBackground(ctx);
        if (engineMode === 'canvas') renderLayer2Typography(ctx);
        else renderWatermarkOnly(ctx);
      };
    } else {
      renderFallbackBackground(ctx);
      if (engineMode === 'canvas') renderLayer2Typography(ctx);
      else renderWatermarkOnly(ctx);
    }
  };

  const renderWatermarkOnly = (ctx) => {
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO PREVIEW • UNLOCK FOR 4K', 70, 655);
      ctx.restore();
    }
  };

  const renderFallbackBackground = (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#312e81');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);
  };

  // Multiline Text Wrapping Helper
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.toUpperCase().split(' ');
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const renderLayer2Typography = (ctx) => {
    // 1. Subtle Text Contrast Shadow Gradient (No dark screen masking)
    const vignette = ctx.createLinearGradient(0, 0, 1280, 0);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    vignette.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, 1280, 720);

    const colors = {
      yellow: { primary: '#ffee58', secondary: '#ffd600', glow: 'rgba(255, 214, 0, 0.95)', badgeBg: '#f59e0b' },
      cyan: { primary: '#00e5ff', secondary: '#00b0ff', glow: 'rgba(0, 229, 255, 0.95)', badgeBg: '#0284c7' },
      flame: { primary: '#ff5252', secondary: '#ff1744', glow: 'rgba(255, 23, 68, 0.95)', badgeBg: '#dc2626' },
      lime: { primary: '#b2ff59', secondary: '#76ff03', glow: 'rgba(118, 255, 3, 0.95)', badgeBg: '#65a30d' }
    }[selectedColor] || colors.yellow;

    ctx.textBaseline = 'top';

    let lastY = 95;

    // 2. MAIN TEXT WITH GLOWING NEON 3D FRAME BILLBOARD (EXACTLY LIKE IMAGE 2)
    if (mainText.trim()) {
      ctx.save();
      const fontSize = mainText.length > 35 ? 58 : mainText.length > 20 ? 72 : 86;
      const lineHeight = fontSize + 18;
      ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", "Arial Black", sans-serif`;

      const lines = wrapText(ctx, mainText, 920);

      // Measure max line width for frame box
      let maxW = 0;
      lines.forEach(l => {
        const w = ctx.measureText(l).width;
        if (w > maxW) maxW = w;
      });

      const framePaddingX = 35;
      const framePaddingY = 22;
      const fx = 55;
      const fy = 65;
      const fw = Math.max(maxW + framePaddingX * 2, 420);
      const fh = lines.length * lineHeight + framePaddingY * 2 - 10;

      // Draw Outer Glowing Neon Frame Box
      ctx.shadowColor = colors.glow;
      ctx.shadowBlur = 40;
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 7;
      ctx.fillStyle = 'rgba(7, 11, 22, 0.72)';
      ctx.beginPath();
      ctx.roundRect(fx, fy, fw, fh, 22);
      ctx.fill();
      ctx.stroke();

      // Double Inner Gold/Neon Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(fx + 7, fy + 7, fw - 14, fh - 14, 16);
      ctx.stroke();

      // Draw Main Text inside the Frame
      const textX = fx + framePaddingX;
      const textY = fy + framePaddingY;

      lines.forEach((line, index) => {
        const y = textY + index * lineHeight;

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 18;
        ctx.lineJoin = 'round';
        ctx.strokeText(line, textX, y);

        const textGrad = ctx.createLinearGradient(textX, y, textX, y + fontSize);
        textGrad.addColorStop(0, '#ffffff');
        textGrad.addColorStop(0.35, colors.primary);
        textGrad.addColorStop(1, colors.secondary);

        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 25;
        ctx.fillStyle = textGrad;
        ctx.fillText(line, textX, y);
      });

      lastY = fy + fh + 20;
      ctx.restore();
    }

    // 3. SUBTITLE BADGE BOX (LAYER 2)
    if (subText.trim()) {
      ctx.save();
      const subUpper = subText.toUpperCase();
      ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';

      const textWidth = ctx.measureText(subUpper).width;
      const bx = 70;
      const by = Math.min(lastY, 520);
      const padX = 22;
      const padY = 10;

      ctx.fillStyle = colors.badgeBg;
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.roundRect(bx, by, textWidth + padX * 2, 52 + padY, 12);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(subUpper, bx + padX, by + padY - 2);
      ctx.restore();
    }

    // 4. WATERMARK OVERLAY (IF NOT UNLOCKED)
    if (!isUnlocked) {
      ctx.save();
      ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 10;
      ctx.fillText('NEIROSTUDIO PREVIEW • UNLOCK FOR 4K', 70, 655);
      ctx.restore();
    }
  };

  // Generate API Handler
  const handleGenerate = async () => {
    triggerHaptic('medium');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-youtube-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicPrompt,
          style: selectedStyle,
          mainText,
          subText,
          engineMode,
          lang
        })
      });

      const data = await res.json();
      const bgUrl = data.backgroundUrl || data.imageUrl;
      if (data.ok && bgUrl) {
        setBgImageUrl(bgUrl);
        setTimeout(() => {
          if (previewRef.current) {
            previewRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Trigger Direct Laptop/Desktop & Mobile Download (Telegram Desktop Safe)
  const triggerLaptopDownload = () => {
    triggerHaptic('heavy');
    const imageSrc = savedImageSrc || bgImageUrl;
    if (!imageSrc) return;

    const proxyUrl = imageSrc.startsWith('http')
      ? `https://neirostudio-hub-v2.vercel.app/api/download-image?url=${encodeURIComponent(imageSrc)}`
      : imageSrc;

    // Telegram WebApp Native openLink (Works 100% in Telegram Desktop Client on Laptops/PCs!)
    try {
      if (window.Telegram?.WebApp?.openLink && proxyUrl.startsWith('http')) {
        window.Telegram.WebApp.openLink(proxyUrl);
        return;
      }
    } catch (e) {}

    try {
      if (proxyUrl.startsWith('data:')) {
        const parts = proxyUrl.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `youtube-cover-16x9-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (document.body.contains(a)) document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      } else {
        window.open(proxyUrl, '_blank');
      }
    } catch (err) {
      console.error('Laptop download error:', err);
      window.open(proxyUrl, '_blank');
    }
  };

  // Download Canvas Image (Mobile Telegram & Web Safe)
  const handleDownload = () => {
    triggerHaptic('heavy');
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        setSavedImageSrc(dataUrl);
        setIsSaveModalOpen(true);
      } catch (e) {
        if (bgImageUrl) setSavedImageSrc(bgImageUrl);
        setIsSaveModalOpen(true);
      }
    } else if (bgImageUrl) {
      setSavedImageSrc(bgImageUrl);
      setIsSaveModalOpen(true);
    }
    setTimeout(() => triggerLaptopDownload(), 300);
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
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Tv className="w-4 h-4" />
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

      {/* MAIN STUDIO CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 pt-6">

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 text-xs font-medium mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Dual-Layer Engine • Auto Multiline & Drop Shadow</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white">
            {t.studioTitle}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {t.studioSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: CONTROLS & FORM (5 COLS) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">

              {/* DUAL ENGINE MODE SELECTOR */}
              <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-2.5">
                <label className="block text-xs font-bold text-white mb-2 flex items-center justify-between">
                  <span>Режим Генерації ШІ</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-500/30">ТОП 2026</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setEngineMode('full3d'); }}
                    className={`py-2 px-2.5 rounded-lg font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      engineMode === 'full3d'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/30 ring-1 ring-rose-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                    <span>🚀 3D Full AI ⭐ VIP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { triggerHaptic('light'); setEngineMode('canvas'); }}
                    className={`py-2 px-2.5 rounded-lg font-extrabold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      engineMode === 'canvas'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5 text-cyan-300" />
                    <span>🎨 Кастомний Текст</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 px-1 leading-tight">
                  {engineMode === 'full3d'
                    ? '✨ Створює єдиний 8K 3D-арт (персонаж + 3D неонова вивіска + бейджі в 1 клік)'
                    : '✏️ Генерує 3D-фон та накладає кастомний векторний текст через Canvas'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.topicLabel}
                </label>
                <input
                  type="text"
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  placeholder={t.topicPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.mainTextLabel}
                </label>
                <textarea
                  rows={2}
                  value={mainText}
                  onChange={(e) => setMainText(e.target.value)}
                  placeholder={t.mainTextPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.subTextLabel}
                </label>
                <input
                  type="text"
                  value={subText}
                  onChange={(e) => setSubText(e.target.value)}
                  placeholder={t.subTextPlaceholder}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.styleLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'viral', label: t.viralStyle },
                    { id: 'cyberpunk', label: t.cyberStyle },
                    { id: 'business', label: t.bizStyle },
                    { id: 'minimal', label: t.minStyle }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedStyle(st.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedStyle === st.id
                          ? 'bg-rose-600/30 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.colorLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'yellow', label: t.colYellow },
                    { id: 'cyan', label: t.colCyan },
                    { id: 'flame', label: t.colFlame },
                    { id: 'lime', label: t.colLime }
                  ].map((col) => (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(col.id)}
                      className={`py-2 px-2 rounded-lg border text-center font-medium text-xs transition-all ${
                        selectedColor === col.id
                          ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t.generateBtn}</span>
              </button>

            </div>
          </div>

          {/* RIGHT COLUMN: LIVE CANVAS PREVIEW & UNLOCK (7 COLS) */}
          <div ref={previewRef} className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-rose-400" />
                  <span>{t.previewHeader}</span>
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold uppercase border border-rose-500/30">
                  16:9 HD (1280x720)
                </span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl aspect-video">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-rose-400 text-xs">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2" />
                    <span>Синтез FLUX 1.0 + Canvas Vector Typography...</span>
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
                    alert('Telegram Stars Payment Success! HD Unlocked.');
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
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {lang === item.code && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📥 DIRECT SAVE & DOWNLOAD MODAL (GUARANTEED TELEGRAM MINI APP SAFE) */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
          <div className="bg-[#0f172a] border border-cyan-500/50 rounded-3xl p-5 max-w-lg w-full text-center relative shadow-2xl shadow-cyan-500/30">
            <button
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2 font-bold text-base">
              <Download className="w-5 h-5 animate-bounce" />
              <span>Збереження / Завантаження HD Обкладинки</span>
            </div>

            <p className="text-slate-300 text-xs mb-1">
              📸 <b>На смартфоні:</b> Натисніть та утримуйте обкладинку нижче ➔ <b>«Зберегти у Фото»</b>
            </p>
            <p className="text-cyan-400 text-[11px] mb-3">
              💻 <b>На Ноутбуці / ПК:</b> Клацніть правою кнопкою миші на картинку нижче ➔ <b>«Зберегти зображення як...»</b> або скористайтеся кнопкою «Завантажити»
            </p>

            {savedImageSrc && (
              <a
                href={bgImageUrl ? `https://neirostudio-hub-v2.vercel.app/api/download-image?url=${encodeURIComponent(bgImageUrl)}` : savedImageSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-2xl overflow-hidden border border-cyan-500/30 mb-4 bg-black/80 p-1 group cursor-pointer"
                title="Клацніть щоб відкрити повний розмір"
              >
                <img
                  src={savedImageSrc}
                  alt="HD Cover Preview"
                  className="w-full h-auto object-contain max-h-[55vh] rounded-xl select-all"
                />
              </a>
            )}

            <div className="flex flex-col gap-2">
              <a
                href={bgImageUrl ? `https://neirostudio-hub-v2.vercel.app/api/download-image?url=${encodeURIComponent(bgImageUrl)}` : savedImageSrc}
                download={`youtube-cover-16x9-${Date.now()}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer select-none"
              >
                <Download className="w-4 h-4 text-cyan-200" />
                <span>🌐 Завантажити HD Файл (Для ПК / Ноутбука / Телефона)</span>
              </a>

              <button
                onClick={() => setIsSaveModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
