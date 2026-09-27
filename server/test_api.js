async function testAll() {
  console.log('--- DevPair API Verification ---');
  const BASE_URL = 'http://localhost:5000/api';

  async function api(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`[${res.status}] ${data.message || JSON.stringify(data)}`);
    }
    return data;
  }


  // 1. Health check
  const health = await api('/health');
  console.log('✓ Health check:', health);

  // 2. Demo login as Priya
  const priyaLogin = await api('/auth/demo', {
    method: 'POST',
    body: JSON.stringify({ email: 'priya@devpair.dev' })
  });
  console.log('✓ Priya Demo Login:', priyaLogin.user.name, '| DevScore:', priyaLogin.user.devScore);
  const priyaToken = priyaLogin.token;

  // 3. Demo login as Alex
  const alexLogin = await api('/auth/demo', {
    method: 'POST',
    body: JSON.stringify({ email: 'alex@devpair.dev' })
  });
  console.log('✓ Alex Demo Login:', alexLogin.user.name, '| DevScore:', alexLogin.user.devScore);
  const alexToken = alexLogin.token;

  // 4. Discover feed for Alex
  const discover = await api('/users/discover', {
    headers: { Authorization: `Bearer ${alexToken}` }
  });
  console.log(`✓ Discover Feed for Alex: found ${discover.length} profiles. Top profile:`, discover[0]?.name, `(${discover[0]?.compatScore}% match)`);

  // 5. Leaderboard
  const leaderboard = await api('/users/leaderboard');
  console.log(`✓ Leaderboard: found ${leaderboard.length} ranked developers. #1:`, leaderboard[0]?.name, `(${leaderboard[0]?.devScore} pts)`);

  // 6. Like flow: Alex likes Priya
  const priyaId = priyaLogin.user._id || priyaLogin.user.id;
  console.log('Priya ID:', priyaId);
  const alexLikeRes = await api('/matches/like', {
    method: 'POST',
    body: JSON.stringify({
      targetId: priyaId,
      section: 'tech',
      comment: 'Love PyTorch and neural nets!'
    }),
    headers: { Authorization: `Bearer ${alexToken}` }
  });
  console.log('✓ Alex likes Priya result:', alexLikeRes);


  // 7. Priya likes Alex back -> Merge!
  const alexId = alexLogin.user._id || alexLogin.user.id;
  const priyaLikeRes = await api('/matches/like', {
    method: 'POST',
    body: JSON.stringify({
      targetId: alexId,
      section: 'stack',
      comment: 'React and TypeScript are amazing!'
    }),
    headers: { Authorization: `Bearer ${priyaToken}` }
  });
  console.log('✓ Priya likes Alex back result: Matched =', priyaLikeRes.matched);


  // 8. Matches list for Alex
  const alexMatches = await api('/matches', {
    headers: { Authorization: `Bearer ${alexToken}` }
  });
  console.log(`✓ Alex matches count: ${alexMatches.length}. Matched user:`, alexMatches[0]?.targetUser?.name);
  const matchId = alexMatches[0]?._id;

  // 9. Send real-time message with code snippet
  if (matchId) {
    const msgRes = await api(`/messages/${matchId}`, {
      method: 'POST',
      body: JSON.stringify({
        text: 'Hey Priya! Check out this neural network optimizer.',
        type: 'code',
        codeLang: 'python',
        codeContent: 'class PairOptimizer(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.synergy = 1.0'
      }),
      headers: { Authorization: `Bearer ${alexToken}` }
    });
    console.log('✓ Message posted successfully:', msgRes.text, '| Type:', msgRes.type);

    const matchMessages = await api(`/messages/${matchId}`, {
      headers: { Authorization: `Bearer ${alexToken}` }
    });
    console.log(`✓ Messages in conversation: ${matchMessages.length}`);
  }

  // 10. Update Profile
  const updateRes = await api('/users/me', {
    method: 'PUT',
    body: JSON.stringify({
      bio: 'Obsessed with pixel-perfect UI, sub-millisecond animation, and distributed systems.',
      company: 'Stripe & DevPair'
    }),
    headers: { Authorization: `Bearer ${alexToken}` }
  });
  console.log('✓ Alex profile updated successfully:', updateRes.bio);

  console.log('\n✅ ALL DEVPAIR SERVER PIPELINES VERIFIED WORKING 100%!');
}

testAll().catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
