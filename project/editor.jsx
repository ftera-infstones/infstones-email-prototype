// Email editor, block system, preview with desktop/mobile + UTM tab
const DEFAULT_BLOCKS = [
  { id: 'b1', type: 'heading', text: 'Quarterly Validator Report' },
  { id: 'b2', type: 'text', text: 'Hi {{name}},\n\nQ1 saw a notable shift in validator economics: restaking TVL crossed $18B, while average staking APR on Ethereum settled near 3.2%. Here are the three stories that shaped the quarter.' },
  { id: 'b3', type: 'image', alt: 'Quarterly yield chart', caption: 'Staking APR across 8 major networks, Jan–Mar 2026' },
  { id: 'b4', type: 'heading2', text: 'EigenLayer AVS growth' },
  { id: 'b5', type: 'text', text: 'Fourteen new AVSs launched this quarter. InfStones operators are now securing 6 of them in production, with 8 more in testnet.' },
  { id: 'b6', type: 'button', text: 'Read the full report', url: 'https://infstones.com/blog/q1-validator-econ', style: 'primary' },
  { id: 'b7', type: 'divider' },
  { id: 'b8', type: 'social', platforms: ['twitter', 'linkedin', 'discord', 'github'] },
  { id: 'b9', type: 'text', text: 'Thanks for staking with us.\n— The InfStones team', small: true },
];

const BLOCK_LIBRARY = [
  { type: 'heading', icon: 'type', label: 'Heading' },
  { type: 'heading2', icon: 'type', label: 'Subheading' },
  { type: 'text', icon: 'type', label: 'Text' },
  { type: 'image', icon: 'image', label: 'Image' },
  { type: 'button', icon: 'button', label: 'Button' },
  { type: 'divider', icon: 'minus', label: 'Divider' },
  { type: 'social', icon: 'share', label: 'Social links' },
  { type: 'spacer', icon: 'minus', label: 'Spacer' },
];

const socialIcon = (p) => ({
  twitter: 'X', linkedin: 'in', discord: 'DC', github: 'GH', telegram: 'TG', youtube: 'YT',
}[p] || '?');

const renderBlock = (b, opts = {}) => {
  const { sample = { name: 'John Doe', email: 'john@example.com' }, utm } = opts;
  const interp = (s) => (s || '').replace(/\{\{(\w+)\}\}/g, (_, k) => sample[k] || `{{${k}}}`);
  const appendUtm = (url) => {
    if (!utm || !url || url.startsWith('mailto:') || url.startsWith('#')) return url;
    const params = Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    if (!params) return url;
    return url + (url.includes('?') ? '&' : '?') + params;
  };
  switch (b.type) {
    case 'heading':
      return <h1 style={{ fontFamily: 'Inter, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', margin: '0 0 16px', color: '#0B0E1E' }}>{interp(b.text)}</h1>;
    case 'heading2':
      return <h2 style={{ fontSize: 18, fontWeight: 700, margin: '24px 0 12px', color: '#0B0E1E' }}>{interp(b.text)}</h2>;
    case 'text':
      return <p style={{ fontSize: b.small ? 13 : 15, lineHeight: 1.6, margin: '0 0 16px', color: b.small ? '#6B6E7B' : '#2A2E3F', whiteSpace: 'pre-wrap' }}>{interp(b.text)}</p>;
    case 'image':
      return (
        <div style={{ margin: '16px 0' }}>
          <div className="placeholder-img" style={{ height: 200, width: '100%', borderRadius: 8 }}>{b.alt || 'IMAGE'}</div>
          {b.caption && <div style={{ fontSize: 12, color: '#6B6E7B', textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>{b.caption}</div>}
        </div>
      );
    case 'button':
      const bgColor = b.style === 'outlined' ? 'transparent' : (b.color || '#EDB500');
      const txtColor = b.style === 'outlined' ? '#0B0E1E' : '#0B0E1E';
      return (
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <a href={appendUtm(b.url)} data-preview-url={appendUtm(b.url)} style={{
            display: 'inline-block', padding: '12px 28px',
            background: bgColor, color: txtColor,
            border: b.style === 'outlined' ? '2px solid #0B0E1E' : 'none',
            borderRadius: b.radius || 8, textDecoration: 'none',
            fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>{b.text}</a>
        </div>
      );
    case 'divider':
      return <div style={{ borderTop: `${b.thickness || 1}px ${b.lineStyle || 'solid'} #E8E5DC`, margin: `${b.padding || 20}px 0` }}/>;
    case 'social':
      return (
        <div style={{ textAlign: 'center', margin: '24px 0', display: 'flex', justifyContent: 'center', gap: 10 }}>
          {(b.platforms || []).map(p => (
            <a key={p} href={appendUtm(`https://${p}.com/infstones`)} data-preview-url={appendUtm(`https://${p}.com/infstones`)} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#0B0E1E', color: '#EDB500',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{socialIcon(p)}</a>
          ))}
        </div>
      );
    case 'spacer':
      return <div style={{ height: b.height || 24 }}/>;
    default:
      return null;
  }
};

const EmailCanvas = ({ blocks, opts = {}, width }) => (
  <div style={{
    width: width || 600, margin: '0 auto',
    background: '#FFFFFF', padding: '40px 32px 24px', fontFamily: 'Inter, sans-serif',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  }}>
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: '1px solid #E8E5DC', marginBottom: 24 }}>
      <div style={{ width: 24, height: 24, background: '#0B0E1E', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M6 4L18 4L22 12L18 20L6 20L2 12L6 4Z" fill="none" stroke="#EDB500" strokeWidth="2"/><rect x="9" y="9" width="6" height="6" fill="#EDB500"/></svg>
      </div>
      <div style={{ fontFamily: 'Syncopate', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#0B0E1E' }}>INFSTONES</div>
    </div>
    {blocks.map(b => <Fragment key={b.id}>{renderBlock(b, opts)}</Fragment>)}
    {/* Footer */}
    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #E8E5DC', fontSize: 11, color: '#9A9DA8', textAlign: 'center', lineHeight: 1.7 }}>
      <div style={{ fontWeight: 600, color: '#6B6E7B', marginBottom: 4 }}>InfStones, Inc.</div>
      <div>355 Bryant St., San Francisco, CA 94107</div>
      <div style={{ marginTop: 8 }}>
        <a style={{ color: '#6B6E7B', marginRight: 12 }}>Unsubscribe</a>
        <a style={{ color: '#6B6E7B', marginRight: 12 }}>Preferences</a>
        <a style={{ color: '#6B6E7B' }}>View in browser</a>
      </div>
    </div>
  </div>
);

// ============ Editor ============
const CampaignEditor = ({ id }) => {
  const { setRoute, toast, openCampaign } = useApp();
  const campaign = SAMPLE_DATA.campaigns.find(c => c.id === id) || SAMPLE_DATA.campaigns[SAMPLE_DATA.campaigns.length - 1];
  const [blocks, setBlocks] = useState(DEFAULT_BLOCKS);
  const [selected, setSelected] = useState('b1');
  const [panel, setPanel] = useState('content'); // content, settings, utm
  const [previewOpen, setPreviewOpen] = useState(true);
  const [device, setDevice] = useState('desktop');
  const [previewTab, setPreviewTab] = useState('preview'); // preview | links
  const [testOpen, setTestOpen] = useState(false);
  const [subject, setSubject] = useState(campaign.subject === 'Draft' ? 'Introducing restaking report — Q2 preview' : campaign.subject);
  const [fromName, setFromName] = useState('InfStones Team');
  const [fromEmail, setFromEmail] = useState('hello@mail.infstones.com');
  const [utm, setUtm] = useState({
    utm_source: 'newsletter',
    utm_medium: 'email',
    utm_campaign: 'q2-restaking-preview',
    utm_term: '',
    utm_content: '',
  });

  const selBlock = blocks.find(b => b.id === selected);
  const updateBlock = (id, patch) => setBlocks(bs => bs.map(b => b.id === id ? { ...b, ...patch } : b));
  const removeBlock = (id) => setBlocks(bs => bs.filter(b => b.id !== id));
  const addBlock = (type) => {
    const id = 'b' + Date.now();
    const defaults = {
      heading: { text: 'New heading' },
      heading2: { text: 'New subheading' },
      text: { text: 'Enter your text here…' },
      image: { alt: 'Image description' },
      button: { text: 'Click me', url: 'https://infstones.com', style: 'primary' },
      divider: {},
      social: { platforms: ['twitter', 'linkedin', 'discord'] },
      spacer: { height: 24 },
    };
    setBlocks(bs => [...bs, { id, type, ...defaults[type] }]);
    setSelected(id);
  };

  // Drag reorder
  const dragIdx = useRef(null);
  const [dropIdx, setDropIdx] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Editor sub-topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 20px', borderBottom: '1px solid var(--hairline)', background: 'var(--surface)',
      }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setRoute('campaigns')}>
          <Icon name="arrowRight" size={12} style={{ transform: 'rotate(180deg)' }}/> Back
        </button>
        <div style={{ height: 20, width: 1, background: 'var(--hairline)' }}/>
        <input
          className="input"
          style={{ width: 320, border: 'none', background: 'transparent', fontWeight: 600, padding: '4px 6px' }}
          defaultValue={campaign.name}
        />
        <span className="chip"><StatusPill status="draft"/></span>
        <span className="muted mono" style={{ fontSize: 11 }}>Autosaved 2s ago</span>
        <div className="spacer"/>
        <div className="segmented">
          <button className={panel === 'content' ? 'active' : ''} onClick={() => setPanel('content')}>Content</button>
          <button className={panel === 'settings' ? 'active' : ''} onClick={() => setPanel('settings')}>Details</button>
          <button className={panel === 'utm' ? 'active' : ''} onClick={() => setPanel('utm')}>UTM</button>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setPreviewOpen(o => !o)}>
          <Icon name="eye" size={13}/> {previewOpen ? 'Hide' : 'Preview'}
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => setTestOpen(true)}>
          <Icon name="send" size={13}/> Send test
        </button>
        <button className="btn btn-amber btn-sm" onClick={() => { toast('Campaign scheduled for review', 'success'); }}>
          <Icon name="paperplane" size={13}/> Schedule
        </button>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: previewOpen ? '260px 1fr 1fr' : '260px 1fr', minHeight: 0, background: 'var(--bg-sunken)' }}>
        {/* Left rail */}
        <div style={{ background: 'var(--surface)', borderRight: '1px solid var(--hairline)', overflowY: 'auto' }}>
          {panel === 'content' && (
            <div style={{ padding: 16 }}>
              <div className="sb-section-title" style={{ padding: '0 0 8px' }}>Add block</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {BLOCK_LIBRARY.map(b => (
                  <button key={b.type} onClick={() => addBlock(b.type)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6,
                    padding: 10, border: '1px solid var(--hairline)', background: 'var(--surface)',
                    borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500, transition: 'all 120ms',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <Icon name={b.icon} size={14} style={{ color: 'var(--muted)' }}/> {b.label}
                  </button>
                ))}
              </div>
              {selBlock && (
                <>
                  <div className="sb-section-title" style={{ padding: '12px 0 8px' }}>{selBlock.type} settings</div>
                  <BlockSettings block={selBlock} update={patch => updateBlock(selBlock.id, patch)} remove={() => removeBlock(selBlock.id)}/>
                </>
              )}
            </div>
          )}
          {panel === 'settings' && (
            <div style={{ padding: 16 }}>
              <div className="vstack" style={{ gap: 16 }}>
                <div className="field">
                  <label className="field-label">Subject line <span className="req">*</span></label>
                  <input className="input" value={subject} onChange={e => setSubject(e.target.value)}/>
                  <div className="field-hint">{subject.length} chars · Recommended ≤ 60</div>
                </div>
                <div className="field">
                  <label className="field-label">Preview text</label>
                  <input className="input" placeholder="Shown after the subject in most inboxes"/>
                </div>
                <div className="field">
                  <label className="field-label">From name</label>
                  <input className="input" value={fromName} onChange={e => setFromName(e.target.value)}/>
                </div>
                <div className="field">
                  <label className="field-label">From address</label>
                  <input className="input" value={fromEmail} onChange={e => setFromEmail(e.target.value)}/>
                  <div className="field-hint">Domain verified · DKIM, SPF, DMARC ✓</div>
                </div>
                <div className="field">
                  <label className="field-label">Audience</label>
                  <select className="select">
                    {SAMPLE_DATA.segments.map(s => <option key={s.id}>{s.name} · {s.count.toLocaleString()}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
          {panel === 'utm' && (
            <UtmPanel utm={utm} setUtm={setUtm}/>
          )}
        </div>

        {/* Canvas */}
        <div style={{ overflowY: 'auto', padding: '32px 24px' }}>
          <div style={{
            maxWidth: 600, margin: '0 auto', background: 'white',
            borderRadius: 10, boxShadow: 'var(--shadow-md)', padding: '40px 32px 24px', position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 20, borderBottom: '1px solid var(--hairline)', marginBottom: 24 }}>
              <div style={{ width: 24, height: 24, background: '#0B0E1E', borderRadius: 6, display: 'grid', placeItems: 'center' }}>
                <InfLogo size={14}/>
              </div>
              <div style={{ fontFamily: 'Syncopate', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em' }}>INFSTONES</div>
            </div>
            {blocks.map((b, i) => (
              <div key={b.id}
                draggable
                onDragStart={() => { dragIdx.current = i; }}
                onDragOver={e => { e.preventDefault(); setDropIdx(i); }}
                onDragEnd={() => {
                  if (dragIdx.current != null && dropIdx != null && dragIdx.current !== dropIdx) {
                    const nb = [...blocks];
                    const [m] = nb.splice(dragIdx.current, 1);
                    nb.splice(dropIdx, 0, m);
                    setBlocks(nb);
                  }
                  dragIdx.current = null; setDropIdx(null);
                }}
                onClick={() => setSelected(b.id)}
                style={{
                  position: 'relative', padding: 4, margin: '-4px -4px 0',
                  borderRadius: 4, cursor: 'pointer',
                  border: `2px solid ${selected === b.id ? 'var(--amber)' : 'transparent'}`,
                  transition: 'border-color 120ms',
                }}
                onMouseEnter={e => { if (selected !== b.id) e.currentTarget.style.borderColor = 'rgba(237,181,0,0.3)'; }}
                onMouseLeave={e => { if (selected !== b.id) e.currentTarget.style.borderColor = 'transparent'; }}
              >
                {dropIdx === i && dragIdx.current !== i && (
                  <div style={{ position: 'absolute', top: -2, left: 0, right: 0, height: 2, background: 'var(--amber)', borderRadius: 2 }}/>
                )}
                {selected === b.id && (
                  <div style={{
                    position: 'absolute', top: -14, left: -2,
                    background: 'var(--amber)', color: 'var(--ink)',
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: '4px 4px 0 0',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{b.type}</div>
                )}
                {selected === b.id && (
                  <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 4, zIndex: 2 }}>
                    <button className="icon-btn" style={{ width: 24, height: 24, background: 'var(--surface)', border: '1px solid var(--hairline)' }} onClick={e => { e.stopPropagation(); removeBlock(b.id); }}>
                      <Icon name="trash" size={11}/>
                    </button>
                    <button className="icon-btn" style={{ width: 24, height: 24, background: 'var(--surface)', border: '1px solid var(--hairline)' }}>
                      <Icon name="grip" size={11}/>
                    </button>
                  </div>
                )}
                {renderBlock(b, { utm })}
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {previewOpen && (
          <div style={{ borderLeft: '1px solid var(--hairline)', background: 'var(--surface)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: 10, borderBottom: '1px solid var(--hairline)', gap: 10 }}>
              <div className="segmented">
                <button className={previewTab === 'preview' ? 'active' : ''} onClick={() => setPreviewTab('preview')}>
                  <Icon name="eye" size={11}/> Preview
                </button>
                <button className={previewTab === 'links' ? 'active' : ''} onClick={() => setPreviewTab('links')}>
                  <Icon name="link" size={11}/> Links
                </button>
              </div>
              <div className="spacer"/>
              {previewTab === 'preview' && (
                <div className="segmented">
                  <button className={device === 'desktop' ? 'active' : ''} onClick={() => setDevice('desktop')}><Icon name="desktop" size={11}/></button>
                  <button className={device === 'mobile' ? 'active' : ''} onClick={() => setDevice('mobile')}><Icon name="mobile" size={11}/></button>
                </div>
              )}
            </div>
            {previewTab === 'preview' ? (
              <PreviewFrame blocks={blocks} utm={utm} device={device} subject={subject} fromName={fromName} fromEmail={fromEmail}/>
            ) : (
              <LinksAudit blocks={blocks} utm={utm}/>
            )}
          </div>
        )}
      </div>

      {testOpen && <TestSendModal onClose={() => setTestOpen(false)}/>}
    </div>
  );
};

const BlockSettings = ({ block, update, remove }) => {
  switch (block.type) {
    case 'heading':
    case 'heading2':
      return (
        <div className="field">
          <label className="field-label">Text</label>
          <textarea className="textarea" value={block.text} onChange={e => update({ text: e.target.value })}/>
        </div>
      );
    case 'text':
      return (
        <>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Text</label>
            <textarea className="textarea" rows="5" value={block.text} onChange={e => update({ text: e.target.value })}/>
            <div className="field-hint">Use {'{{'}name{'}}'} for personalization</div>
          </div>
          <div className="hstack" style={{ justifyContent: 'space-between' }}>
            <label className="field-label">Muted style</label>
            <div className={`switch ${block.small ? 'on' : ''}`} onClick={() => update({ small: !block.small })}/>
          </div>
        </>
      );
    case 'button':
      return (
        <>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Label</label>
            <input className="input" value={block.text} onChange={e => update({ text: e.target.value })}/>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">URL</label>
            <input className="input" value={block.url} onChange={e => update({ url: e.target.value })}/>
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {['primary', 'outlined', 'text'].map(s => (
                <button key={s} onClick={() => update({ style: s })} className="btn btn-sm" style={{
                  background: block.style === s ? 'var(--ink)' : 'var(--surface)',
                  color: block.style === s ? 'white' : 'var(--ink-2)',
                  borderColor: 'var(--hairline-strong)',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Corner radius</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {[0, 4, 8, 20].map(r => (
                <button key={r} onClick={() => update({ radius: r })} className="btn btn-sm" style={{
                  background: (block.radius || 8) === r ? 'var(--ink)' : 'var(--surface)',
                  color: (block.radius || 8) === r ? 'white' : 'var(--ink-2)',
                  borderColor: 'var(--hairline-strong)',
                }}>{r}px</button>
              ))}
            </div>
          </div>
        </>
      );
    case 'divider':
      return (
        <>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Line style</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              {['solid', 'dashed', 'dotted'].map(s => (
                <button key={s} onClick={() => update({ lineStyle: s })} className="btn btn-sm" style={{
                  background: (block.lineStyle || 'solid') === s ? 'var(--ink)' : 'var(--surface)',
                  color: (block.lineStyle || 'solid') === s ? 'white' : 'var(--ink-2)',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="field-label">Thickness: {block.thickness || 1}px</label>
            <input type="range" min="1" max="3" value={block.thickness || 1} onChange={e => update({ thickness: +e.target.value })}/>
          </div>
        </>
      );
    case 'social':
      return (
        <div className="field">
          <label className="field-label">Platforms</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
            {['twitter', 'linkedin', 'discord', 'github', 'telegram', 'youtube'].map(p => {
              const on = (block.platforms || []).includes(p);
              return (
                <button key={p} onClick={() => update({ platforms: on ? block.platforms.filter(x => x !== p) : [...(block.platforms || []), p] })}
                  className="btn btn-sm" style={{
                    background: on ? 'var(--ink)' : 'var(--surface)',
                    color: on ? 'white' : 'var(--ink-2)',
                    justifyContent: 'flex-start',
                  }}>
                  <Icon name={on ? 'check' : 'plus'} size={11}/> {p}
                </button>
              );
            })}
          </div>
        </div>
      );
    case 'image':
      return (
        <>
          <div className="field" style={{ marginBottom: 12 }}>
            <label className="field-label">Alt text</label>
            <input className="input" value={block.alt || ''} onChange={e => update({ alt: e.target.value })}/>
          </div>
          <div className="field">
            <label className="field-label">Caption</label>
            <input className="input" value={block.caption || ''} onChange={e => update({ caption: e.target.value })}/>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 12, width: '100%' }}><Icon name="upload" size={12}/> Upload image</button>
        </>
      );
    default:
      return <div className="muted" style={{ fontSize: 12 }}>No settings for this block.</div>;
  }
};

const UtmPanel = ({ utm, setUtm }) => (
  <div style={{ padding: 16 }}>
    <div style={{ marginBottom: 14, padding: 12, background: 'var(--amber-tint)', borderRadius: 8, border: '1px solid var(--amber-soft)', fontSize: 12, color: 'var(--ink-2)' }}>
      <div className="hstack" style={{ gap: 6, marginBottom: 4, fontWeight: 600 }}>
        <Icon name="info" size={12} style={{ color: 'var(--amber-active)' }}/> UTM parameters
      </div>
      These are auto-appended to every external link when this campaign sends.
    </div>
    {[
      ['utm_source', 'Source', 'e.g. newsletter'],
      ['utm_medium', 'Medium', 'e.g. email'],
      ['utm_campaign', 'Campaign', 'e.g. q2-restaking'],
      ['utm_term', 'Term (optional)', ''],
      ['utm_content', 'Content (optional)', ''],
    ].map(([k, l, ph]) => (
      <div className="field" key={k} style={{ marginBottom: 12 }}>
        <label className="field-label"><span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{k}</span></label>
        <input className="input" value={utm[k]} placeholder={ph} onChange={e => setUtm(u => ({ ...u, [k]: e.target.value }))}/>
      </div>
    ))}
    <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>
      <Icon name="refresh" size={11}/> Reset to workspace defaults
    </button>
  </div>
);

const PreviewFrame = ({ blocks, utm, device, subject, fromName, fromEmail }) => {
  const w = device === 'mobile' ? 375 : 600;
  const [hoverUrl, setHoverUrl] = useState(null);
  return (
    <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-sunken)', padding: 20, position: 'relative' }}
      onMouseMove={e => {
        const a = e.target.closest('a[data-preview-url]');
        if (a) setHoverUrl({ url: a.getAttribute('data-preview-url'), x: e.clientX, y: e.clientY });
        else setHoverUrl(null);
      }}>
      {/* Inbox header */}
      <div style={{ width: w, margin: '0 auto 12px', padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 8, fontSize: 11 }}>
        <div className="hstack" style={{ gap: 6 }}>
          <span className="muted">From</span>
          <span style={{ fontWeight: 600 }}>{fromName}</span>
          <span className="muted">&lt;{fromEmail}&gt;</span>
        </div>
        <div className="hstack" style={{ gap: 6, marginTop: 2 }}>
          <span className="muted">Subject</span>
          <span style={{ fontWeight: 600 }}>{subject}</span>
        </div>
      </div>
      {device === 'mobile' ? (
        <div style={{
          width: 395, margin: '0 auto', padding: '44px 10px 28px',
          background: '#0B0E1E', borderRadius: 36, boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', width: 80, height: 22, background: '#000', borderRadius: 20 }}/>
          <div style={{ background: 'white', borderRadius: 22, overflow: 'hidden' }}>
            <EmailCanvas blocks={blocks} opts={{ utm }} width={375}/>
          </div>
        </div>
      ) : (
        <EmailCanvas blocks={blocks} opts={{ utm }} width={600}/>
      )}
      {hoverUrl && (
        <div style={{
          position: 'fixed', left: hoverUrl.x + 12, top: hoverUrl.y + 12,
          background: 'var(--ink)', color: 'white', padding: '8px 12px',
          borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
          maxWidth: 420, wordBreak: 'break-all', pointerEvents: 'none',
          boxShadow: 'var(--shadow-lg)', zIndex: 500,
        }}>
          <div style={{ color: 'var(--amber)', fontSize: 10, marginBottom: 4, fontFamily: 'var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Full URL with UTM</div>
          {hoverUrl.url}
        </div>
      )}
    </div>
  );
};

const LinksAudit = ({ blocks, utm }) => {
  const { toast } = useApp();
  const links = [];
  blocks.forEach(b => {
    if (b.type === 'button' && b.url) links.push({ label: b.text, url: b.url });
    if (b.type === 'social') (b.platforms || []).forEach(p => links.push({ label: `${p} profile`, url: `https://${p}.com/infstones` }));
  });
  const appendUtm = (url) => {
    if (!url || url.startsWith('mailto:') || url.startsWith('#')) return url;
    const params = Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    if (!params) return url;
    return url + (url.includes('?') ? '&' : '?') + params;
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
      <div className="sb-section-title" style={{ padding: '0 0 8px' }}>{links.length} external links</div>
      {links.length === 0 ? (
        <div className="empty" style={{ padding: 32 }}>
          <Icon name="link" size={24}/>
          <h3>No links yet</h3>
          <p>Add Button or Social blocks to track clicks.</p>
        </div>
      ) : (
        <div className="vstack" style={{ gap: 10 }}>
          {links.map((l, i) => {
            const full = appendUtm(l.url);
            return (
              <div key={i} style={{ border: '1px solid var(--hairline)', borderRadius: 8, padding: 12, background: 'var(--surface-2)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{l.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', wordBreak: 'break-all', lineHeight: 1.5, marginBottom: 8 }}>
                  <span style={{ color: 'var(--ink-2)' }}>{l.url}</span>
                  <span style={{ color: 'var(--amber-active)' }}>{full.slice(l.url.length)}</span>
                </div>
                <div className="hstack" style={{ gap: 6 }}>
                  <button className="btn btn-ghost btn-sm" style={{ height: 26, padding: '0 8px', fontSize: 11 }}
                    onClick={() => { navigator.clipboard.writeText(full); toast('Link copied', 'success'); }}>
                    <Icon name="copy" size={11}/> Copy
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>
                    <Icon name="external" size={11}/> Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TestSendModal = ({ onClose }) => {
  const { toast, currentUser } = useApp();
  const [emails, setEmails] = useState(() => JSON.parse(localStorage.getItem('ifs_test_emails') || 'null') || [currentUser.email]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const add = (val) => {
    const v = val.trim();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast('Invalid email', 'error'); return; }
    if (emails.length >= 5) { toast('Max 5 addresses', 'error'); return; }
    if (emails.includes(v)) return;
    setEmails([...emails, v]);
    setInput('');
  };

  const send = () => {
    if (emails.length === 0) return;
    setSending(true);
    localStorage.setItem('ifs_test_emails', JSON.stringify(emails));
    setTimeout(() => {
      toast(`Test sent to ${emails.length} address${emails.length > 1 ? 'es' : ''}`, 'success');
      setSending(false);
      onClose();
    }, 1100);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hd">
          <h2>Send test email</h2>
          <p>Test sends are prefixed with [TEST] and don't affect analytics. Max 5 recipients per send.</p>
        </div>
        <div className="modal-bd">
          <div className="field">
            <label className="field-label">Recipients</label>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6,
              padding: 8, border: '1px solid var(--hairline-strong)', borderRadius: 8,
              minHeight: 42, background: 'var(--surface)',
            }}>
              {emails.map((e, i) => (
                <span key={e} className="chip" style={{ background: 'var(--bg-sunken)' }}>
                  {e}
                  <Icon name="x" size={10} style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setEmails(emails.filter((_, j) => j !== i))}/>
                </span>
              ))}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }}}
                onBlur={() => input && add(input)}
                style={{ border: 'none', outline: 'none', flex: 1, minWidth: 180, padding: '4px 6px', fontSize: 13 }}
                placeholder={emails.length === 0 ? "test@example.com" : "Add another…"}
              />
            </div>
            <div className="field-hint">Press Enter or comma to add</div>
          </div>
          <div style={{ marginTop: 14, padding: 10, background: 'var(--bg-sunken)', borderRadius: 6, fontSize: 12, color: 'var(--muted)' }}>
            <Icon name="info" size={12} style={{ marginRight: 6, verticalAlign: '-2px' }}/>
            Variables like {'{{'}name{'}}'} are replaced with sample values (John Doe).
          </div>
        </div>
        <div className="modal-ft">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-amber" onClick={send} disabled={sending || emails.length === 0}>
            {sending ? <><span className="spinner"/> Sending…</> : <><Icon name="send" size={13}/> Send test</>}
          </button>
        </div>
      </div>
    </div>
  );
};

window.CampaignEditor = CampaignEditor;
window.EmailCanvas = EmailCanvas;
