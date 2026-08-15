export default async function handler(req, res) {
  // Allow GET requests for testing endpoint health
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', bot: '@NeiroStudioAIBot', message: 'NeiroStudio Serverless Webhook is Active!' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8794196308:AAHJxRNyR8FJOR8kFbZ-QpwN078m7kcla_Y';
  const update = req.body;

  if (update && update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || '';
    const firstName = update.message.from?.first_name || 'Друг';

    // Parse deep link parameters (e.g. /start hub_youtube or /start ref_123456)
    const paramMatch = text.match(/\/start\s+(\w+)/);
    const startParam = paramMatch ? paramMatch[1] : '';

    if (text.startsWith('/start')) {
      let welcomeText = `🎬 <b>Добро пожаловать в YouTube 16:9 Thumbnail AI Studio!</b>\n\n` +
        `Создавай вирусные 1280x720 обложки с Dual-Layer Engine (FLUX 1.0 8K + Векторный текст без галлюцинаций) за 10 секунд!\n\n` +
        `🎁 <b>Приветственный бонус:</b> Вам зачислено <b>5 ⚡ бесплатных генераций</b>!\n` +
        `📢 <b>Бонус за подписку:</b> Подпишитесь на наш канал и получите ещё <b>+3 ⚡ и снятие вотермарки</b>!\n\n` +
        `Нажмите кнопку ниже, чтобы сгенерировать идеальную 16:9 обложку 👇`;

      let targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_youtube';
      if (startParam === 'hub_ecommerce') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_ecommerce';
      } else if (startParam === 'hub_avatar') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_avatar';
      } else if (startParam === 'hub_realestate') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_realestate';
      } else if (startParam === 'hub_food') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_food';
      } else if (startParam === 'hub_web3') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_web3';
      } else if (startParam === 'hub_tattoo') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_tattoo';
      } else if (startParam === 'hub_amazon') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_amazon';
      } else if (startParam === 'hub_deepseek') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_deepseek';
      } else if (startParam === 'hub_copywriter' || startParam === 'hub_voice') {
        targetAppUrl = 'https://neirostudio-twa.vercel.app?start=hub_copywriter';
      } else if (startParam && startParam !== 'hub_youtube') {
        targetAppUrl = `https://neirostudio-twa.vercel.app?start=${startParam}`;
      }

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🚀 Открыть NVIDIA Nemotron SMM Copywriter',
              web_app: { url: targetAppUrl }
            }
          ],
          [
            {
              text: '⭐ Пополнить Звезды (Telegram Stars)',
              web_app: { url: 'https://neirostudio-twa.vercel.app?tab=stars' }
            }
          ]
        ]
      };

      try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: welcomeText,
            parse_mode: 'HTML',
            reply_markup: keyboard
          })
        });
      } catch (err) {
        console.error('Telegram API webhook send error:', err);
      }
    }
  }

  return res.status(200).json({ ok: true });
}
