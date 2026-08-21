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
    const audioRes = await fetch(audioUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'audio/mpeg, audio/*, */*'
      }
    });

    if (!audioRes.ok) {
      console.log('download-audio fetch response not OK, redirecting to direct URL');
      return res.redirect(302, audioUrl);
    }

    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="neirostudio_event_song.mp3"');
    res.setHeader('Content-Length', buffer.length);

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('download-audio error:', err);
    return res.redirect(302, audioUrl);
  }
}
