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
    // 1. Style Prompt: Genre, Vocal, Tempo, Instruments, Mood
    const genreStyle = genre && genre !== 'custom' ? genre : 'Pop';
    const vocalStyle = vocal && vocal !== 'ai' ? `${vocal} vocal` : 'female vocal';
    const eventTheme = event || 'celebration';
    const stylePrompt = `${genreStyle} music, ${vocalStyle}, ${eventTheme} theme, upbeat pop synth beat, bright production, energetic, joyful, 128 BPM, high fidelity studio recording.`;

    // 2. Lyrics Prompt: Structured Tags ([intro], [verse], [chorus], [outro])
    const hasStructuralTags = /\[(verse|chorus|intro|outro|bridge|pre-chorus)\]/i.test(formattedLyrics);

    if (!hasStructuralTags) {
      const topicContent = prompt || 'Свято та веселощі!';
      formattedLyrics = `[intro]\n(bright synth beat intro)\n\n[verse]\n${formattedLyrics || topicContent}\n\n[chorus]\nЗ днем народження вітаємо!\nЩастя й радості бажаємо!\nХай збуваються всі мрії!\n\n[outro]\n(music fade out)`;
    } else {
      // Ensure intro tag exists for MiniMax 3.0 structure
      if (!/\[intro\]/i.test(formattedLyrics)) {
        formattedLyrics = `[intro]\n(upbeat intro)\n\n${formattedLyrics}`;
      }
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

    // Submit request to Fal.ai Queue (MiniMax Music 3.0)
    if (FAL_KEY) {
      const cleanFalKey = FAL_KEY.trim();
      const authHeader = cleanFalKey.startsWith("Key ") ? cleanFalKey : `Key ${cleanFalKey}`;

      const endpointsToTry = [
        "https://queue.fal.run/fal-ai/minimax/music-3",
        "https://queue.fal.run/fal-ai/minimax-music-3",
        "https://queue.fal.run/fal-ai/minimax-music"
      ];

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
              lyrics: formattedLyrics
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
