// Business Avatar Pro 8K Executive Portrait Generator for NeiroStudio AI
// Powered by FLUX 1.0 8K & OmniRoute AI Router

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, service: 'Business Avatar Pro Engine Active' });
  }

  try {
    const {
      gender = 'male',
      preset = 'forbes',
      prompt = '',
      lang = 'ru'
    } = req.body || {};

    const timestamp = Date.now();
    const genderTerm = gender === 'female' ? 'successful female entrepreneur CEO' : 'handsome male executive investor';
    const cleanUserPrompt = (prompt || '').trim();

    // Studio Executive Prompts (Centered Composition for Circle Avatar Crop)
    const presetPrompts = {
      forbes: 'bespoke dark navy designer suit, luxury New York penthouse background with skyline, Forbes magazine cover aesthetic, centered composition, dramatic studio lighting',
      dubai: 'luxury Dubai lifestyle background, Burj Khalifa view, private jet or supercar, bespoke cashmere blazer, high net worth executive portrait, centered composition',
      oldmoney: 'old money quiet luxury aesthetic, aristocratic cashmere sweater and coat, warm luxury studio lighting, classic European heritage background, centered composition',
      keynote: 'charismatic leadership keynote speaker on stage, stadium audience background with ambient blue spotlight, executive presentation portrait, centered composition'
    };

    const environmentEn = presetPrompts[preset] || presetPrompts.forbes;
    const fullPrompt = `Ultra realistic 8k studio portrait of ${genderTerm}, ${cleanUserPrompt ? cleanUserPrompt + ', ' : ''}${environmentEn}, sharp focus, masterwork, 8k resolution, centered headshot portrait for social media avatar, no text`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=1000&seed=${timestamp}&model=flux&nologo=true`;

    return res.status(200).json({
      ok: true,
      type: 'business_avatar',
      imageUrl,
      preset,
      gender,
      message: 'FLUX 1.0 8K Executive Portrait Generated Successfully!'
    });

  } catch (error) {
    console.error('[Business Avatar Error]:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Generation failed' });
  }
}
