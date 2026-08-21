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

  const taskId = req.query.taskId || req.body?.taskId;
  const task = taskId ? global._neiroMusicTasks.get(taskId) : null;
  const falRequestId = req.query.falRequestId || req.body?.falRequestId || task?.falRequestId;

  if (!taskId && !falRequestId) {
    return res.status(400).json({ ok: false, error: 'Missing taskId or falRequestId' });
  }

  const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;

  // If task has a Fal Request ID, query Fal.ai queue status directly
  if (falRequestId && FAL_KEY) {
    try {
      const cleanFalKey = FAL_KEY.trim().replace(/^["']|["']$/g, '');
      const authHeader = cleanFalKey.startsWith("Key ") ? cleanFalKey : (cleanFalKey.startsWith("Bearer ") ? cleanFalKey : `Key ${cleanFalKey}`);
      const baseEndpoint = task?.falEndpoint || "https://queue.fal.run/fal-ai/minimax-music";

      const falStatusRes = await fetch(`${baseEndpoint}/requests/${falRequestId}/status`, {
        headers: { "Authorization": authHeader }
      });

      if (falStatusRes.ok) {
        const falStatus = await falStatusRes.json();
        console.log(`Fal Status Poll for ${falRequestId}:`, falStatus.status);
        const statusStr = (falStatus.status || '').toUpperCase();

        if (statusStr === 'COMPLETED' || statusStr === 'OK' || statusStr === 'SUCCESS') {
          const resultRes = await fetch(`${baseEndpoint}/requests/${falRequestId}`, {
            headers: { "Authorization": authHeader }
          });
          if (resultRes.ok) {
            const resultData = await resultRes.json();
            console.log('Fal Result Data:', JSON.stringify(resultData));

            const findAudioUrl = (obj) => {
              if (!obj) return null;
              if (typeof obj === 'string' && (obj.startsWith('http://') || obj.startsWith('https://'))) return obj;
              if (typeof obj === 'object') {
                if (obj.url && typeof obj.url === 'string' && (obj.url.startsWith('http://') || obj.url.startsWith('https://'))) return obj.url;
                if (obj.audio_url && typeof obj.audio_url === 'string') return obj.audio_url;
                if (obj.file_url && typeof obj.file_url === 'string') return obj.file_url;
                for (const k of Object.keys(obj)) {
                  const res = findAudioUrl(obj[k]);
                  if (res) return res;
                }
              }
              return null;
            };

            const audioUrl = findAudioUrl(resultData);
            if (audioUrl) {
              return res.status(200).json({ ok: true, status: 'completed', audioUrl });
            }
          } else {
            const resultErr = await resultRes.text();
            return res.status(200).json({ ok: true, status: 'result_fetch_failed', resultStatus: resultRes.status, resultErr });
          }
        }
        
        // Return processing for all non-completed Fal queue states (IN_PROGRESS, IN_QUEUE, PENDING, QUEUED)
        return res.status(200).json({
          ok: true,
          status: 'processing',
          progress: 50,
          falStatus: falStatus.status
        });
      } else {
        const statusErrText = await falStatusRes.text();
        console.log(`Fal Status Poll Error (${falStatusRes.status}):`, statusErrText);
        return res.status(200).json({
          ok: true,
          status: 'processing',
          progress: 30,
          falError: statusErrText
        });
      }
    } catch (err) {
      console.log('Fal Status Polling Error:', err);
    }
  }

  // Return processing status if task is waiting
  return res.status(200).json({
    ok: true,
    status: 'processing',
    progress: 45
  });
}
