// Dashboard page — KPIs, trend chart, campaign comparison
const Sparkline = ({ values, color = 'var(--amber)', w = 72, h = 28 }) => {
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - ((v - min) / range) * h]);
  const d = 'M ' + pts.map(p => p.join(' ')).join(' L ');
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <path d={area} fill={color} opacity="0.12"/>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
};

const Kpi = ({ label, value, unit, delta, prev, deltaDir = 'up', spark, sparkColor }) => (
  <div className="kpi">
    <div className="kpi-label">{label}</div>
    <div className="kpi-value tabnum">{value}{unit && <span className="unit">{unit}</span>}</div>
    <div className={`kpi-delta ${deltaDir}`}>
      <Icon name={deltaDir === 'up' ? 'arrowUp' : 'arrowDown'} size={11}/>
      {delta} <span className="prev">vs prev. 30d</span>
    </div>
    {spark && <div className="kpi-spark"><Sparkline values={spark} color={sparkColor || 'var(--amber)'}/></div>}
  </div>
);

const TrendChart = ({ trend, period }) => {
  const w = 820, h = 220, pad = { l: 44, r: 8, t: 16, b: 32 };
  const filtered = trend.slice(period === '30d' ? -3 : period === '90d' ? -7 : 0);
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const maxY = 0.6;
  const xFor = i => pad.l + (filtered.length === 1 ? innerW/2 : (i / (filtered.length - 1)) * innerW);
  const yFor = v => pad.t + (1 - v / maxY) * innerH;
  const openPath = filtered.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.openRate)}`).join(' ');
  const clickPath = filtered.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.clickRate)}`).join(' ');
  const yTicks = [0, 0.15, 0.3, 0.45, 0.6];
  const [hover, setHover] = useState(null);

  return (
    <div style={{ position: 'relative' }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', overflow: 'visible' }}>
        {yTicks.map(t => (
          <g key={t}>
            <line x1={pad.l} y1={yFor(t)} x2={w - pad.r} y2={yFor(t)} stroke="var(--hairline)" strokeDasharray="2 4"/>
            <text x={pad.l - 8} y={yFor(t) + 3} fontSize="10" fill="var(--muted)" textAnchor="end" fontFamily="JetBrains Mono">{Math.round(t * 100)}%</text>
          </g>
        ))}
        {/* Open rate area */}
        <path d={`${openPath} L ${xFor(filtered.length-1)} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`} fill="var(--amber)" opacity="0.08"/>
        <path d={openPath} fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"/>
        <path d={clickPath} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeDasharray="0"/>
        {filtered.map((d, i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: 'pointer' }}>
            <rect x={xFor(i) - 20} y={pad.t} width={40} height={innerH} fill="transparent"/>
            <circle cx={xFor(i)} cy={yFor(d.openRate)} r={hover === i ? 5 : 3.5} fill="var(--surface)" stroke="var(--amber)" strokeWidth="2"/>
            <circle cx={xFor(i)} cy={yFor(d.clickRate)} r={hover === i ? 5 : 3.5} fill="var(--surface)" stroke="var(--ink)" strokeWidth="2"/>
            <text x={xFor(i)} y={h - pad.b + 16} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="JetBrains Mono">{d.date.slice(5)}</text>
          </g>
        ))}
        {hover != null && (
          <g>
            <line x1={xFor(hover)} y1={pad.t} x2={xFor(hover)} y2={h - pad.b} stroke="var(--ink)" strokeDasharray="3 3" opacity="0.3"/>
          </g>
        )}
      </svg>
      {hover != null && (
        <div style={{
          position: 'absolute',
          left: `calc(${(xFor(hover) / w) * 100}% + 12px)`,
          top: 12,
          background: 'var(--ink)', color: 'white', padding: '10px 12px',
          borderRadius: 'var(--r-sm)', boxShadow: 'var(--shadow-lg)', fontSize: 11, minWidth: 200,
          pointerEvents: 'none',
        }}>
          <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{filtered[hover].name}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ opacity: 0.7 }}>Sent</span>
            <span className="mono">{filtered[hover].sent.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span style={{ color: 'var(--amber)' }}>● Open rate</span>
            <span className="mono">{(filtered[hover].openRate * 100).toFixed(1)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span>● Click rate</span>
            <span className="mono">{(filtered[hover].clickRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const { setRoute, openCampaign } = useApp();
  const [period, setPeriod] = useState('90d');
  const { campaigns, trend } = SAMPLE_DATA;
  const sent = campaigns.filter(c => c.status === 'sent');
  const topCampaigns = sent.slice(0, 7);
  const [sortKey, setSortKey] = useState('sentAt');
  const [sortDir, setSortDir] = useState('desc');
  const sorted = useMemo(() => {
    const arr = [...topCampaigns];
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av == null) return 1; if (bv == null) return -1;
      const r = av > bv ? 1 : av < bv ? -1 : 0;
      return sortDir === 'asc' ? r : -r;
    });
    return arr;
  }, [sortKey, sortDir, topCampaigns]);
  const maxOpen = Math.max(...topCampaigns.map(c => c.openRate));
  const minOpen = Math.min(...topCampaigns.map(c => c.openRate));

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Good morning, Sam</h1>
          <p className="page-subtitle">Here's how your campaigns have performed over the last {period === '30d' ? '30 days' : period === '90d' ? '90 days' : '6 months'}.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-amber" onClick={() => setRoute('templates')}><Icon name="plus" size={14}/> New campaign</button>
        </div>
      </div>

      <div className="kpi-grid">
        <Kpi label="Total subscribers" value="10,114" delta="+3.6%" deltaDir="up"
             spark={[9720, 9780, 9810, 9850, 9900, 9980, 10050, 10114]} sparkColor="var(--green)"/>
        <Kpi label="Avg. open rate" value="32.8" unit="%" delta="+2.1pp" deltaDir="up"
             spark={[0.28, 0.27, 0.30, 0.29, 0.33, 0.30, 0.35, 0.328]} sparkColor="var(--amber)"/>
        <Kpi label="Avg. click rate" value="7.2" unit="%" delta="+0.8pp" deltaDir="up"
             spark={[0.05, 0.06, 0.05, 0.07, 0.06, 0.08, 0.07, 0.072]} sparkColor="var(--ink)"/>
        <Kpi label="Bounce rate" value="1.1" unit="%" delta="-0.3pp" deltaDir="down"
             spark={[0.015, 0.014, 0.013, 0.013, 0.012, 0.012, 0.011, 0.011]} sparkColor="var(--red)"/>
      </div>

      <div style={{ marginTop: 20 }} className="card">
        <div className="card-hd">
          <div>
            <h3>Performance trend</h3>
            <div className="sub">Open & click rate across recent sends</div>
          </div>
          <div className="hstack">
            <div style={{ display: 'flex', gap: 14, fontSize: 12, marginRight: 12 }}>
              <span className="hstack" style={{ gap: 6 }}><span style={{ width: 10, height: 2, background: 'var(--amber)' }}/> Open rate</span>
              <span className="hstack" style={{ gap: 6 }}><span style={{ width: 10, height: 2, background: 'var(--ink)' }}/> Click rate</span>
            </div>
            <div className="segmented">
              {['30d', '90d', '6m'].map(p => (
                <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
                  {p === '30d' ? 'Last 30 days' : p === '90d' ? 'Last 90 days' : 'Last 6 months'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-pad">
          <TrendChart trend={trend} period={period} />
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-hd">
            <div>
              <h3>Campaign comparison</h3>
              <div className="sub">Last 7 sent campaigns — click column to sort</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setRoute('campaigns')}>View all <Icon name="arrowRight" size={12}/></button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                {[
                  ['name', 'Campaign'],
                  ['sentAt', 'Sent'],
                  ['recipients', 'Delivered'],
                  ['openRate', 'Open'],
                  ['clickRate', 'Click'],
                ].map(([k, l]) => (
                  <th key={k} style={{ cursor: 'pointer' }} onClick={() => { if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(k); setSortDir('desc'); }}}>
                    {l} {sortKey === k && <Icon name={sortDir === 'asc' ? 'arrowUp' : 'arrowDown'} size={10} style={{ marginLeft: 2 }}/>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(c => (
                <tr key={c.id} onClick={() => openCampaign(c.id)}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{c.subject}</div>
                  </td>
                  <td className="num muted">{c.sentAt}</td>
                  <td className="num">{c.recipients.toLocaleString()}</td>
                  <td className="num" style={{ fontWeight: c.openRate === maxOpen ? 700 : 500, color: c.openRate === maxOpen ? 'var(--green)' : c.openRate === minOpen ? 'var(--red)' : undefined }}>
                    {(c.openRate * 100).toFixed(1)}%
                  </td>
                  <td className="num">{(c.clickRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="vstack" style={{ gap: 20 }}>
          <div className="card">
            <div className="card-hd"><h3>This month</h3></div>
            <div className="card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span className="muted" style={{ fontSize: 12 }}>Campaigns sent</span>
                <span className="mono" style={{ fontWeight: 600 }}>3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span className="muted" style={{ fontSize: 12 }}>Emails delivered</span>
                <span className="mono" style={{ fontWeight: 600 }}>28,665</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--hairline)' }}>
                <span className="muted" style={{ fontSize: 12 }}>New subscribers</span>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--green)' }}>+352</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span className="muted" style={{ fontSize: 12 }}>Unsubscribes</span>
                <span className="mono" style={{ fontWeight: 600 }}>23</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Upcoming</h3></div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  background: 'var(--amber-tint)', color: 'var(--amber-active)',
                  padding: 10, borderRadius: 'var(--r-sm)', width: 46, textAlign: 'center',
                  border: '1px solid var(--amber-soft)',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>APR</div>
                  <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>28</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>May Newsletter — Solana Breakpoint Recap</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>09:00 PST · 10,211 recipients</div>
                  <div className="hstack" style={{ marginTop: 8, gap: 6 }}>
                    <span className="badge scheduled"><span className="badge-dot"/>Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'linear-gradient(180deg, var(--amber-tint), var(--surface))' }}>
            <div className="card-pad">
              <div className="hstack" style={{ marginBottom: 6, gap: 6 }}>
                <Icon name="zap" size={13} style={{ color: 'var(--amber-active)' }}/>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--amber-active)' }}>Tip</span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Your EigenLayer segment opens 23% more</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Consider sending AVS-related updates to this segment first.</div>
              <button className="btn btn-secondary btn-sm">View segment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
