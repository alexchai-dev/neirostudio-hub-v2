export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch background image' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="neirostudio-cover-16x9-${Date.now()}.png"`);
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Download Proxy Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
