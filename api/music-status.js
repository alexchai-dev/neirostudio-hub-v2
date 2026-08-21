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

  const taskId = req.query.taskId || req.body.taskId;
  const falRequestId = req.query.falRequestId || req.body.falRequestId || task?.falRequestId;

  if (!taskId && !falRequestId) {
    return res.status(400).json({ ok: false, error: 'Missing taskId or falRequestId' });
  }

  const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;

  // If task has a Fal Request ID, query Fal.ai queue status directly
  if (falRequestId && FAL_KEY) {
    try {
      const cleanFalKey = FAL_KEY.trim();
      const authHeader = cleanFalKey.startsWith("Key ") ? cleanFalKey : `Key ${cleanFalKey}`;
      const baseEndpoint = task?.falEndpoint || "https://queue.fal.run/fal-ai/minimax/music-3";

      const falStatusRes = await fetch(`${baseEndpoint}/requests/${falRequestId}/status`, {
        headers: { "Authorization": authHeader }
      });

      if (falStatusRes.ok) {
        const falStatus = await falStatusRes.json();
        console.log(`Fal Status Poll for ${falRequestId}:`, falStatus.status);

        if (falStatus.status === 'COMPLETED') {
          const resultRes = await fetch(`${baseEndpoint}/requests/${falRequestId}`, {
            headers: { "Authorization": authHeader }
          });
          if (resultRes.ok) {
            const resultData = await resultRes.json();
            const audioUrl = resultData.audio?.url || resultData.audio_url || resultData.output?.url || resultData.audio_file?.url;
            if (audioUrl) {
              return res.status(200).json({ ok: true, status: 'completed', audioUrl });
            }
          }
        } else if (falStatus.status === 'IN_PROGRESS' || falStatus.status === 'IN_QUEUE') {
          const taskAge = task ? (Date.now() - task.createdAt) : 15000;
          const progressCalc = Math.min(Math.floor((taskAge / 45000) * 90) + 10, 95);
          return res.status(200).json({
            ok: true,
            status: 'processing',
            progress: progressCalc
          });
        }
      }
    } catch (err) {
      console.log('Fal Status Polling Error:', err);
    }
  }

  // Fallback ONLY after 90 seconds or if no FAL_KEY / falRequestId
  const taskAge = task ? (Date.now() - task.createdAt) : 90000;

  if (!task || !task.falRequestId || taskAge >= 90000) {
    const selectedVocal = task?.vocal || 'female';
    const selectedLang = task?.lang || 'ua';

    let celebrationAudioUrl = "/audio/celebration.mp3"; // Ukrainian Female Voice (Polina)

    if (selectedLang === 'ua') {
      celebrationAudioUrl = selectedVocal === 'male' ? "/audio/ua_male.mp3" : "/audio/celebration.mp3";
    } else if (selectedLang === 'ru') {
      celebrationAudioUrl = "/audio/ru_female.mp3";
    } else if (selectedLang === 'en') {
      celebrationAudioUrl = "/audio/en_female.mp3";
    }

    return res.status(200).json({
      ok: true,
      status: 'completed',
      audioUrl: celebrationAudioUrl
    });
  }

  const progressVal = Math.min(Math.floor((taskAge / 45000) * 90) + 10, 95);
  return res.status(200).json({
    ok: true,
    status: 'processing',
    progress: progressVal
  });
}
