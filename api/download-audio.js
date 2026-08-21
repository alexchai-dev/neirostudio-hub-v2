export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const audioUrl = req.query.url;

  if (!audioUrl) {
    return res.status(400).send('Missing audio URL');
  }

  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) {
      return res.status(500).send('Failed to fetch audio stream');
    }

    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="neirostudio_event_song.mp3"');
    res.setHeader('Content-Length', buffer.length);

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('download-audio error:', err);
    return res.status(500).send('Error downloading audio');
  }
}
