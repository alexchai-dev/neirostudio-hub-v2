// Global In-Memory Task Storage for Audio Generation
if (!global._neiroMusicTasks) {
  global._neiroMusicTasks = new Map();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { prompt, lyrics, event, vocal, genre, lang } = req.body || {};

    const taskId = `music_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;

    // Clean and format lyrics with safeguard for empty tags
    let formattedLyrics = lyrics ? lyrics.trim() : '';
    const linesWithoutTags = formattedLyrics.replace(/\[.*?\]/g, '').trim();

    if (!linesWithoutTags || linesWithoutTags.length < 10) {
      const topicText = prompt || 'Праздник и радость!';
      formattedLyrics = `[Verse 1]\nС днем рождения поздравляем!\nСчастья, радости желаем!\n${topicText}\n\n[Chorus]\nПусть сбываются мечты,\nПраздник света и красоты!`;
    }

    // Structured Prompt with Watermark Spoken Tag
    const watermarkLyrics = `[Intro] (spoken intro: "NeiroStudio Audio")\n${formattedLyrics}`;
    const stylePrompt = `${genre || 'Pop'} music, ${vocal || 'female'} vocal, ${event || 'party'} theme. Bright production, high quality, melodic.`;

    // Save initial task state with lyrics and details
    global._neiroMusicTasks.set(taskId, {
      id: taskId,
      status: 'processing',
      createdAt: Date.now(),
      prompt: stylePrompt,
      lyrics: formattedLyrics,
      lang: lang || 'ua',
      vocal: vocal || 'female',
      genre: genre || 'pop',
      falRequestId: null
    });

    // If FAL_KEY is available, trigger Fal Audio API queue
    if (FAL_KEY) {
      try {
        const cleanFalKey = FAL_KEY.trim();
        const authHeader = cleanFalKey.startsWith("Key ") ? cleanFalKey : `Key ${cleanFalKey}`;

        const falRes = await fetch("https://queue.fal.run/fal-ai/minimax/music", {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: stylePrompt,
            lyrics: watermarkLyrics || prompt || "NeiroStudio celebration song"
          })
        });

        if (falRes.ok) {
          const falData = await falRes.json();
          const falRequestId = falData.request_id;
          const currentTask = global._neiroMusicTasks.get(taskId) || {};
          global._neiroMusicTasks.set(taskId, {
            ...currentTask,
            falRequestId
          });
        }
      } catch (falErr) {
        console.log('Fal Audio trigger error:', falErr);
      }
    }

    return res.status(200).json({
      ok: true,
      taskId,
      status: 'processing',
      message: 'Music task initiated successfully'
    });
  } catch (err) {
    console.error('generate-music error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
}
