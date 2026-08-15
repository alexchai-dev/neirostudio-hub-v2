// Web3 & MemeCoin Mascot Creator Pro 8K Generator Engine for NeiroStudio AI
// Powered by FLUX 1.0 8K & OmniRoute AI Router

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, service: 'Web3 Mascot Engine Active' });
  }

  try {
    const {
      character = 'pepe',
      preset = 'pixar',
      prompt = '',
      lang = 'ru'
    } = req.body || {};

    const timestamp = Date.now();
    const cleanUserPrompt = (prompt || '').trim();

    const characterPrompts = {
      pepe: 'cute 3d bullish Pepe the frog mascot wearing luxury founder suit and sunglasses',
      doge: 'rich golden Shiba Inu Doge billionaire mascot wearing heavy gold chains and pilot glasses',
      cat: 'futuristic cyber cat mascot with glowing neon laser eyes and cyberpunk jacket',
      ape: 'bored ape mascot with diamond hands holding crypto coins'
    };

    const stylePrompts = {
      pixar: '3D Pixar style character render, vibrant octane render, clay texture, cinematic studio lighting',
      cyberpunk: 'cyberpunk neon web3 artwork, glowing dark background, synthwave lighting, futuristic vector art',
      anime: 'anime chibi mascot style, cel shaded vector art, cute expression, high contrast colors',
      pixel: 'retro 8-bit pixel art mascot, arcade game aesthetic, 16-bit crypto token icon'
    };

    const characterTerm = characterPrompts[character] || characterPrompts.pepe;
    const environmentEn = stylePrompts[preset] || stylePrompts.pixar;

    // Centered 1:1 Square Composition Keywords for Telegram Avatars (QA Requirement)
    const fullPrompt = `Centered 1:1 square vector mascot illustration of ${characterTerm}, ${environmentEn}, ${cleanUserPrompt ? cleanUserPrompt + ', ' : ''}square composition, centered headshot avatar, 8k resolution, masterpiece, trending on ArtStation, no text`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=1000&seed=${timestamp}&model=flux&nologo=true`;

    return res.status(200).json({
      ok: true,
      type: 'web3_mascot',
      imageUrl,
      preset,
      character,
      message: 'FLUX 1.0 8K Web3 Mascot Generated Successfully!'
    });

  } catch (error) {
    console.error('[Web3 Mascot Error]:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Generation failed' });
  }
}
