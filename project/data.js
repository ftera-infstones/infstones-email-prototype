// Sample data for InfStones Email Marketing System
const SAMPLE_DATA = (() => {
  const subscribers = [
    { email: 'nina.kozlov@chainlink.foundation', name: 'Nina Kozlov', org: 'Chainlink', segment: 'Validators', status: 'active', joined: '2025-11-03' },
    { email: 'tobi.mensah@eigenlayer.xyz', name: 'Tobi Mensah', org: 'EigenLayer', segment: 'Builders', status: 'active', joined: '2025-09-22' },
    { email: 'priya.raman@polygon.technology', name: 'Priya Raman', org: 'Polygon', segment: 'Stakers', status: 'active', joined: '2025-07-11' },
    { email: 'marco.bianchi@staked.us', name: 'Marco Bianchi', org: 'Staked', segment: 'Validators', status: 'active', joined: '2026-01-14' },
    { email: 'h.akiyama@figment.io', name: 'Haru Akiyama', org: 'Figment', segment: 'Validators', status: 'active', joined: '2026-02-08' },
    { email: 'sarah.n@alchemy.com', name: 'Sarah Nguyen', org: 'Alchemy', segment: 'Builders', status: 'active', joined: '2025-12-19' },
    { email: 'david@blockdaemon.com', name: 'David Park', org: 'Blockdaemon', segment: 'Partners', status: 'active', joined: '2025-08-30' },
    { email: 'leo@ledger.fr', name: 'Léo Durand', org: 'Ledger', segment: 'Partners', status: 'unsubscribed', joined: '2025-06-02' },
    { email: 'emma.fischer@obol.tech', name: 'Emma Fischer', org: 'Obol', segment: 'Builders', status: 'active', joined: '2026-03-11' },
    { email: 'r.kowalski@lido.fi', name: 'Rafał Kowalski', org: 'Lido', segment: 'Stakers', status: 'active', joined: '2025-10-26' },
    { email: 'ana.sousa@p2p.org', name: 'Ana Sousa', org: 'P2P', segment: 'Validators', status: 'active', joined: '2026-01-28' },
    { email: 'james.o@consensys.net', name: 'James O\'Donnell', org: 'Consensys', segment: 'Builders', status: 'active', joined: '2025-05-14' },
  ];

  const campaigns = [
    { id: 'c_8h3', name: 'April Validator Economics Report', subject: 'Q1 validator yields, restaking flows, and what\'s next', status: 'sent', sentAt: '2026-04-14', recipients: 9842, openRate: 0.342, clickRate: 0.078, bounceRate: 0.011, unsubscribes: 8, segment: 'All Subscribers', preview: 'Validator economics this quarter saw a notable shift…' },
    { id: 'c_8h2', name: 'EigenLayer AVS Integration Launch', subject: 'You can now restake with InfStones on 14 AVSs', status: 'sent', sentAt: '2026-04-02', recipients: 8721, openRate: 0.387, clickRate: 0.112, bounceRate: 0.008, unsubscribes: 3, segment: 'Stakers + Builders' },
    { id: 'c_8h1', name: 'March Newsletter — Network Upgrades', subject: 'Dencun aftermath, Solana Firedancer update, TIA unlock', status: 'sent', sentAt: '2026-03-28', recipients: 10102, openRate: 0.298, clickRate: 0.054, bounceRate: 0.014, unsubscribes: 12 },
    { id: 'c_7f4', name: 'New API: Batch Staking v2', subject: 'Reduce gas costs by up to 40% with batched staking', status: 'sent', sentAt: '2026-03-19', recipients: 4320, openRate: 0.412, clickRate: 0.146, bounceRate: 0.007, unsubscribes: 2, segment: 'Builders' },
    { id: 'c_7f2', name: 'ETHDenver Meetup Invitation', subject: 'Coffee + canapés with the InfStones team — RSVP', status: 'sent', sentAt: '2026-02-24', recipients: 2840, openRate: 0.521, clickRate: 0.189, bounceRate: 0.005, unsubscribes: 1 },
    { id: 'c_7e9', name: 'February Product Update', subject: 'New dashboard, slashing protection improvements', status: 'sent', sentAt: '2026-02-11', recipients: 9430, openRate: 0.274, clickRate: 0.061, bounceRate: 0.012, unsubscribes: 9 },
    { id: 'c_7e1', name: 'Celestia TIA Staking Now Live', subject: 'Stake TIA on InfStones — 14.2% estimated APR', status: 'sent', sentAt: '2026-01-29', recipients: 6210, openRate: 0.335, clickRate: 0.098, bounceRate: 0.010, unsubscribes: 4 },
    { id: 'c_7d8', name: 'Annual Security Audit — 2025 Report', subject: 'Download our 2025 infrastructure security audit', status: 'sent', sentAt: '2026-01-15', recipients: 9988, openRate: 0.261, clickRate: 0.044, bounceRate: 0.013, unsubscribes: 6 },
    { id: 'c_7d1', name: 'January Network Digest', subject: 'Babylon, Berachain, and 8 new networks coming to InfStones', status: 'sent', sentAt: '2026-01-08', recipients: 9842, openRate: 0.318, clickRate: 0.072, bounceRate: 0.009, unsubscribes: 5 },
    { id: 'c_7c5', name: 'Year in Review 2025', subject: '$4.2B secured, 42 networks, 11K validators — thank you', status: 'sent', sentAt: '2025-12-28', recipients: 9120, openRate: 0.441, clickRate: 0.134, bounceRate: 0.008, unsubscribes: 2 },
    { id: 'c_9a1', name: 'May Newsletter — Solana Breakpoint Recap', subject: 'What we learned at Breakpoint Singapore', status: 'scheduled', scheduledAt: '2026-04-28 09:00 PST', recipients: 10211, segment: 'All Subscribers' },
    { id: 'c_9a2', name: 'Restaking Report: Q2 Preview', subject: 'Draft', status: 'draft', lastEdited: '2026-04-20 14:32', recipients: 0 },
  ];

  // 90-day trend data (opens + clicks rate per campaign send event)
  const trend = [
    { date: '2026-01-29', sent: 6210, openRate: 0.335, clickRate: 0.098, name: 'Celestia TIA Staking' },
    { date: '2026-02-11', sent: 9430, openRate: 0.274, clickRate: 0.061, name: 'February Update' },
    { date: '2026-02-24', sent: 2840, openRate: 0.521, clickRate: 0.189, name: 'ETHDenver Meetup' },
    { date: '2026-03-19', sent: 4320, openRate: 0.412, clickRate: 0.146, name: 'Batch Staking v2' },
    { date: '2026-03-28', sent: 10102, openRate: 0.298, clickRate: 0.054, name: 'March Newsletter' },
    { date: '2026-04-02', sent: 8721, openRate: 0.387, clickRate: 0.112, name: 'EigenLayer AVS' },
    { date: '2026-04-14', sent: 9842, openRate: 0.342, clickRate: 0.078, name: 'Validator Economics' },
  ];

  const segments = [
    { id: 's1', name: 'All Subscribers', count: 10114, description: 'Every active contact', isSmart: false },
    { id: 's2', name: 'Validators', count: 3284, description: 'Contacts tagged as running validator nodes', isSmart: true },
    { id: 's3', name: 'Builders', count: 2918, description: 'Contacts using our API or SDK', isSmart: true },
    { id: 's4', name: 'Stakers', count: 4102, description: 'Individual staking users', isSmart: true },
    { id: 's5', name: 'Partners', count: 412, description: 'Ecosystem partners and integrators', isSmart: false },
    { id: 's6', name: 'EigenLayer restakers', count: 1841, description: 'Opened any EigenLayer email in last 60 days', isSmart: true },
  ];

  const templates = [
    { id: 't1', name: 'Validator Economics', category: 'Newsletter', preset: true, palette: ['#EDB500', '#0B0E1E'], style: 'magazine', description: 'Cover image + quarterly yield chart + 3 story blocks' },
    { id: 't2', name: 'Minimal Newsletter', category: 'Newsletter', preset: true, palette: ['#0B0E1E', '#FAFAF7'], style: 'minimal', description: 'Text-forward, no images, for plain-text vibe' },
    { id: 't3', name: 'Network Upgrade Digest', category: 'Newsletter', preset: true, palette: ['#1a0e6d', '#95BFFF'], style: 'magazine' },
    { id: 't4', name: 'New Network Launch', category: 'Product Update', preset: true, palette: ['#EDB500', '#0B0E1E'], style: 'hero' },
    { id: 't5', name: 'API Version Release', category: 'Product Update', preset: true, palette: ['#0F9D58', '#FAFAF7'], style: 'changelog' },
    { id: 't6', name: 'Staking APR Promo', category: 'Promotion', preset: true, palette: ['#EDB500', '#0B0E1E'], style: 'bold' },
    { id: 't7', name: 'Limited-Time Restaking', category: 'Promotion', preset: true, palette: ['#D64545', '#FAFAF7'], style: 'bold' },
    { id: 't8', name: 'Event Invitation — Online', category: 'Event', preset: true, palette: ['#227AFF', '#FAFAF7'], style: 'invite' },
    { id: 't9', name: 'Meetup RSVP', category: 'Event', preset: true, palette: ['#0B0E1E', '#EDB500'], style: 'invite' },
    { id: 't10', name: 'General Announcement', category: 'Announcement', preset: true, palette: ['#0B0E1E', '#FAFAF7'], style: 'formal' },
    { id: 't11', name: 'Security Advisory', category: 'Announcement', preset: true, palette: ['#D64545', '#FAFAF7'], style: 'formal' },
    { id: 't12', name: 'April Newsletter (My Draft)', category: 'Custom', preset: false, palette: ['#EDB500', '#0B0E1E'], style: 'magazine' },
  ];

  const users = [
    { id: 'u1', email: 'sam.chen@infstones.com', name: 'Sam Chen', role: 'admin', avatar: 'SC', last: 'Active now', current: true },
    { id: 'u2', email: 'priya.r@infstones.com', name: 'Priya Reddy', role: 'admin', avatar: 'PR', last: '2 hours ago' },
    { id: 'u3', email: 'marcus.l@infstones.com', name: 'Marcus Lee', role: 'member', avatar: 'ML', last: 'Yesterday' },
    { id: 'u4', email: 'yuki.t@infstones.com', name: 'Yuki Tanaka', role: 'member', avatar: 'YT', last: '3 days ago' },
    { id: 'u5', email: 'claire.d@infstones.com', name: 'Claire Dubois', role: 'member', avatar: 'CD', last: 'Last week' },
  ];

  return { subscribers, campaigns, trend, segments, templates, users };
})();

window.SAMPLE_DATA = SAMPLE_DATA;
