export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8794196308:AAHJxRNyR8FJOR8kFbZ-QpwN078m7kcla_Y';

  // Smart Rotating Teasers by language
  const teasers = {
    ua: [
      {
        title: '🎁 Ваш щоденний бонус чекає!',
        body: 'Нараховано +1 безкоштовний бонус. Заходьте згенерувати нову ШІ-фотосесію дня!'
      },
      {
        title: '✨ Порада дня від NeiroStudio',
        body: 'Оживіть своє улюблене фото у 1-клік відео з природним диханням та мімікою!'
      },
      {
        title: '🔥 Новий вірусний тренд',
        body: 'Створіть свій студійний портрет та завантажте з водяним знаком для TikTok & Reels!'
      }
    ],
    ru: [
      {
        title: '🎁 Ваш ежедневный бонус ждет!',
        body: 'Начислено +1 бесплатный бонус. Заходите сгенерировать новую ИИ-фотосессию дня!'
      },
      {
        title: '✨ Совет дня от NeiroStudio',
        body: 'Оживите свое любимое фото в 1-клик видео с естественным дыханием и мимикой!'
      },
      {
        title: '🔥 Новый вирусный тренд',
        body: 'Создайте свой студийный портрет и скачайте с водяным знаком для TikTok & Reels!'
      }
    ],
    en: [
      {
        title: '🎁 Your +1 daily bonus is ready!',
        body: 'Claim your free generation and create today\'s studio AI photoshoot!'
      },
      {
        title: '✨ Pro Tip from NeiroStudio',
        body: 'Animate your selfie into a 1-click video with natural facial motion!'
      },
      {
        title: '🔥 Viral Social Trend',
        body: 'Generate your studio portrait with our watermark for TikTok & Reels!'
      }
    ]
  };

  try {
    const { targetUserId, userLang } = req.body || {};
    const lang = teasers[userLang] ? userLang : 'ua';
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 3;
    const teaser = teasers[lang][dayIndex];

    if (!targetUserId) {
      return res.status(200).json({ status: 'active', message: 'Smart Push Engine Ready', activeTeaser: teaser });
    }

    const messageText = `<b>${teaser.title}</b>\n\n${teaser.body}`;
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: '🚀 Відкрити NeiroStudio TWA',
            web_app: { url: 'https://neirostudio-twa.vercel.app' }
          }
        ]
      ]
    };

    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetUserId,
        text: messageText,
        parse_mode: 'HTML',
        reply_markup: keyboard
      })
    });

    const data = await telegramRes.json();
    return res.status(200).json({ ok: data.ok, result: data });
  } catch (err) {
    console.error('Smart push send error:', err);
    return res.status(500).json({ error: 'Failed to send smart push' });
  }
}
