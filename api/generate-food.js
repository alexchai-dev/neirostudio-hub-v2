// Food Menu Styling AI Pro 8K Culinary Photography Generator Engine for NeiroStudio AI
// Powered by FLUX 1.0 8K & OmniRoute AI Router

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true, service: 'Food Styling Engine Active' });
  }

  try {
    const {
      category = 'burgers',
      preset = 'michelin',
      prompt = '',
      lang = 'ru'
    } = req.body || {};

    const timestamp = Date.now();
    const cleanUserPrompt = (prompt || '').trim();

    const categoryPrompts = {
      burgers: 'juicy gourmet cheeseburger with melting cheddar, crispy bacon, fresh lettuce and artisan brioche bun',
      pizza: 'authentic Italian Neapolitan pizza with melting mozzarella, fresh basil leaves, san marzano tomato sauce, charred crust',
      sushi: 'exquisite Japanese omakase sushi platter with fresh salmon, tuna nigiri, caviar garnish, wabi-sabi slate plate',
      steak: 'prime ribeye beef steak grilled to perfection, rosemary butter melt, coarse sea salt, seared grill marks',
      desserts: 'luxury Belgian chocolate lava cake with vanilla bean ice cream scoop, fresh berries and mint leaf'
    };

    const stylePrompts = {
      michelin: 'Michelin star restaurant plating, fine dining art presentation, microgreens, sauce drizzle, studio lighting',
      rustic: 'rustic wooden cutting board background, craft bistro presentation, warm cozy lighting, natural herbs around',
      dark: 'dark moody gastro photography, dramatic side spotlight, steam rising, rich contrast, dark slate stone background',
      clean: 'bright clean studio daylight lighting, vibrant food delivery catalog styling, crisp white marble table'
    };

    const categoryTerm = categoryPrompts[category] || categoryPrompts.burgers;
    const environmentEn = stylePrompts[preset] || stylePrompts.michelin;

    // Macro Photography & Appetite Appeal Keywords (QA Requirement)
    const fullPrompt = `Macro commercial food photograph of ${categoryTerm}, ${environmentEn}, ${cleanUserPrompt ? cleanUserPrompt + ', ' : ''}shallow depth of field, beautiful bokeh, professional food styling, glistening textures, 8k resolution, masterwork, sharp focus, award-winning food photography, no text`;
    const encodedPrompt = encodeURIComponent(fullPrompt);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1000&height=1000&seed=${timestamp}&model=flux&nologo=true`;

    return res.status(200).json({
      ok: true,
      type: 'food_styling',
      imageUrl,
      preset,
      category,
      message: 'FLUX 1.0 8K Culinary Photography Generated Successfully!'
    });

  } catch (error) {
    console.error('[Food Styling Error]:', error);
    return res.status(500).json({ ok: false, error: error.message || 'Generation failed' });
  }
}
