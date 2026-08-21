# 🚀 PROJECT ROADMAP: NeiroStudio — AI Bot Hub (2026)

## 📌 Основные Сведения о Проекте
* **Название Бота:** `NeiroStudio — AI Bot Hub` (@NeiroStudioAIBot)
* **Production URL (Vercel):** `https://neirostudio-hub-v2.vercel.app`
* **GitHub Repository:** `https://github.com/alexchai-dev/neirostudio-hub-v2`
* **Стек:** React 18 + Vite + TailwindCSS + HTML5 Canvas Dual-Layer Engine + Vercel Serverless Functions.

---

## 🛠️ Что Уже Сделано и Настроено (Status: DONE):

1. **Серверный Прокси Скачивания (`/api/download-image.js`):**
   * Полностью устранена проблема с блокировкой скачивания файлов в мобильном Telegram WebApp (iOS / Android).
   * Добавлено модальное окно HD Збереження с прямым скачиванием через серверный прокси.

2. **Подвойный 3D Двигатель Генерации (Dual Engine Architecture):**
   * 🚀 **`3D Full AI ⭐ VIP`**: Суплошный 8K 3D-арт (3D-киборг в центре + 3D неоновая вывеска с текстом пользователя + боковые бейджи `YOUTUBE EXCLUSIVE` + подсвеченные панели).
   * 🎨 **`Кастомный Текст (Canvas)`**: 3D-студийный фон + векторное наложение вывесок и ценников через HTML5 Canvas.

3. **Интеграция Промышленного API Fal.ai FLUX.1 [schnell]:**
   * Скорость генерации: **1.2 секунды** (4 шага инференса).
   * Стоимость: **$0.003 за 1 генерацию** (12 копеек).
   * Пополнен баланс на Fal.ai ($5.00), передеплоен ключ `FAL_KEY` на Vercel.

4. **Интеграция NVIDIA NIM Supercomputer API (`NVIDIA_API_KEY`):**
   * Модуль №4: NVIDIA Nemotron-70B SMM Copywriter.
   * Модуль №10: DeepSeek-R1 STEM Math & Physics Solver на NVIDIA NIM H100 GPU.
   * **Очистка от звезд маркдауна:** Внедрен системный фильтр `replace(/\*\*/g, '')` — копирайтер выдает 100% чистый готовый текст без `**`.

5. **Безопасность и Защита от Абуза (Anti-Abuse Architecture):**
   * Защита от фарминга повторными отписками/подписками через привязку `telegram_user_id`.
   * Защита от взлома через консоль (HMAC-SHA256 валидация `initData` на бекенде).
   * Защита от спама (Rate Limiting).

6. **Модуль №10 — «AI Event Audio Studio» (Музыкальный Бот):**
   * 4-Шаговый Пошаговый Wizard (Повод 🎁 -> Вокал 🎤 -> Жанр 🎵 -> Текст ✍️ & Музыка ⚡).
   * Интеграция Fal.ai Audio Engine с нативной отметкой `(spoken intro: "NeiroStudio Audio")`.
   * Устойчивая асинхронная Polling-архитектура с восстановлением тасок из `localStorage` при смахнувшемся TWA.
   * Плеер Obsidian Glassmorphism с эквалайзером, волновой спектрограммой, прямым скачиванием MP3 (`/api/download-audio`) и Telegram Share.

---

## 🎯 План Запуска Маркетинга и Монетизации (Next Steps):

### Step 1: Публикация Поста №2 в Telegram-канал
* **Контент:** Демо-сравнение Базового и VIP 3D режима (Альбом из 2 фото).
* **Призыв к действию:** Бесплатная VIP-генерация за подписку на канал.

### Step 2: Активация Монетизации Telegram Stars
* Подключение приема Telegram Stars через `@BotFather` -> `Bot Settings` -> `Payments`.
* Настройка пакета: **10 VIP 3D-Обложек за 25 ⭐️ Telegram Stars (~$0.50)** (Маржа 94%).

### Step 3: Обновление Кейса в Портфолио `alexchai.vercel.app`
* Добавление кейса NeiroStudio с демонстрацией Mini App и Dual-Layer Engine.
