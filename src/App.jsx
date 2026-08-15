import React, { useState } from 'react';
import {
  Tv,
  ShoppingBag,
  UserCheck,
  Mic,
  Home,
  UtensilsCrossed,
  Palette,
  Rocket,
  BookOpen,
  Brain,
  Sparkles,
  Zap,
  Globe,
  Star,
  CheckCircle2,
  X,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import YouTubeStudio from './YouTubeStudio';
import ECommerceStudio from './ECommerceStudio';
import BusinessAvatarStudio from './BusinessAvatarStudio';
import RealEstateStudio from './RealEstateStudio';
import FoodStylingStudio from './FoodStylingStudio';
import Web3MascotStudio from './Web3MascotStudio';
import TattooStudio from './TattooStudio';
import AmazonKDPStudio from './AmazonKDPStudio';
import DeepSeekMathStudio from './DeepSeekMathStudio';
import NemotronCopywriterStudio from './NemotronCopywriterStudio';

export default function App() {
  // View Router State ('hub' | 'youtube' | 'ecommerce' | 'avatar' | 'realestate' | 'food' | 'web3' | 'tattoo' | 'amazon' | 'deepseek' | 'copywriter')
  const [currentView, setCurrentView] = useState(() => {
    try {
      const search = window.location.search;
      if (search.includes('start=hub_youtube') || window.location.pathname.includes('youtube')) {
        return 'youtube';
      }
      if (search.includes('start=hub_ecommerce') || window.location.pathname.includes('ecommerce')) {
        return 'ecommerce';
      }
      if (search.includes('start=hub_avatar') || window.location.pathname.includes('avatar')) {
        return 'avatar';
      }
      if (search.includes('start=hub_realestate') || window.location.pathname.includes('realestate')) {
        return 'realestate';
      }
      if (search.includes('start=hub_food') || window.location.pathname.includes('food')) {
        return 'food';
      }
      if (search.includes('start=hub_web3') || window.location.pathname.includes('web3')) {
        return 'web3';
      }
      if (search.includes('start=hub_tattoo') || window.location.pathname.includes('tattoo')) {
        return 'tattoo';
      }
      if (search.includes('start=hub_amazon') || window.location.pathname.includes('amazon')) {
        return 'amazon';
      }
      if (search.includes('start=hub_deepseek') || window.location.pathname.includes('deepseek')) {
        return 'deepseek';
      }
      if (search.includes('start=hub_copywriter') || search.includes('start=hub_voice') || window.location.pathname.includes('copywriter')) {
        return 'copywriter';
      }
    } catch (e) {}
    return 'hub';
  });

  // Language State (RU | UA | EN)
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('neiro_user_lang');
      if (saved) return saved;
      const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code || navigator.language || 'en';
      const code = tgLang.toLowerCase();
      if (code.startsWith('uk') || code.startsWith('ua')) return 'ua';
      if (code.startsWith('ru') || code.startsWith('be')) return 'ru';
      return 'en';
    } catch {
      return 'en';
    }
  });

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isStarsModalOpen, setIsStarsModalOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const handleSelectLang = (newLang) => {
    triggerHaptic('light');
    setLang(newLang);
    try { localStorage.setItem('neiro_user_lang', newLang); } catch (e) {}
    setIsLangModalOpen(false);
  };

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
      hubTitle: "NeiroStudio AI",
      badgeText: "LAUNCHPAD 3.0",
      heroBadge: "Официальный ИИ-Маркетплейс • Telegram App Store Model",
      heroTitle: "Центр Управления ИИ-Ботами",
      heroSubtitle: "Выберите узкопрофильный нейроинструмент. Прямой запуск внутри Telegram без сложных настроек.",
      catAll: "Все инструменты",
      catPopular: "🔥 Популярные",
      catMedia: "🎬 Медиа & Дизайн",
      catBusiness: "🛍️ Бизнес & Продажи",
      catEdu: "🧠 Обучение & Тьютор",
      energy: "Энергия",
      topUp: "Пополнить",
      launchBtn: "Запустить в Telegram",
      comingSoonBtn: "Скоро в Telegram",
      liveBadge: "🔥 LIVE BOT",
      comingSoonBadge: "⏳ SKORO",
      modalLangTitle: "Выберите язык / Language",
      starsModalTitle: "Баланс & Telegram Stars",
      starsModalText: "Пополняйте баланс Telegram Stars в один клик прямо внутри Telegram для доступа ко всем независимым ботам!",
      starsBtn: "Пополнить ⭐ Telegram Stars",
      footerText: "© 2026 NeiroStudio AI Hub. Все независимые TWA-боты монетизируются через Telegram Stars.",

      mod1Title: "YouTube 16:9 HD Covers",
      mod1Sub: "Вирусные кликабельные превью 1280x720 для роликов с двойным слоем (FLUX 1.0 + Векторная Кириллица).",
      mod1Tag: "16:9 HD • High CTR",

      mod2Title: "E-Commerce Product Studio",
      mod2Sub: "Профессиональная студийная предметная фотосъемка товаров для Wildberries, Ozon и Shopify.",
      mod2Tag: "E-Com • 8K Studio",

      mod3Title: "Business Avatar Pro",
      mod3Sub: "Деловые ИИ-портреты эксперта в стилях Business, Dubai Luxury, Quiet Luxury и Keynote.",
      mod3Tag: "Avatar • 8K Portrait",

      mod4Title: "NVIDIA Nemotron SMM Copywriter",
      mod4Sub: "Генерация вирусных постов Telegram, AIDA-воронок и сценариев TikTok/Reels на базe Nemotron-70B.",
      mod4Tag: "SMM • Nemotron-70B",

      mod5Title: "AI Real Estate & Interior",
      mod5Sub: "Виртуальный стейджинг пустых квартир и 3D-дизайн интерьеров для риелторов и застройщиков.",
      mod5Tag: "Realty • 3D Staging",

      mod6Title: "Food Menu Styling AI",
      mod6Sub: "Сочная фуд-фотография ресторанных блюд и меню для доставщиков, кафе и Instagram.",
      mod6Tag: "Food • Menu Styling",

      mod7Title: "Tattoo Sketch AI",
      mod7Sub: "Генерация уникальных эскизов татуировок на идеальном белом фоне готовых к нанесению.",
      mod7Tag: "Tattoo • Vector Art",

      mod8Title: "Web3 & MemeCoin Mascot",
      mod8Sub: "Векторные маскоты, аватары и брендинг для крипто-проектов, Telegram-каналов и MemeCoin.",
      mod8Tag: "Crypto • Web3 Mascot",

      mod9Title: "Amazon KDP & Stickers Print",
      mod9Sub: "Контурные раскраски, детские книжки и качественные стикеры для печати и продажи.",
      mod9Tag: "Print • KDP Stickers",

      mod10Title: "DeepSeek Math & OCR Tutor",
      mod10Sub: "Мгновенное пошаговое решение задач по математике, физике и коду по фото через NVIDIA NIM.",
      mod10Tag: "DeepSeek-R1 • OCR Math"
    },
    ua: {
      hubTitle: "NeiroStudio AI",
      badgeText: "LAUNCHPAD 3.0",
      heroBadge: "Офіційний ШІ-Маркетплейс • Telegram App Store Model",
      heroTitle: "Центр Управління ШІ-Ботами",
      heroSubtitle: "Оберіть вузькопрофільний нейроінструмент. Прямий запуск всередині Telegram без складних налаштувань.",
      catAll: "Усі інструменти",
      catPopular: "🔥 Популярні",
      catMedia: "🎬 Медіа & Дизайн",
      catBusiness: "🛍️ Бізнес & Продажі",
      catEdu: "🧠 Навчання & Тьютор",
      energy: "Енергія",
      topUp: "Поповнити",
      launchBtn: "Запустити в Telegram",
      comingSoonBtn: "Скоро в Telegram",
      liveBadge: "🔥 LIVE BOT",
      comingSoonBadge: "⏳ СКОРО",
      modalLangTitle: "Оберіть мову / Language",
      starsModalTitle: "Баланс & Telegram Stars",
      starsModalText: "Поповнюйте баланс Telegram Stars в один клік прямо всередині Telegram для доступу до всіх незалежних ботів!",
      starsBtn: "Поповнити ⭐ Telegram Stars",
      footerText: "© 2026 NeiroStudio AI Hub. Усі незалежні TWA-боти монетизуються через Telegram Stars.",

      mod1Title: "YouTube 16:9 HD Covers",
      mod1Sub: "Вірусні клікабельні прев'ю 1280x720 для роликів із подвійним шаром (FLUX 1.0 + Векторна Кирилиця).",
      mod1Tag: "16:9 HD • High CTR",

      mod2Title: "E-Commerce Product Studio",
      mod2Sub: "Професійна студійна предметна фотозйомка товарів для маркетплейсів та онлайн-магазинів.",
      mod2Tag: "E-Com • 8K Studio",

      mod3Title: "Business Avatar Pro",
      mod3Sub: "Ділові ШІ-портрети експерта у стилях Business, Dubai Luxury, Quiet Luxury та Keynote.",
      mod3Tag: "Avatar • 8K Portrait",

      mod4Title: "NVIDIA Nemotron SMM Copywriter",
      mod4Sub: "Генерація вірусних постів Telegram, AIDA-воронок та сценаріїв TikTok/Reels на базі Nemotron-70B.",
      mod4Tag: "SMM • Nemotron-70B",

      mod5Title: "AI Real Estate & Interior",
      mod5Sub: "Віртуальний стейджинг порожніх квартир та 3D-дизайн інтер'єрів для ріелторів та забудовників.",
      mod5Tag: "Realty • 3D Staging",

      mod6Title: "Food Menu Styling AI",
      mod6Sub: "Соковита фуд-фотографія ресторанних страв та меню для доставок, кафе та Instagram.",
      mod6Tag: "Food • Menu Styling",

      mod7Title: "Tattoo Sketch AI",
      mod7Sub: "Генерація унікальних ескізів татуювань на ідеальному білому тлі, готових до нанесення.",
      mod7Tag: "Tattoo • Vector Art",

      mod8Title: "Web3 & MemeCoin Mascot",
      mod8Sub: "Векторні маскоти, аватари та брендінг для крипто-проектів, Telegram-каналів та MemeCoin.",
      mod8Tag: "Crypto • Web3 Mascot",

      mod9Title: "Amazon KDP & Stickers Print",
      mod9Sub: "Контурні розмальовки, дитячі книжки та якісні стікери для друку і продажу.",
      mod9Tag: "Print • KDP Stickers",

      mod10Title: "DeepSeek Math & OCR Tutor",
      mod10Sub: "Миттєве покрокове розв'язання задач з математики, фізики та коду по фото через NVIDIA NIM.",
      mod10Tag: "DeepSeek-R1 • OCR Math"
    },
    en: {
      hubTitle: "NeiroStudio AI",
      badgeText: "LAUNCHPAD 3.0",
      heroBadge: "Official AI Marketplace • Telegram App Store Model",
      heroTitle: "AI Bot Control Hub",
      heroSubtitle: "Select a specialized AI tool. Direct launch inside Telegram with zero complex setup.",
      catAll: "All Tools",
      catPopular: "🔥 Popular",
      catMedia: "🎬 Media & Design",
      catBusiness: "🛍️ Business & Sales",
      catEdu: "🧠 Education & Tutor",
      energy: "Energy",
      topUp: "Top Up",
      launchBtn: "Launch in Telegram",
      comingSoonBtn: "Coming Soon",
      liveBadge: "🔥 LIVE BOT",
      comingSoonBadge: "⏳ SOON",
      modalLangTitle: "Select Language",
      starsModalTitle: "Balance & Telegram Stars",
      starsModalText: "Top up Telegram Stars in one click inside Telegram for instant access to all independent AI bots!",
      starsBtn: "Top Up ⭐ Telegram Stars",
      footerText: "© 2026 NeiroStudio AI Hub. All independent TWA bots are powered and monetized via Telegram Stars.",

      mod1Title: "YouTube 16:9 HD Covers",
      mod1Sub: "Viral clickbait 1280x720 video thumbnails powered by Dual-Layer Engine (FLUX 1.0 + Vector Cyrillic).",
      mod1Tag: "16:9 HD • High CTR",

      mod2Title: "E-Commerce Product Studio",
      mod2Sub: "Professional studio product photography for Amazon, Shopify, Wildberries & online stores.",
      mod2Tag: "E-Com • 8K Studio",

      mod3Title: "Business Avatar Pro",
      mod3Sub: "Executive AI portraits in Business, Dubai Luxury, Quiet Luxury & Keynote speaker styles.",
      mod3Tag: "Avatar • 8K Portrait",

      mod4Title: "NVIDIA Nemotron SMM Copywriter",
      mod4Sub: "Viral Telegram post generator, AIDA sales funnels & TikTok/Reels scripts powered by Nemotron-70B.",
      mod4Tag: "SMM • Nemotron-70B",

      mod5Title: "AI Real Estate & Interior",
      mod5Sub: "Virtual staging for vacant apartments and 3D interior redesign for realtors and developers.",
      mod5Tag: "Realty • 3D Staging",

      mod6Title: "Food Menu Styling AI",
      mod6Sub: "Mouth-watering food photography & menu styling for restaurants, delivery services & Instagram.",
      mod6Tag: "Food • Menu Styling",

      mod7Title: "Tattoo Sketch AI",
      mod7Sub: "Custom tattoo sketch generator rendered on clean white studio canvas ready for stencils.",
      mod7Tag: "Tattoo • Vector Art",

      mod8Title: "Web3 & MemeCoin Mascot",
      mod8Sub: "Vector mascots, avatars and branding for crypto projects, Telegram channels and MemeCoins.",
      mod8Tag: "Crypto • Web3 Mascot",

      mod9Title: "Amazon KDP & Stickers Print",
      mod9Sub: "Vector outline coloring books, children KDP artwork and printable stickers.",
      mod9Tag: "Print • KDP Stickers",

      mod10Title: "DeepSeek Math & OCR Tutor",
      mod10Sub: "Instant step-by-step problem solver for math, physics & programming via NVIDIA NIM H100.",
      mod10Tag: "DeepSeek-R1 • OCR Math"
    }
  }[lang] || t.ru;

  // View Navigation Renderers
  if (currentView === 'youtube') {
    return <YouTubeStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'ecommerce') {
    return <ECommerceStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'avatar') {
    return <BusinessAvatarStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'realestate') {
    return <RealEstateStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'food') {
    return <FoodStylingStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'web3') {
    return <Web3MascotStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'tattoo') {
    return <TattooStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'amazon') {
    return <AmazonKDPStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'deepseek') {
    return <DeepSeekMathStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  if (currentView === 'copywriter') {
    return <NemotronCopywriterStudio onBackToHub={() => setCurrentView('hub')} initialLang={lang} />;
  }

  // 10 MODULES DATA ARRAY (ALL 10 ARE NOW 100% LIVE!)
  const modules = [
    {
      id: 'youtube',
      category: 'media',
      isPopular: true,
      status: 'live',
      icon: Tv,
      iconColor: 'text-rose-400',
      bgGlow: 'bg-rose-500/10',
      borderGlow: 'border-rose-500/30 hover:border-rose-500/60',
      btnColor: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-950/50',
      title: t.mod1Title,
      sub: t.mod1Sub,
      tag: t.mod1Tag,
      action: () => setCurrentView('youtube')
    },
    {
      id: 'ecommerce',
      category: 'business',
      isPopular: true,
      status: 'live',
      icon: ShoppingBag,
      iconColor: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10',
      borderGlow: 'border-emerald-500/30 hover:border-emerald-500/60',
      btnColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/50',
      title: t.mod2Title,
      sub: t.mod2Sub,
      tag: t.mod2Tag,
      action: () => setCurrentView('ecommerce')
    },
    {
      id: 'avatar',
      category: 'business',
      isPopular: true,
      status: 'live',
      icon: UserCheck,
      iconColor: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/10',
      borderGlow: 'border-cyan-500/30 hover:border-cyan-500/60',
      btnColor: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950/50',
      title: t.mod3Title,
      sub: t.mod3Sub,
      tag: t.mod3Tag,
      action: () => setCurrentView('avatar')
    },
    {
      id: 'copywriter',
      category: 'media',
      isPopular: true,
      status: 'live',
      icon: Mic,
      iconColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/10',
      borderGlow: 'border-purple-500/30 hover:border-purple-500/60',
      btnColor: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-950/50',
      title: t.mod4Title,
      sub: t.mod4Sub,
      tag: t.mod4Tag,
      action: () => setCurrentView('copywriter')
    },
    {
      id: 'realestate',
      category: 'business',
      isPopular: true,
      status: 'live',
      icon: Home,
      iconColor: 'text-indigo-400',
      bgGlow: 'bg-indigo-500/10',
      borderGlow: 'border-indigo-500/30 hover:border-indigo-500/60',
      btnColor: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-950/50',
      title: t.mod5Title,
      sub: t.mod5Sub,
      tag: t.mod5Tag,
      action: () => setCurrentView('realestate')
    },
    {
      id: 'food',
      category: 'business',
      isPopular: true,
      status: 'live',
      icon: UtensilsCrossed,
      iconColor: 'text-orange-400',
      bgGlow: 'bg-orange-500/10',
      borderGlow: 'border-orange-500/30 hover:border-orange-500/60',
      btnColor: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-950/50',
      title: t.mod6Title,
      sub: t.mod6Sub,
      tag: t.mod6Tag,
      action: () => setCurrentView('food')
    },
    {
      id: 'tattoo',
      category: 'media',
      isPopular: true,
      status: 'live',
      icon: Palette,
      iconColor: 'text-pink-400',
      bgGlow: 'bg-pink-500/10',
      borderGlow: 'border-pink-500/30 hover:border-pink-500/60',
      btnColor: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-950/50',
      title: t.mod7Title,
      sub: t.mod7Sub,
      tag: t.mod7Tag,
      action: () => setCurrentView('tattoo')
    },
    {
      id: 'web3',
      category: 'media',
      isPopular: true,
      status: 'live',
      icon: Rocket,
      iconColor: 'text-fuchsia-400',
      bgGlow: 'bg-fuchsia-500/10',
      borderGlow: 'border-fuchsia-500/30 hover:border-fuchsia-500/60',
      btnColor: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 shadow-fuchsia-950/50',
      title: t.mod8Title,
      sub: t.mod8Sub,
      tag: t.mod8Tag,
      action: () => setCurrentView('web3')
    },
    {
      id: 'amazon',
      category: 'business',
      isPopular: true,
      status: 'live',
      icon: BookOpen,
      iconColor: 'text-yellow-400',
      bgGlow: 'bg-yellow-500/10',
      borderGlow: 'border-yellow-500/30 hover:border-yellow-500/60',
      btnColor: 'bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 shadow-yellow-950/50',
      title: t.mod9Title,
      sub: t.mod9Sub,
      tag: t.mod9Tag,
      action: () => setCurrentView('amazon')
    },
    {
      id: 'deepseek',
      category: 'education',
      isPopular: true,
      status: 'live',
      icon: Brain,
      iconColor: 'text-teal-400',
      bgGlow: 'bg-teal-500/10',
      borderGlow: 'border-teal-500/30 hover:border-teal-500/60',
      btnColor: 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-950/50',
      title: t.mod10Title,
      sub: t.mod10Sub,
      tag: t.mod10Tag,
      action: () => setCurrentView('deepseek')
    }
  ];

  const filteredModules = modules.filter((m) => {
    if (activeCategoryFilter === 'popular') return m.isPopular;
    if (activeCategoryFilter === 'media') return m.category === 'media';
    if (activeCategoryFilter === 'business') return m.category === 'business';
    if (activeCategoryFilter === 'education') return m.category === 'education';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 pb-20">
      {/* HEADER BAR */}
      <header className="sticky top-0 z-30 bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[1px]">
              <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                {t.hubTitle}
              </h1>
              <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase block -mt-1">
                {t.badgeText}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { triggerHaptic('light'); setIsStarsModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 hover:border-amber-500/60 transition-all text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>5 / 5</span>
              <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded-full text-amber-300 ml-0.5">+</span>
            </button>

            <button
              onClick={() => { triggerHaptic('light'); setIsLangModalOpen(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="uppercase">{lang}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium mb-3 shadow-lg shadow-cyan-950/40">
            <Flame className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.heroBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.heroTitle}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-1">
          {[
            { id: 'all', label: t.catAll },
            { id: 'popular', label: t.catPopular },
            { id: 'media', label: t.catMedia },
            { id: 'business', label: t.catBusiness },
            { id: 'education', label: t.catEdu }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => { triggerHaptic('light'); setActiveCategoryFilter(cat.id); }}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                activeCategoryFilter === cat.id
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 10 MODULES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const IconComp = mod.icon;
            const isLive = mod.status === 'live';

            return (
              <div
                key={mod.id}
                className={`glass-card rounded-2xl p-5 border ${mod.borderGlow} relative overflow-hidden flex flex-col justify-between group transition-all duration-300`}
              >
                <div className={`absolute top-0 right-0 w-36 h-36 ${mod.bgGlow} rounded-full blur-2xl group-hover:scale-125 transition-all pointer-events-none`} />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${mod.bgGlow} border ${mod.borderGlow} flex items-center justify-center ${mod.iconColor}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                        isLive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isLive ? t.liveBadge : t.comingSoonBadge}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {mod.tag}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {mod.title}
                    </h3>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {mod.sub}
                  </p>
                </div>

                {mod.action ? (
                  <button
                    onClick={() => { triggerHaptic('medium'); mod.action(); }}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${mod.btnColor}`}
                  >
                    <span>{isLive ? t.launchBtn : t.comingSoonBtn}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                ) : (
                  <a
                    href={mod.telegramUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => triggerHaptic('medium')}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${mod.btnColor}`}
                  >
                    <span>{isLive ? t.launchBtn : t.comingSoonBtn}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <footer className="mt-16 text-center text-slate-500 text-xs py-6 border-t border-slate-800/80">
          <p>{t.footerText}</p>
        </footer>
      </main>

      {/* LANGUAGE MODAL */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-sm rounded-2xl p-5 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-white text-sm">{t.modalLangTitle}</h3>
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
                  onClick={() => handleSelectLang(item.code)}
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

      {/* TELEGRAM STARS MODAL */}
      {isStarsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-sm rounded-2xl p-5 border border-amber-500/30 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-amber-400">
                <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
                <h3 className="font-bold text-white text-sm">{t.starsModalTitle}</h3>
              </div>
              <button onClick={() => setIsStarsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {t.starsModalText}
              </p>

              <button
                onClick={() => {
                  triggerHaptic('heavy');
                  alert('Telegram Stars Invoice API Active!');
                  setIsStarsModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/50"
              >
                {t.starsBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
