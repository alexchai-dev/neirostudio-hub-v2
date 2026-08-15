export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8794196308:AAHJxRNyR8FJOR8kFbZ-QpwN078m7kcla_Y';
  
  let channel = req.query?.channel || req.body?.channel;
  if (!channel) {
    const lang = req.query?.lang || 'ru';
    channel = (lang === 'en') ? '@alexchai_hub_apps' : '@alexchai_hub';
  }
  const userId = req.query?.userId || req.body?.userId;

  if (!userId || userId === 'guest') {
    return res.status(200).json({ isSubscribed: true, demo: true, message: 'Demo access granted' });
  }

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${encodeURIComponent(channel)}&user_id=${userId}`
    );
    const data = await tgRes.json();

    if (data.ok && data.result) {
      const status = data.result.status;
      const isSubscribed = ['creator', 'administrator', 'member', 'restricted'].includes(status);
      return res.status(200).json({
        isSubscribed,
        status,
        channel
      });
    }

    return res.status(200).json({
      isSubscribed: false,
      status: 'left',
      channel,
      error: data.description || 'Not a member'
    });
  } catch (err) {
    console.error('Subscription check error:', err);
    return res.status(200).json({ isSubscribed: true, demo: true, error: err.message });
  }
}
