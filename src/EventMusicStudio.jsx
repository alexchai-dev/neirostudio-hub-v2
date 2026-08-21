import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Music,
  Sparkles,
  Zap,
  Globe,
  Download,
  CheckCircle2,
  RefreshCw,
  Play,
  Pause,
  Share2,
  Wand2,
  Mic,
  Disc,
  Heart,
  PartyPopper,
  Gift,
  GraduationCap,
  Sparkle,
  Radio,
  User,
  Users,
  Smile,
  Volume2,
  Sliders,
  X
} from 'lucide-react';

export default function EventMusicStudio({ onBackToHub, initialLang = 'ru' }) {
  // Language State
  const [lang, setLang] = useState(initialLang);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Wizard Step State (1: Event | 2: Vocal | 3: Genre | 4: Lyrics & Build)
  const [activeStep, setActiveStep] = useState(1);

  // Form Controls State
  const [selectedEvent, setSelectedEvent] = useState('birthday'); // birthday | graduation | party | wedding | confession | soul | custom
  const [customEventText, setCustomEventText] = useState('');

  const [selectedVocal, setSelectedVocal] = useState('female'); // male | female | child | duet | chorus | ai
  
  const [selectedGenre, setSelectedGenre] = useState('pop'); // pop | rap | rock | classic | custom
  const [customGenreText, setCustomGenreText] = useState('');

  // Step 4 Lyrics & Song Details State
  const [songTopic, setSongTopic] = useState('');
  const [lyricsText, setLyricsText] = useState('');
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);

  // Audio Generation & Polling State
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');

  const audioRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Haptic Feedback Helper
  const triggerHaptic = (style = 'light') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        if (style === 'heavy') window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        else if (style === 'medium') window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        else window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  // Language Change Handler
  const handleSelectLang = (newLang) => {
    triggerHaptic('light');
    setLang(newLang);
    try { localStorage.setItem('neiro_user_lang', newLang); } catch (e) {}
    setIsLangModalOpen(false);
  };

  // Restore Active Polling Task from localStorage on Mount
  useEffect(() => {
    try {
      const savedTaskStr = localStorage.getItem('neiro_active_music_task');
      if (savedTaskStr) {
        const savedTask = JSON.parse(savedTaskStr);
        const age = Date.now() - savedTask.timestamp;
        // If task is less than 10 minutes old, resume polling
        if (age < 10 * 60 * 1000 && savedTask.taskId) {
          setActiveTaskId(savedTask.taskId);
          setIsGeneratingMusic(true);
          setActiveStep(4);
          startPolling(savedTask.taskId);
        } else {
          localStorage.removeItem('neiro_active_music_task');
        }
      }
    } catch (err) {
      console.log('Error restoring task:', err);
    }
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Polling Logic
  const startPolling = (taskId) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    
    let progressVal = 10;
    setMusicProgress(progressVal);

    pollingIntervalRef.current = setInterval(async () => {
      try {
        progressVal = Math.min(progressVal + Math.floor(Math.random() * 8) + 4, 92);
        setMusicProgress(progressVal);

        const res = await fetch(`/api/music-status?taskId=${taskId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed' && data.audioUrl) {
            clearInterval(pollingIntervalRef.current);
            setMusicProgress(100);
            setGeneratedAudioUrl(data.audioUrl);
            setIsGeneratingMusic(false);
            localStorage.removeItem('neiro_active_music_task');
            triggerHaptic('heavy');
          } else if (data.status === 'failed' || data.error) {
            clearInterval(pollingIntervalRef.current);
            setIsGeneratingMusic(false);
            setAudioError(data.error || 'Помилка генерації');
            localStorage.removeItem('neiro_active_music_task');
          }
        }
      } catch (err) {
        console.log('Polling error:', err);
      }
    }, 4000);
  };

  // Trilingual Translations Dictionary
  const t = {
    ru: {
      title: "AI Event Audio Studio",
      sub: "Песни для праздников, свадеб и аниматоров",
      backHub: "В Хаб",
      step1Title: "1. Выберите повод праздника",
      step2Title: "2. Выберите тип вокала",
      step3Title: "3. Выберите жанр музыки",
      step4Title: "4. Текст и генерация песни",
      nextBtn: "Далее",
      prevBtn: "Назад",
      
      // Events
      evBirthday: "С днём рождения",
      evGraduation: "Выпускной",
      evParty: "Тусовка / Пати",
      evWedding: "Свадьба",
      evConfession: "Признание",
      evSoul: "Просто для души",
      evCustom: "Своя идея",
      evCustomPlaceholder: "Введите свой повод (например: 10 лет компании)...",

      // Vocals
      vocMale: "Мужской вокал",
      vocFemale: "Женский вокал",
      vocChild: "Детский голос",
      vocDuet: "Дуэт",
      vocChorus: "Хор",
      vocAi: "На усмотрение ИИ",

      // Genres
      genPop: "Поп",
      genRap: "Рэп",
      genRock: "Рок",
      genClassic: "Классика",
      genCustom: "Свой жанр",
      genCustomPlaceholder: "Укажите жанр (например: Synthwave 80s, Folk)...",

      // Step 4
      topicLabel: "О ком или о чём песня (имена, детали, пожелания)",
      topicPlaceholder: "Например: День рождения 6 лет для Артема, любит Щенячий Патруль и прыгать...",
      composeLyricsBtn: "🪄 Сочинить текст через AI",
      composingText: "Сочиняем текст песни...",
      lyricsLabel: "Текст песни и разметка структуры",
      lyricsPlaceholder: "Здесь будет текст песни со структурными тегами [Verse], [Chorus]...",
      insertTag: "+ Добавить тег:",
      genSongBtn: "⚡ Сгенерировать Песню",
      generatingSongText: "Генерируем аудио трек...",
      genNote: "Генерация занимает ~40-60 секунд. Вы можете свернуть бот, прогресс сохранится!",
      
      playerTitle: "Ваша Готовая Песня!",
      downloadBtn: "⬇ Скачать MP3",
      shareBtn: "📲 Поделиться в Telegram",
      recreateBtn: "🔄 Сгенерировать ещё"
    },
    ua: {
      title: "AI Event Audio Studio",
      sub: "Пісні для свят, весіль та аніматорів",
      backHub: "До Хабу",
      step1Title: "1. Оберіть привід свята",
      step2Title: "2. Оберіть тип вокалу",
      step3Title: "3. Оберіть жанр музики",
      step4Title: "4. Текст та генерація пісні",
      nextBtn: "Далі",
      prevBtn: "Назад",

      // Events
      evBirthday: "З днем народження",
      evGraduation: "Випускний",
      evParty: "Тусовка / Паті",
      evWedding: "Весілля",
      evConfession: "Зізнання",
      evSoul: "Просто для душі",
      evCustom: "Своя ідея",
      evCustomPlaceholder: "Введіть свій привід (наприклад: 10 років компанії)...",

      // Vocals
      vocMale: "Чоловічий вокал",
      vocFemale: "Жіночий вокал",
      vocChild: "Дитячий голос",
      vocDuet: "Дует",
      vocChorus: "Хор",
      vocAi: "На розсуд ШІ",

      // Genres
      genPop: "Поп",
      genRap: "Реп",
      genRock: "Рок",
      genClassic: "Класика",
      genCustom: "Свій жанр",
      genCustomPlaceholder: "Вкажіть жанр (наприклад: Synthwave 80s, Folk)...",

      // Step 4
      topicLabel: "Про кого або про що пісня (ім'я, деталі, побажання)",
      topicPlaceholder: "Наприклад: День народження 6 років для Артема, любить Щенячий Патруль...",
      composeLyricsBtn: "🪄 Скласти текст через AI",
      composingText: "Складаємо текст пісні...",
      lyricsLabel: "Текст пісні та розмітка структури",
      lyricsPlaceholder: "Тут буде текст пісні зі структурними тегами [Verse], [Chorus]...",
      insertTag: "+ Додати тег:",
      genSongBtn: "⚡ Згенерувати Пісню",
      generatingSongText: "Генеруємо аудіо трек...",
      genNote: "Генерація займає ~40-60 секунд. Ви можете згорнути бот, прогресс збережеться!",

      playerTitle: "Ваша Готова Пісня!",
      downloadBtn: "⬇ Завантажити MP3",
      shareBtn: "📲 Поділитися в Telegram",
      recreateBtn: "🔄 Згенерувати ще"
    },
    en: {
      title: "AI Event Audio Studio",
      sub: "Personalized songs for weddings, birthday parties & hosts",
      backHub: "To Hub",
      step1Title: "1. Select Event Occasion",
      step2Title: "2. Select Vocal Type",
      step3Title: "3. Select Music Genre",
      step4Title: "4. Lyrics & Song Generation",
      nextBtn: "Next",
      prevBtn: "Back",

      // Events
      evBirthday: "Birthday",
      evGraduation: "Graduation",
      evParty: "Party Time",
      evWedding: "Wedding",
      evConfession: "Love Confession",
      evSoul: "Just for Soul",
      evCustom: "Custom Idea",
      evCustomPlaceholder: "Type your event (e.g., 10th anniversary)...",

      // Vocals
      vocMale: "Male Vocal",
      vocFemale: "Female Vocal",
      vocChild: "Child Vocal",
      vocDuet: "Duet",
      vocChorus: "Chorus",
      vocAi: "AI Choice",

      // Genres
      genPop: "Pop",
      genRap: "Rap",
      genRock: "Rock",
      genClassic: "Classical",
      genCustom: "Custom Genre",
      genCustomPlaceholder: "Enter genre (e.g. 80s Synthwave, Folk)...",

      // Step 4
      topicLabel: "Song Topic & Details (Names, storyline, details)",
      topicPlaceholder: "E.g., 6th Birthday for Artem, loves PAW Patrol, playful mood...",
      composeLyricsBtn: "🪄 Compose Lyrics via AI",
      composingText: "Composing song lyrics...",
      lyricsLabel: "Song Lyrics & Structure Tags",
      lyricsPlaceholder: "Lyrics with structural tags [Verse], [Chorus] will appear here...",
      insertTag: "+ Insert tag:",
      genSongBtn: "⚡ Generate Song",
      generatingSongText: "Generating Audio Track...",
      genNote: "Generation takes ~40-60 sec. You can minimize the app, progress will persist!",

      playerTitle: "Your Custom Song is Ready!",
      downloadBtn: "⬇ Download MP3",
      shareBtn: "📲 Share on Telegram",
      recreateBtn: "🔄 Create Another"
    }
  };

  const curr = t[lang] || t.ru;

  // AI Lyrics Generator Handler
  const handleComposeLyrics = async () => {
    if (!songTopic.trim()) {
      alert(lang === 'ua' ? 'Введіть деталі для пісні!' : lang === 'en' ? 'Please enter song topic details!' : 'Введите детали для песни!');
      return;
    }
    triggerHaptic('medium');
    setIsGeneratingLyrics(true);

    try {
      const eventName = selectedEvent === 'custom' ? customEventText : selectedEvent;
      const genreName = selectedGenre === 'custom' ? customGenreText : selectedGenre;

      const response = await fetch('/api/generate-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'copywriter',
          category: 'post',
          lang,
          topic: `Напиши рифмованный текст песни для события: "${eventName}". Вокал: ${selectedVocal}. Жанр: ${genreName}. Детали от заказчика: "${songTopic}". Обязательно структурируй текст тегами [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Verse 2], [Bridge], [Outro]. Не используй звездочки **.`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.text) {
          setLyricsText(data.text);
          triggerHaptic('heavy');
        }
      }
    } catch (err) {
      console.log('Lyrics generation error:', err);
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // Tag Insertion Helper
  const handleInsertTag = (tag) => {
    triggerHaptic('light');
    setLyricsText((prev) => prev ? `${prev}\n\n${tag}\n` : `${tag}\n`);
  };

  // Music Generation Trigger Handler
  const handleStartGenerateMusic = async () => {
    if (!lyricsText.trim()) {
      alert(lang === 'ua' ? 'Введіть або згенеруйте текст пісні!' : lang === 'en' ? 'Please enter or compose song lyrics!' : 'Введите или сгенерируйте текст песни!');
      return;
    }

    triggerHaptic('heavy');
    setIsGeneratingMusic(true);
    setMusicProgress(5);
    setAudioError('');
    setGeneratedAudioUrl('');

    try {
      const eventName = selectedEvent === 'custom' ? customEventText : selectedEvent;
      const genreName = selectedGenre === 'custom' ? customGenreText : selectedGenre;

      const res = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: songTopic,
          lyrics: lyricsText,
          event: eventName,
          vocal: selectedVocal,
          genre: genreName,
          lang
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.taskId) {
          setActiveTaskId(data.taskId);
          localStorage.setItem('neiro_active_music_task', JSON.stringify({
            taskId: data.taskId,
            timestamp: Date.now(),
            status: 'processing'
          }));
          startPolling(data.taskId);
        } else {
          throw new Error('No task ID returned');
        }
      } else {
        throw new Error('Server error starting music generation');
      }
    } catch (err) {
      console.log('Error triggering music:', err);
      setIsGeneratingMusic(false);
      setAudioError(err.message || 'Ошибка запуска генерации');
    }
  };

  // Audio Playback Toggle
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    triggerHaptic('light');
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-12 select-none relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between shadow-lg">
        <button
          onClick={() => { triggerHaptic('light'); onBackToHub(); }}
          className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>{curr.backHub}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-xs font-semibold text-cyan-300">
            <Music className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>10. AI MUSIC STUDIO</span>
          </div>

          <button
            onClick={() => { triggerHaptic('light'); setIsLangModalOpen(true); }}
            className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 uppercase hover:text-white transition"
          >
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang}</span>
          </button>
        </div>
      </header>

      {/* Title & Banner */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4 flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
            {curr.title}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{curr.sub}</p>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-2.5">
            <span className="text-cyan-400">STEP {activeStep} OF 4</span>
            <span className="text-slate-400">
              {activeStep === 1 && curr.step1Title}
              {activeStep === 2 && curr.step2Title}
              {activeStep === 3 && curr.step3Title}
              {activeStep === 4 && curr.step4Title}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  step <= activeStep
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-700/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ================= STEP 1: EVENT SELECTION ================= */}
        {activeStep === 1 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-cyan-400" />
              {curr.step1Title}
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'birthday', label: curr.evBirthday, icon: Gift },
                { id: 'graduation', label: curr.evGraduation, icon: GraduationCap },
                { id: 'party', label: curr.evParty, icon: PartyPopper },
                { id: 'wedding', label: curr.evWedding, icon: Sparkles },
                { id: 'confession', label: curr.evConfession, icon: Heart },
                { id: 'soul', label: curr.evSoul, icon: Radio },
                { id: 'custom', label: curr.evCustom, icon: Wand2 }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedEvent === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { triggerHaptic('light'); setSelectedEvent(item.id); }}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/20 to-purple-500/20 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-200 scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedEvent === 'custom' && (
              <input
                type="text"
                value={customEventText}
                onChange={(e) => setCustomEventText(e.target.value)}
                placeholder={curr.evCustomPlaceholder}
                className="w-full bg-slate-900/80 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            )}

            <button
              onClick={() => { triggerHaptic('medium'); setActiveStep(2); }}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-sm text-white shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>{curr.nextBtn}</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: VOCAL SELECTION ================= */}
        {activeStep === 2 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-400" />
              {curr.step2Title}
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'male', label: curr.vocMale, icon: User },
                { id: 'female', label: curr.vocFemale, icon: User },
                { id: 'child', label: curr.vocChild, icon: Smile },
                { id: 'duet', label: curr.vocDuet, icon: Users },
                { id: 'chorus', label: curr.vocChorus, icon: Volume2 },
                { id: 'ai', label: curr.vocAi, icon: Wand2 }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedVocal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { triggerHaptic('light'); setSelectedVocal(item.id); }}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-purple-400/80 shadow-[0_0_15px_rgba(168,85,247,0.25)] text-purple-200 scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2.5 mt-2">
              <button
                onClick={() => { triggerHaptic('light'); setActiveStep(1); }}
                className="flex-1 py-3.5 bg-slate-800/80 border border-slate-700/70 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{curr.prevBtn}</span>
              </button>

              <button
                onClick={() => { triggerHaptic('medium'); setActiveStep(3); }}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-bold text-sm text-white shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <span>{curr.nextBtn}</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: GENRE SELECTION ================= */}
        {activeStep === 3 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Disc className="w-4 h-4 text-cyan-400" />
              {curr.step3Title}
            </h2>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'pop', label: curr.genPop, icon: Music },
                { id: 'rap', label: curr.genRap, icon: Mic },
                { id: 'rock', label: curr.genRock, icon: Zap },
                { id: 'classic', label: curr.genClassic, icon: Radio },
                { id: 'custom', label: curr.genCustom, icon: Sliders }
              ].map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedGenre === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { triggerHaptic('light'); setSelectedGenre(item.id); }}
                    className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/20 to-teal-500/20 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-200 scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedGenre === 'custom' && (
              <input
                type="text"
                value={customGenreText}
                onChange={(e) => setCustomGenreText(e.target.value)}
                placeholder={curr.genCustomPlaceholder}
                className="w-full bg-slate-900/80 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            )}

            <div className="flex gap-2.5 mt-2">
              <button
                onClick={() => { triggerHaptic('light'); setActiveStep(2); }}
                className="flex-1 py-3.5 bg-slate-800/80 border border-slate-700/70 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{curr.prevBtn}</span>
              </button>

              <button
                onClick={() => { triggerHaptic('medium'); setActiveStep(4); }}
                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-sm text-white shadow-lg hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <span>{curr.nextBtn}</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: LYRICS & GENERATION ================= */}
        {activeStep === 4 && (
          <div className="flex flex-col gap-4 animate-fadeIn">
            {/* Song Topic & Details Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-yellow-400" />
                <span>{curr.topicLabel}</span>
              </label>
              <textarea
                rows={2}
                value={songTopic}
                onChange={(e) => setSongTopic(e.target.value)}
                placeholder={curr.topicPlaceholder}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400/60"
              />

              <button
                disabled={isGeneratingLyrics}
                onClick={handleComposeLyrics}
                className="w-full py-2.5 bg-slate-800/90 hover:bg-slate-800 border border-purple-500/40 rounded-xl font-semibold text-xs text-purple-300 hover:text-purple-200 transition flex items-center justify-center gap-2"
              >
                <Wand2 className={`w-3.5 h-3.5 text-purple-400 ${isGeneratingLyrics ? 'animate-spin' : ''}`} />
                <span>{isGeneratingLyrics ? curr.composingText : curr.composeLyricsBtn}</span>
              </button>
            </div>

            {/* Lyrics Editor with Visual Track Tags */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">{curr.lyricsLabel}</label>
              </div>

              {/* Quick Tag Chips */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-slate-400 self-center mr-1 font-medium">{curr.insertTag}</span>
                {['[Intro]', '[Verse 1]', '[Pre-Chorus]', '[Chorus]', '[Verse 2]', '[Bridge]', '[Outro]'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleInsertTag(tag)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-[11px] font-mono text-cyan-300 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                rows={7}
                value={lyricsText}
                onChange={(e) => setLyricsText(e.target.value)}
                placeholder={curr.lyricsPlaceholder}
                className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400/60 leading-relaxed"
              />
            </div>

            {/* Generation Progress or Error */}
            {isGeneratingMusic && (
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 text-center flex flex-col items-center gap-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                  <Music className="w-6 h-6 text-cyan-400 animate-bounce" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-cyan-300">{curr.generatingSongText}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{curr.genNote}</p>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${musicProgress}%` }}
                  />
                </div>
              </div>
            )}

            {audioError && (
              <div className="bg-rose-950/40 border border-rose-800/80 rounded-xl p-3 text-xs text-rose-300 text-center">
                {audioError}
              </div>
            )}

            {/* Main Action Trigger */}
            {!isGeneratingMusic && !generatedAudioUrl && (
              <div className="flex gap-2.5">
                <button
                  onClick={() => { triggerHaptic('light'); setActiveStep(3); }}
                  className="py-3.5 px-4 bg-slate-800/80 border border-slate-700/70 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleStartGenerateMusic}
                  className="flex-1 py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 rounded-xl font-extrabold text-sm text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>{curr.genSongBtn}</span>
                </button>
              </div>
            )}

            {/* Audio Player (Obsidian Glassmorphism) */}
            {generatedAudioUrl && (
              <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-cyan-500/50 rounded-2xl p-5 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col gap-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">{curr.playerTitle}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg font-mono">MP3 READY</span>
                </div>

                {/* Animated Waveform Visualizer */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                  <button
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-950 font-bold flex items-center justify-center shadow-lg hover:scale-105 transition"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950 ml-0.5" />}
                  </button>

                  <div className="flex-1 flex items-center gap-1 h-8">
                    {[30, 60, 45, 80, 100, 70, 40, 90, 50, 65, 85, 40, 75, 95, 30, 60, 80, 50].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: `${isPlaying ? Math.max(20, (h * (i % 3 + 1)) % 100) : 30}%` }}
                      />
                    ))}
                  </div>

                  <audio
                    ref={audioRef}
                    src={generatedAudioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>

                {/* Download and Share Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`/api/download-audio?url=${encodeURIComponent(generatedAudioUrl)}`}
                    download="neirostudio_song.mp3"
                    onClick={() => triggerHaptic('light')}
                    className="py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl font-semibold text-xs text-white flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{curr.downloadBtn}</span>
                  </a>

                  <button
                    onClick={() => {
                      triggerHaptic('light');
                      try {
                        if (window.Telegram?.WebApp?.shareUrl) {
                          window.Telegram.WebApp.shareUrl(generatedAudioUrl, 'Моя нова пісня від NeiroStudio AI!');
                        } else {
                          navigator.clipboard.writeText(generatedAudioUrl);
                          alert('Ссылка скопирована!');
                        }
                      } catch (e) {}
                    }}
                    className="py-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl font-semibold text-xs text-purple-300 flex items-center justify-center gap-2 transition"
                  >
                    <Share2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>{curr.shareBtn}</span>
                  </button>
                </div>

                <button
                  onClick={() => { triggerHaptic('light'); setGeneratedAudioUrl(''); setActiveStep(1); }}
                  className="w-full py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition"
                >
                  {curr.recreateBtn}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Language Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full flex flex-col gap-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Мова / Язык</h3>
              <button onClick={() => setIsLangModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {[
              { code: 'ru', name: 'Русский 🇷🇺' },
              { code: 'ua', name: 'Українська 🇺🇦' },
              { code: 'en', name: 'English 🇬🇧' }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelectLang(l.code)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition text-left ${
                  lang === l.code
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
