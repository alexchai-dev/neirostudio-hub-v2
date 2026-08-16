import fetch from 'node-fetch';

const BASE_URL = 'https://neirostudio-hub-v2.vercel.app';

const testCases = [
  { name: '1. YouTube 16:9 Covers', type: 'youtube-cover', payload: { prompt: 'AI Future 2026', headline: 'REVOLUTION', badge: 'FLUX 8K' } },
  { name: '2. E-Commerce Product Studio', type: 'ecommerce', payload: { prompt: 'Luxury Watch', style: 'Dark Studio' } },
  { name: '3. Business Avatar 8K', type: 'avatar', payload: { prompt: 'Executive Tech CEO', style: 'Vogue Dubai' } },
  { name: '4. Real Estate 3D Staging', type: 'realestate', payload: { prompt: 'Penthouse Living Room', style: 'Scandinavian Minimalist' } },
  { name: '5. Gourmet Food Styling', type: 'food', payload: { prompt: 'Artisan Cheeseburger', style: 'Michelin Star' } },
  { name: '6. Web3 3D Mascot', type: 'web3', payload: { prompt: 'Cyberpunk Bull', style: '3D Pixar' } },
  { name: '7. Stencil Tattoo Studio', type: 'tattoo', payload: { prompt: 'Japanese Dragon', style: 'Black Stencil' } },
  { name: '8. Amazon KDP Sticker Lab', type: 'amazon', payload: { prompt: 'Cute Astro Cat', style: 'Die-cut Vector' } },
  { name: '9. DeepSeek-R1 Math Tutor', type: 'deepseek', payload: { problem: 'Integrate x^2 dx from 0 to 3', level: 'University Calculus' } },
  { name: '10. NVIDIA Nemotron SMM Copywriter', type: 'copywriter', payload: { topic: 'NeiroStudio AI Hub Launch', target: 'Tech Entrepreneurs', role: 'Chief SMM Strategist' } }
];

async function runFullAudit() {
  console.log('=====================================================');
  console.log('🔍 NEIROSTUDIO AI HUB - 360° AUTOMATED AUDIT SUITE');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;
  const results = [];

  for (const tc of testCases) {
    const startTime = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/api/generate-module?module=${tc.type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tc.payload)
      });

      const elapsed = Date.now() - startTime;
      const status = res.status;
      const data = await res.json();

      const isSuccess = status === 200 && (data.ok || data.success) && (data.imageUrl || data.copyText || data.solutionText);

      if (isSuccess) {
        passed++;
        results.push({
          name: tc.name,
          type: tc.type,
          status: '✅ PASS',
          timeMs: elapsed,
          hasImage: !!data.imageUrl,
          hasText: !!(data.copyText || data.solutionText),
          sampleUrl: data.imageUrl ? data.imageUrl.substring(0, 45) + '...' : 'N/A'
        });
        console.log(`[PASS] ${tc.name} (${elapsed}ms)`);
      } else {
        failed++;
        results.push({
          name: tc.name,
          type: tc.type,
          status: '❌ FAIL',
          timeMs: elapsed,
          error: data.error || 'Invalid response structure'
        });
        console.log(`[FAIL] ${tc.name} (${elapsed}ms) - Status: ${status}`);
      }
    } catch (err) {
      const elapsed = Date.now() - startTime;
      failed++;
      results.push({
        name: tc.name,
        type: tc.type,
        status: '❌ ERROR',
        timeMs: elapsed,
        error: err.message
      });
      console.log(`[ERROR] ${tc.name} (${elapsed}ms) - ${err.message}`);
    }
  }

  console.log('\n=====================================================');
  console.log(`📊 AUDIT SUMMARY: ${passed} PASSED | ${failed} FAILED | TOTAL: ${testCases.length}`);
  console.log('=====================================================\n');
  console.log(JSON.stringify(results, null, 2));
}

runFullAudit();
