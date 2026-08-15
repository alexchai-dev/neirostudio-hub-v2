export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', service: 'Telegram Stars Invoice Generator' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8794196308:AAHJxRNyR8FJOR8kFbZ-QpwN078m7kcla_Y';
  const { packageId, userId } = req.body || {};

  let title = '30 ИИ-Генераций (NeiroStudio)';
  let description = 'Пакет из 30 генераций портретов, замены лиц и оживления фото';
  let starsAmount = 50;
  let payload = `stars_pkg_30_${userId || 'guest'}`;

  if (packageId === 'pkg_100') {
    title = '100 ИИ-Генераций (NeiroStudio MAX)';
    description = 'Пакет из 100 генераций портретов, мемов и 4K улучшений';
    starsAmount = 100;
    payload = `stars_pkg_100_${userId || 'guest'}`;
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        payload,
        currency: 'XTR',
        prices: [{ label: title, amount: starsAmount }]
      })
    });

    const data = await tgRes.json();
    if (data.ok) {
      return res.status(200).json({ ok: true, invoiceUrl: data.result });
    }
    return res.status(400).json({ ok: false, error: data.description || 'Failed to create invoice' });
  } catch (err) {
    console.error('Invoice creation error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
