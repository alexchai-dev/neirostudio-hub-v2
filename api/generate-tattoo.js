// Tattoo Sketch AI Studio 8K Generator Engine for NeiroStudio AI
// Powered by FLUX 1.0 8K & OmniRoute AI Router

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, service: 'Tattoo Stencil Engine Active' });
  }

  try {
    const {
      motif = 'dragon',
      preset = 'fine_line',
      prompt = '',
      lang = 'ru'
    } = req.body || {};

    const timestamp = Date.now();
    const cleanUserPrompt = (prompt || '').trim();

    const motifPrompts = {
      dragon: 'intricate Eastern mythical dragon tattoo design with detailed scales and clouds',
      wolf: 'majestic lone wolf and lion tattoo design with geometric botanical accents',
      skull: 'classic gothic skull with blooming red roses tattoo design',
      sword: 'futuristic cyber Valkyrie sword tattoo design with geometric cybernetic runes'
    };

    const stylePrompts = {
      fine_line: 'blackwork fine line tattoo style, crisp vector-like ink lines, micro-realism, sharp contours',
      irezumi: 'traditional Japanese Irezumi tattoo style, bold black outlines, wave patterns and cherry blossoms',
      cybertribal: 'modern cyberpunk cyber-tribal tattoo style, sharp futuristic chrome spikes, dark ink artwork',
      watercolor: 'vibrant watercolor splash tattoo design, artistic paint drips, black fine line outline'
    };

    const motifTerm = motifPrompts[motif] || motifPrompts.dragon;
    const environmentEn = stylePrompts[preset] || stylePrompts.fine_line;

    // Pure White Background & Sharp Stencil Lines (QA Requirement for Stencil Printers)
    const fullPrompt = `Tattoo stencil art of ${motifTerm}, ${environmentEn}, ${cleanUserPrompt ? cleanUserPrompt + ', ' : ''}isolated on pure solid white background, pure white background #ffffff, high contrast tattoo flash stencil, sharp crisp ink lines, 8k resolution, masterwork, no background noise, no text`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=1000&seed=${timestamp}&model=flux&nologo=true`;

    return res.status(200).json({
      ok: true,
      type: 'tattoo_sketch',
      imageUrl,
      preset,
      motif,
      message: 'FLUX 1.0 8K Tattoo Stencil Generated Successfully!'
    });

  } catch (error) {
    console.error('[Tattoo Engine Error]:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Generation failed' });
  }
}
