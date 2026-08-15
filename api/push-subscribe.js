// In-memory / serverless store for smart push subscriptions
const userSubscriptions = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, count: userSubscriptions.size });
  }

  try {
    const { userId, firstName, lang, enabled, lastVisit } = req.body || {};

    if (!userId || userId === 'guest') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    userSubscriptions.set(userId, {
      userId,
      firstName: firstName || 'Friend',
      lang: lang || 'ua',
      enabled: enabled !== false,
      lastVisit: lastVisit || Date.now(),
      updatedAt: Date.now()
    });

    return res.status(200).json({ ok: true, registered: userId, totalActive: userSubscriptions.size });
  } catch (err) {
    console.error('Push subscribe error:', err);
    return res.status(500).json({ error: 'Failed to process subscription' });
  }
}
