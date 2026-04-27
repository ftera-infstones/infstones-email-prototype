// Campaigns list + detail view
const StatusPill = ({ status }) => {
  const map = {
    sent: { cls: 'sent', label: 'Sent' },
    draft: { cls: 'draft', label: 'Draft' },
    scheduled: { cls: 'scheduled', label: 'Scheduled' },
    sending: { cls: 'sending', label: 'Sending' },
  };
  const s = map[status] || map.draft;
  return <span className={`badge ${s.cls}`}><span className="badge-dot"/>{s.label}</span>;
};

const CampaignsList = () => {
  const { openCampaign, openEditor, setRoute } = useApp();
  const [filter, setFilter] = useState('all');
  const { campaigns } = SAMPLE_DATA;
  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);
  const counts = {
    all: campaigns.length,
    sent: campaigns.filter(c => c.status === 'sent').length,
    scheduled: campaigns.filter(c => c.status === 'scheduled').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
  };

  return (
    <div className="page-inner wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">Broadcast emails to segments or your whole list.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-amber" onClick={() => setRoute('templates')}><Icon name="plus" size={14}/> New campaign</button>
        </div>
      </div>

      <div className="hstack" style={{ marginBottom: 14, gap: 12 }}>
        <div className="segmented">
          {[['all', 'All'], ['sent', 'Sent'], ['scheduled', 'Scheduled'], ['draft', 'Drafts']].map(([k, l]) => (
            <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>
              {l} <span style={{ opacity: 0.6, marginLeft: 4, fontFamily: 'var(--font-mono)', fontSize: 10 }}>{counts[k]}</span>
            </button>
          ))}
        </div>
        <div className="spacer"/>
        <button className="btn btn-ghost btn-sm"><Icon name="filter" size={13}/> Filter</button>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Audience</th>
              <th style={{ textAlign: 'right' }}>Recipients</th>
              <th style={{ textAlign: 'right' }}>Open</th>
              <th style={{ textAlign: 'right' }}>Click</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} onClick={() => c.status === 'draft' ? openEditor(c.id) : openCampaign(c.id)}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 440 }}>
                    {c.subject}
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                    {c.status === 'sent' && `Sent ${c.sentAt}`}
                    {c.status === 'scheduled' && `Sends ${c.scheduledAt}`}
                    {c.status === 'draft' && `Edited ${c.lastEdited}`}
                  </div>
                </td>
                <td><StatusPill status={c.status}/></td>
                <td>
                  <span className="chip">{c.segment || 'All Subscribers'}</span>
                </td>
                <td className="num" style={{ textAlign: 'right' }}>{c.recipients ? c.recipients.toLocaleString() : '—'}</td>
                <td className="num" style={{ textAlign: 'right' }}>{c.openRate ? (c.openRate * 100).toFixed(1) + '%' : '—'}</td>
                <td className="num" style={{ textAlign: 'right' }}>{c.clickRate ? (c.clickRate * 100).toFixed(1) + '%' : '—'}</td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="icon-btn" style={{ width: 28, height: 28 }}><Icon name="more" size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CampaignDetail = ({ id }) => {
  const { setRoute, openEditor } = useApp();
  const campaign = SAMPLE_DATA.campaigns.find(c => c.id === id) || SAMPLE_DATA.campaigns[0];
  const delivered = Math.round(campaign.recipients * (1 - campaign.bounceRate));
  const opens = Math.round(delivered * campaign.openRate);
  const clicks = Math.round(delivered * campaign.clickRate);

  const funnelRows = [
    { label: 'Recipients', value: campaign.recipients, pct: 1, color: 'var(--ink)' },
    { label: 'Delivered', value: delivered, pct: 1 - campaign.bounceRate, color: 'var(--ink)' },
    { label: 'Opened', value: opens, pct: campaign.openRate, color: 'var(--amber)' },
    { label: 'Clicked', value: clicks, pct: campaign.clickRate, color: 'var(--green)' },
    { label: 'Unsubscribed', value: campaign.unsubscribes, pct: campaign.unsubscribes / campaign.recipients, color: 'var(--red)' },
  ];

  return (
    <div className="page-inner wide">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute('campaigns')}>
          <Icon name="arrowRight" size={12} style={{ transform: 'rotate(180deg)' }}/> All campaigns
        </button>
      </div>

      <div className="page-header">
        <div>
          <div className="hstack" style={{ gap: 10, marginBottom: 8 }}>
            <StatusPill status={campaign.status}/>
            <span className="chip"><Icon name="users" size={11}/> {campaign.segment || 'All Subscribers'}</span>
            <span className="chip"><Icon name="clock" size={11}/> Sent {campaign.sentAt}</span>
          </div>
          <h1 className="page-title">{campaign.name}</h1>
          <p className="page-subtitle">Subject: {campaign.subject}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="copy" size={14}/> Duplicate</button>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export report</button>
          <button className="btn btn-primary" onClick={() => openEditor(id)}><Icon name="edit" size={14}/> Edit</button>
        </div>
      </div>

      <div className="kpi-grid">
        <Kpi label="Delivered" value={delivered.toLocaleString()} delta={`${((1 - campaign.bounceRate) * 100).toFixed(1)}% of sent`} deltaDir="up"/>
        <Kpi label="Opens" value={opens.toLocaleString()} delta={`${(campaign.openRate * 100).toFixed(1)}% rate`} deltaDir="up"/>
        <Kpi label="Clicks" value={clicks.toLocaleString()} delta={`${(campaign.clickRate * 100).toFixed(1)}% rate`} deltaDir="up"/>
        <Kpi label="Bounces" value={Math.round(campaign.recipients * campaign.bounceRate)} delta={`${(campaign.bounceRate * 100).toFixed(2)}% rate`} deltaDir="down"/>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-hd"><h3>Engagement funnel</h3></div>
          <div className="card-pad">
            {funnelRows.map(r => (
              <div key={r.label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ fontWeight: 500 }}>{r.label}</span>
                  <span className="mono muted">{r.value.toLocaleString()} · {(r.pct * 100).toFixed(r.pct < 0.01 ? 2 : 1)}%</span>
                </div>
                <div className="progress">
                  <div className="progress-fill" style={{ width: `${r.pct * 100}%`, background: r.color }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><h3>Top links</h3></div>
          <table className="tbl">
            <thead>
              <tr><th>URL</th><th style={{ textAlign: 'right' }}>Clicks</th></tr>
            </thead>
            <tbody>
              {[
                ['infstones.com/eigenlayer', 142],
                ['infstones.com/blog/q1-validator-econ', 98],
                ['docs.infstones.com/batch-staking', 64],
                ['infstones.com/pricing', 41],
                ['infstones.com/contact', 12],
              ].map(([url, n]) => (
                <tr key={url}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                    <Icon name="link" size={11} style={{ marginRight: 6, color: 'var(--muted-2)' }}/>
                    {url}
                  </td>
                  <td className="num" style={{ textAlign: 'right' }}>{n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

window.CampaignsList = CampaignsList;
window.CampaignDetail = CampaignDetail;
window.StatusPill = StatusPill;
