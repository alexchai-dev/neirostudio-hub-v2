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

    // Dual-Prompt Engineering for MiniMax Music 3.0
    // 1. Style Prompt: Genre, Vocal, Tempo, Instruments, Mood, Vocal Triggers (Eurovision pop, powerful emotional singing, high notes)
    const genreStyle = genre && genre !== 'custom' ? genre : 'Pop';
    const vocalStyle = vocal && vocal !== 'ai' ? `${vocal} lead vocal` : 'female lead vocal';
    const eventTheme = event || 'celebration';
    const stylePrompt = `${genreStyle} Eurovision pop, ${vocalStyle}, powerful emotional singing, clear melodic pitch, high notes, ${eventTheme} theme, upbeat pop synth beat, bright production, energetic, joyful, 128 BPM, high fidelity studio recording.`;

    // 2. Lyrics Prompt: Structured Tags ([Verse 1], [Chorus], [Verse 2], [Outro])
    const hasStructuralTags = /\[(verse|chorus|intro|outro|bridge|pre-chorus)\]/i.test(formattedLyrics);

    if (!hasStructuralTags) {
      const topicContent = prompt || 'Свято та веселощі!';
      formattedLyrics = `[Verse 1]\n${formattedLyrics || topicContent}\n\n[Chorus]\nЗ днем народження вітаємо!\nЩастя й радості бажаємо!\nХай збуваються всі мрії!\n\n[Outro]\nВітаємо!`;
    }

    // Save initial task state with dual prompt details
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

    // Submit request to Fal.ai Queue (MiniMax Music 3.0 in Pure Text-to-Music Mode)
    if (FAL_KEY) {
      const cleanFalKey = FAL_KEY.trim().replace(/^["']|["']$/g, '');
      const authHeader = cleanFalKey.startsWith("Key ") ? cleanFalKey : (cleanFalKey.startsWith("Bearer ") ? cleanFalKey : `Key ${cleanFalKey}`);

      const endpointsToTry = [
        "https://queue.fal.run/fal-ai/minimax-music",
        "https://queue.fal.run/fal-ai/minimax/music-3"
      ];

      const refAudio = (vocal === 'male') 
        ? "https://neirostudio-hub-v2.vercel.app/audio/ua_male.mp3" 
        : "https://neirostudio-hub-v2.vercel.app/audio/celebration_mixed.mp3";

      for (const endpoint of endpointsToTry) {
        try {
          const falRes = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Authorization": authHeader,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              prompt: stylePrompt,
              lyrics: formattedLyrics,
              reference_audio_url: refAudio
            })
          });

          if (falRes.ok) {
            const falData = await falRes.json();
            const falRequestId = falData.request_id;
            if (falRequestId) {
              const currentTask = global._neiroMusicTasks.get(taskId) || {};
              global._neiroMusicTasks.set(taskId, {
                ...currentTask,
                falRequestId,
                falEndpoint: endpoint
              });
              console.log('Fal MiniMax 3.0 Queue successfully created:', falRequestId, endpoint);
              break;
            }
          } else {
            const errText = await falRes.text();
            console.log(`Fal endpoint ${endpoint} failed (${falRes.status}):`, errText);
          }
        } catch (falErr) {
          console.log(`Fal Audio trigger error on ${endpoint}:`, falErr.message);
        }
      }
    }

    const taskData = global._neiroMusicTasks.get(taskId) || {};
    return res.status(200).json({
      ok: true,
      taskId,
      status: 'processing',
      falConfigured: Boolean(FAL_KEY),
      falRequestId: taskData.falRequestId || null,
      message: FAL_KEY ? 'Music task queued to Fal.ai' : 'Music task started (using local fallback: FAL_KEY not detected in Vercel env)'
    });
  } catch (err) {
    console.error('generate-music error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
}
