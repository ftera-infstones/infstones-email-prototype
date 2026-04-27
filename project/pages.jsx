// Remaining pages: Templates, Subscribers, Segments, Settings, Migration, Login

// ============ Template Gallery ============
const TemplateThumb = ({ t }) => {
  const [bg, fg] = t.palette;
  return (
    <div style={{
      aspectRatio: '0.78', background: '#FAFAF7',
      border: '1px solid var(--hairline)', borderRadius: 6,
      padding: 10, overflow: 'hidden', position: 'relative',
    }}>
      {/* Header bar */}
      <div style={{ width: '100%', height: 14, background: bg, borderRadius: 2, marginBottom: 8 }}/>
      {t.style === 'hero' && <div style={{ height: 48, background: bg, borderRadius: 3, marginBottom: 6 }}/>}
      {t.style === 'bold' && (
        <div style={{ height: 56, background: bg, color: fg, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6, borderRadius: 3 }}>PROMO</div>
      )}
      {t.style === 'magazine' && (
        <>
          <div style={{ height: 4, background: bg, width: '60%', marginBottom: 4 }}/>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
          <div style={{ height: 3, background: '#D9D7CF', width: '80%', marginBottom: 8 }}/>
          <div style={{ height: 38, background: '#E8E5DC', borderRadius: 2, marginBottom: 6 }}/>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
          <div style={{ height: 3, background: '#D9D7CF', width: '70%' }}/>
        </>
      )}
      {t.style === 'minimal' && (
        <>
          <div style={{ height: 4, background: '#0B0E1E', width: '40%', marginBottom: 8 }}/>
          {[1,2,3,4,5].map(i => <div key={i} style={{ height: 3, background: '#D9D7CF', marginBottom: 3, width: `${80 + (i%3)*5}%` }}/>)}
          <div style={{ height: 10, background: bg, width: 40, borderRadius: 2, marginTop: 8 }}/>
        </>
      )}
      {(t.style === 'changelog' || t.style === 'formal') && (
        <>
          <div style={{ height: 4, background: '#0B0E1E', width: '70%', marginBottom: 6 }}/>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
          <div style={{ height: 3, background: '#D9D7CF', width: '90%', marginBottom: 6 }}/>
          <div style={{ padding: 4, borderLeft: `2px solid ${bg}`, marginBottom: 4 }}>
            <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
            <div style={{ height: 3, background: '#D9D7CF', width: '70%' }}/>
          </div>
          <div style={{ padding: 4, borderLeft: `2px solid ${bg}` }}>
            <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2 }}/>
            <div style={{ height: 3, background: '#D9D7CF', width: '60%' }}/>
          </div>
        </>
      )}
      {t.style === 'invite' && (
        <>
          <div style={{ height: 56, background: bg, borderRadius: 3, marginBottom: 8, display: 'grid', placeItems: 'center', color: fg, fontSize: 16, fontWeight: 700 }}>28</div>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 2, width: '80%' }}/>
          <div style={{ height: 3, background: '#D9D7CF', marginBottom: 6, width: '60%' }}/>
          <div style={{ height: 10, background: bg, width: 50, borderRadius: 2 }}/>
        </>
      )}
    </div>
  );
};

const TemplateGallery = () => {
  const { openEditor, setRoute, toast } = useApp();
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const { templates } = SAMPLE_DATA;
  const cats = ['all', ...new Set(templates.map(t => t.category))];
  const filtered = templates.filter(t => (cat === 'all' || t.category === cat) && (!q || t.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="page-inner wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-subtitle">Start from a professional layout or save your own.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => openEditor('blank')}>Start from blank</button>
          <button className="btn btn-amber" onClick={() => openEditor('blank')}><Icon name="plus" size={14}/> New campaign</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}/>
          <input className="input" placeholder="Search templates…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32, height: 34, paddingTop: 0, paddingBottom: 0, fontSize: 12 }}/>
        </div>
        <div className="segmented" style={{ gridColumn: 'span 3', justifySelf: 'start' }}>
          {cats.map(c => <button key={c} className={cat === c ? 'active' : ''} onClick={() => setCat(c)}>{c === 'all' ? 'All' : c}</button>)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {filtered.map(t => (
          <div key={t.id} className="card" style={{ padding: 14, cursor: 'pointer', transition: 'transform 120ms, box-shadow 120ms' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-xs)'; }}
            onClick={() => { openEditor(t.id); toast(`Loaded "${t.name}"`, 'success'); }}
          >
            <TemplateThumb t={t}/>
            <div style={{ paddingTop: 12 }}>
              <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                {!t.preset && <span className="badge" style={{ background: 'var(--amber-tint)', color: 'var(--amber-active)' }}>Custom</span>}
              </div>
              <div className="muted" style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>{t.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Subscribers ============
const Subscribers = () => {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const { subscribers } = SAMPLE_DATA;
  const filtered = subscribers.filter(s => (status === 'all' || s.status === status) && (!q || s.email.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="page-inner wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscribers</h1>
          <p className="page-subtitle">10,114 active · 43 unsubscribed</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary"><Icon name="upload" size={14}/> Import CSV</button>
          <button className="btn btn-secondary"><Icon name="download" size={14}/> Export</button>
          <button className="btn btn-amber"><Icon name="plus" size={14}/> Add subscriber</button>
        </div>
      </div>

      <div className="hstack" style={{ marginBottom: 14, gap: 12 }}>
        <div style={{ position: 'relative', width: 320 }}>
          <Icon name="search" size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}/>
          <input className="input" placeholder="Search by email, name, org…" value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 32 }}/>
        </div>
        <div className="segmented">
          <button className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>All</button>
          <button className={status === 'active' ? 'active' : ''} onClick={() => setStatus('active')}>Active</button>
          <button className={status === 'unsubscribed' ? 'active' : ''} onClick={() => setStatus('unsubscribed')}>Unsubscribed</button>
        </div>
        <div className="spacer"/>
        <span className="muted mono" style={{ fontSize: 12 }}>{filtered.length} results</span>
      </div>

      <div className="card">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 28 }}><input type="checkbox"/></th>
              <th>Contact</th>
              <th>Organization</th>
              <th>Segment</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.email}>
                <td onClick={e => e.stopPropagation()}><input type="checkbox"/></td>
                <td>
                  <div className="hstack" style={{ gap: 10 }}>
                    <div className="sb-avatar" style={{ background: 'var(--bg-sunken)', color: 'var(--ink-2)', border: '1px solid var(--hairline)' }}>
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.name}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>{s.email}</div>
                    </div>
                  </div>
                </td>
                <td>{s.org}</td>
                <td><span className="chip">{s.segment}</span></td>
                <td>
                  {s.status === 'active'
                    ? <span className="badge sent"><span className="badge-dot"/>Active</span>
                    : <span className="badge unsubscribed"><span className="badge-dot"/>Unsubscribed</span>}
                </td>
                <td className="muted mono" style={{ fontSize: 12 }}>{s.joined}</td>
                <td><button className="icon-btn" style={{ width: 26, height: 26 }}><Icon name="more" size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============ Segments ============
const Segments = () => {
  const { segments } = SAMPLE_DATA;
  return (
    <div className="page-inner wide">
      <div className="page-header">
        <div>
          <h1 className="page-title">Segments</h1>
          <p className="page-subtitle">Target campaigns to specific groups of subscribers.</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-amber"><Icon name="plus" size={14}/> New segment</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {segments.map(s => (
          <div key={s.id} className="card" style={{ padding: 20, cursor: 'pointer' }}>
            <div className="hstack" style={{ marginBottom: 10, justifyContent: 'space-between' }}>
              <Icon name="tag" size={16} style={{ color: 'var(--amber-active)' }}/>
              {s.isSmart && <span className="badge" style={{ background: 'var(--amber-tint)', color: 'var(--amber-active)' }}><Icon name="zap" size={10}/> Smart</span>}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
            <div className="muted" style={{ fontSize: 12, marginBottom: 14, minHeight: 34 }}>{s.description}</div>
            <div className="hstack" style={{ justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--hairline)' }}>
              <span className="tabnum mono" style={{ fontSize: 18, fontWeight: 700 }}>{s.count.toLocaleString()}</span>
              <span className="muted" style={{ fontSize: 11 }}>contacts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ Settings ============
const Settings = () => {
  const [section, setSection] = useState('branding');
  const sections = [
    { key: 'branding', label: 'Branding', icon: 'palette' },
    { key: 'sending', label: 'Sending domain', icon: 'globe' },
    { key: 'utm', label: 'Default UTM', icon: 'link' },
    { key: 'users', label: 'Users', icon: 'users', adminOnly: true },
  ];
  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Workspace-level configuration.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28 }}>
        <nav className="vstack settings-nav" style={{ gap: 2 }}>
          {sections.map(s => (
            <div key={s.key} className={`sb-item ${section === s.key ? 'active' : ''}`} onClick={() => setSection(s.key)}>
              <Icon name={s.icon}/>{s.label}
              {s.adminOnly && <span className="sb-count">Admin</span>}
            </div>
          ))}
        </nav>
        <div>
          {section === 'branding' && <BrandingSettings/>}
          {section === 'sending' && <SendingSettings/>}
          {section === 'utm' && <UtmDefaults/>}
          {section === 'users' && <UsersSettings/>}
        </div>
      </div>
    </div>
  );
};

const BrandingSettings = () => (
  <div className="vstack" style={{ gap: 20 }}>
    <div className="card">
      <div className="card-hd"><h3>Logo & identity</h3></div>
      <div className="card-pad vstack" style={{ gap: 16 }}>
        <div className="hstack" style={{ gap: 16 }}>
          <div style={{ width: 96, height: 96, background: '#0B0E1E', borderRadius: 'var(--r-md)', display: 'grid', placeItems: 'center' }}>
            <InfLogo size={40}/>
          </div>
          <div className="vstack" style={{ gap: 8, flex: 1 }}>
            <div className="field-label">Dashboard logo</div>
            <div className="field-hint">Shown in the top-left and browser tab. SVG preferred.</div>
            <div className="hstack" style={{ gap: 6 }}>
              <button className="btn btn-secondary btn-sm"><Icon name="upload" size={12}/> Upload</button>
              <button className="btn btn-ghost btn-sm">Use default</button>
            </div>
          </div>
        </div>
        <hr className="hr"/>
        <div className="field">
          <label className="field-label">Product name (browser tab)</label>
          <input className="input" defaultValue="InfStones Email Marketing"/>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-hd"><h3>Brand color</h3></div>
      <div className="card-pad">
        <div className="hstack" style={{ gap: 10, flexWrap: 'wrap' }}>
          {['#EDB500', '#0B0E1E', '#227AFF', '#0F9D58', '#D64545', '#4F46E5'].map(c => (
            <button key={c} style={{
              width: 44, height: 44, background: c, borderRadius: 10,
              border: c === '#EDB500' ? '2px solid var(--ink)' : '1px solid var(--hairline)',
              cursor: 'pointer', position: 'relative',
            }}>
              {c === '#EDB500' && <Icon name="check" size={14} style={{ color: 'var(--ink)', position: 'absolute', top: 14, left: 14 }}/>}
            </button>
          ))}
          <input className="input mono" style={{ width: 120 }} defaultValue="#EDB500"/>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-hd"><h3>Email footer</h3></div>
      <div className="card-pad vstack" style={{ gap: 12 }}>
        <div className="field">
          <label className="field-label">Company name</label>
          <input className="input" defaultValue="InfStones, Inc."/>
        </div>
        <div className="field">
          <label className="field-label">Physical address <span className="req">*</span></label>
          <textarea className="textarea" defaultValue="355 Bryant St., San Francisco, CA 94107, USA"/>
          <div className="field-hint">Required by CAN-SPAM and GDPR.</div>
        </div>
        <div className="field">
          <label className="field-label">Additional footer text</label>
          <textarea className="textarea" rows="3" placeholder="Optional — shown above the unsubscribe link."/>
        </div>
      </div>
    </div>
  </div>
);

const SendingSettings = () => (
  <div className="card">
    <div className="card-hd"><h3>Sending domain</h3></div>
    <div className="card-pad vstack" style={{ gap: 14 }}>
      <div className="hstack" style={{ justifyContent: 'space-between', padding: 14, background: 'var(--green-soft)', border: '1px solid rgba(15,157,88,0.2)', borderRadius: 8 }}>
        <div>
          <div className="hstack" style={{ gap: 8, marginBottom: 2 }}>
            <Icon name="shield" size={14} style={{ color: 'var(--green)' }}/>
            <span style={{ fontWeight: 600, fontSize: 13 }}>mail.infstones.com</span>
            <span className="badge sent"><span className="badge-dot"/>Verified</span>
          </div>
          <div className="muted mono" style={{ fontSize: 11 }}>DKIM ✓ · SPF ✓ · DMARC ✓ · via AWS SES (us-east-1)</div>
        </div>
        <button className="btn btn-ghost btn-sm">Re-verify</button>
      </div>
      <div className="field">
        <label className="field-label">Default from name</label>
        <input className="input" defaultValue="InfStones Team"/>
      </div>
      <div className="field">
        <label className="field-label">Default from address</label>
        <input className="input" defaultValue="hello@mail.infstones.com"/>
      </div>
      <div className="field">
        <label className="field-label">Reply-to</label>
        <input className="input" defaultValue="team@infstones.com"/>
      </div>
    </div>
  </div>
);

const UtmDefaults = () => (
  <div className="card">
    <div className="card-hd"><h3>Workspace UTM defaults</h3></div>
    <div className="card-pad vstack" style={{ gap: 12 }}>
      <div className="field-hint">These apply to every new campaign. Individual campaigns can override.</div>
      {[['utm_source', 'newsletter'], ['utm_medium', 'email'], ['utm_campaign', '{{campaign_slug}}']].map(([k, v]) => (
        <div className="field" key={k}>
          <label className="field-label mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{k}</label>
          <input className="input" defaultValue={v}/>
        </div>
      ))}
    </div>
  </div>
);

const UsersSettings = () => {
  const { users, addUser, removeUser, changeRole, currentUser } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [openRoleId, setOpenRoleId] = useState(null);

  React.useEffect(() => {
    if (openRoleId == null) return;
    const close = () => setOpenRoleId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [openRoleId]);

  return (
    <div className="card">
      <div className="card-hd">
        <div>
          <h3>Users</h3>
          <div className="sub">Only admins can see this page. Sign-in is via Google Workspace (@infstones.com).</div>
        </div>
        <button className="btn btn-amber btn-sm" style={{ borderRadius: 'var(--r-sm)' }} onClick={() => setAddOpen(true)}><Icon name="plus" size={12}/> Add user</button>
      </div>
      <table className="tbl">
        <thead><tr><th>User</th><th>Role</th><th>Last active</th><th style={{ width: 100, textAlign: 'right' }}>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <div className="hstack" style={{ gap: 10 }}>
                  <div className="sb-avatar">{u.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{u.name} {u.current && <span className="chip" style={{ marginLeft: 4 }}>You</span>}</div>
                    <div className="muted mono" style={{ fontSize: 11 }}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td>
                {u.current ? (
                  <span className={`badge ${u.role}`}>{u.role}</span>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block' }} onClick={e => e.stopPropagation()}>
                    <button
                      className="select role-select-trigger"
                      style={{
                        width: 120, height: 28, padding: '0 26px 0 10px', fontSize: 12,
                        textAlign: 'left', cursor: 'pointer', background: 'var(--surface)',
                        textTransform: 'capitalize',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                      }}
                      onClick={() => setOpenRoleId(openRoleId === u.id ? null : u.id)}
                    >
                      {u.role}
                    </button>
                    {openRoleId === u.id && (
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 4px)', left: 0, width: 120,
                        background: 'var(--surface)', border: '1px solid var(--hairline-strong)',
                        borderRadius: 'var(--r-sm)', boxShadow: '0 6px 16px rgba(11,14,30,0.10)',
                        zIndex: 20, overflow: 'hidden',
                      }}>
                        {['admin', 'member'].map(r => (
                          <div key={r}
                            onClick={() => { changeRole(u.id, r); setOpenRoleId(null); }}
                            style={{
                              padding: '8px 10px', fontSize: 12, cursor: 'pointer', textTransform: 'capitalize',
                              background: u.role === r ? 'var(--bg-sunken)' : 'transparent',
                              fontWeight: u.role === r ? 600 : 400,
                            }}
                            onMouseEnter={e => { if (u.role !== r) e.currentTarget.style.background = 'var(--bg-sunken)'; }}
                            onMouseLeave={e => { if (u.role !== r) e.currentTarget.style.background = 'transparent'; }}
                          >
                            {r}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className="muted" style={{ fontSize: 12 }}>{u.last}</td>
              <td style={{ textAlign: 'right' }}>
                <button className="btn btn-danger btn-sm" style={{ borderRadius: 'var(--r-sm)' }} disabled={u.current} onClick={() => removeUser(u.id)} title={u.current ? "Can't remove yourself" : 'Remove'}>
                  <Icon name="trash" size={11}/> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {addOpen && (
        <div className="modal-overlay" onClick={() => setAddOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-hd">
              <h2>Add user</h2>
              <p>They'll be able to sign in with their @infstones.com Google account.</p>
            </div>
            <div className="modal-bd vstack" style={{ gap: 12 }}>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" placeholder="name@infstones.com" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="field">
                <label className="field-label">Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {['member', 'admin'].map(r => (
                    <button key={r} onClick={() => setRole(r)} className="btn" style={{
                      flexDirection: 'column', height: 'auto', padding: '10px 12px',
                      background: role === r ? 'var(--ink)' : 'var(--surface)',
                      color: role === r ? 'white' : 'var(--ink)',
                      borderColor: 'var(--hairline-strong)',
                      alignItems: 'flex-start',
                    }}>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{r}</span>
                      <span style={{ fontSize: 11, opacity: 0.7, fontWeight: 400, marginTop: 2 }}>
                        {r === 'admin' ? 'Full access + user management' : 'All features except user management'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
              <button className="btn btn-amber" onClick={() => {
                if (!email.endsWith('@infstones.com')) { window.__toast('Only @infstones.com accounts', 'error'); return; }
                addUser({ email, role });
                setAddOpen(false); setEmail('');
              }}>Add user</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ Migration ============
const Migration = () => {
  const [step, setStep] = useState(1);
  const [dryRun, setDryRun] = useState(true);
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);

  const run = () => {
    setImporting(true);
    setTimeout(() => { setImporting(false); setDone(true); setStep(3); }, 1800);
  };

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data migration</h1>
          <p className="page-subtitle">Import your MailerLite subscribers, groups, and unsubscribe list.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-pad">
          <div className="hstack" style={{ gap: 4, marginBottom: 20 }}>
            {['Upload CSV', 'Field mapping', 'Review & import'].map((l, i) => (
              <div key={i} className="hstack" style={{ gap: 8, flex: 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: step > i ? 'var(--green)' : step === i + 1 ? 'var(--ink)' : 'var(--bg-sunken)',
                  color: step >= i + 1 ? 'white' : 'var(--muted)',
                  fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', flexShrink: 0,
                }}>
                  {step > i + 1 ? <Icon name="check" size={12} style={{ color: 'white' }}/> : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 600 : 400, color: step >= i + 1 ? 'var(--ink)' : 'var(--muted)' }}>{l}</span>
                {i < 2 && <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div style={{ border: '2px dashed var(--hairline-strong)', borderRadius: 10, padding: 40, textAlign: 'center', background: 'var(--surface-2)' }}>
                <Icon name="upload" size={28} style={{ color: 'var(--muted)', marginBottom: 8 }}/>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Drop your MailerLite CSV export here</div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 16 }}>Or click to browse · up to 100MB</div>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Choose file</button>
              </div>
              <div style={{ marginTop: 20, padding: 14, background: 'var(--amber-tint)', border: '1px solid var(--amber-soft)', borderRadius: 8, fontSize: 12 }}>
                <Icon name="info" size={12} style={{ marginRight: 6, verticalAlign: '-2px' }}/>
                <strong>Before you start:</strong> In MailerLite, export Subscribers, Groups, and Unsubscribes as separate CSVs. Upload all three.
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ padding: 12, background: 'var(--bg-sunken)', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <div className="hstack" style={{ gap: 8 }}>
                    <Icon name="database" size={14}/>
                    <span style={{ fontWeight: 600 }}>mailerlite-subscribers-export-2026-04-20.csv</span>
                  </div>
                  <span className="muted mono" style={{ fontSize: 11 }}>10,157 rows · 2.4 MB</span>
                </div>
              </div>
              <div className="sb-section-title" style={{ padding: '0 0 8px' }}>Field mapping</div>
              <div style={{ border: '1px solid var(--hairline)', borderRadius: 8, overflow: 'hidden' }}>
                {[
                  ['email', 'email', 'required'],
                  ['name', 'metadata.name', 'mapped'],
                  ['company', 'metadata.org', 'mapped'],
                  ['signup_date', 'joined_at', 'mapped'],
                  ['custom_field_1', '—', 'skipped'],
                  ['groups[]', 'segments[]', 'mapped'],
                  ['unsubscribed', 'unsubscribed', 'mapped'],
                ].map(([from, to, status], i) => (
                  <div key={i} className="hstack" style={{
                    padding: '10px 14px', borderTop: i > 0 ? '1px solid var(--hairline)' : 'none',
                    fontSize: 13,
                  }}>
                    <span className="mono" style={{ flex: 1, color: 'var(--muted)' }}>{from}</span>
                    <Icon name="arrowRight" size={12} style={{ color: 'var(--muted-2)', margin: '0 12px' }}/>
                    <span className="mono" style={{ flex: 1, color: 'var(--ink)', fontWeight: 500 }}>{to}</span>
                    <span className="badge" style={{
                      background: status === 'required' ? 'var(--red-soft)' : status === 'mapped' ? 'var(--green-soft)' : 'var(--bg-sunken)',
                      color: status === 'required' ? 'var(--red)' : status === 'mapped' ? 'var(--green)' : 'var(--muted)',
                    }}>{status}</span>
                  </div>
                ))}
              </div>
              <div className="hstack" style={{ marginTop: 20, justifyContent: 'space-between' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                <div className="hstack" style={{ gap: 10 }}>
                  <label className="hstack" style={{ gap: 8, fontSize: 13 }}>
                    <div className={`switch ${dryRun ? 'on' : ''}`} onClick={() => setDryRun(!dryRun)}/>
                    Dry run (validate without writing)
                  </label>
                  <button className="btn btn-amber" onClick={run} disabled={importing}>
                    {importing ? 'Importing…' : dryRun ? 'Validate' : 'Import'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && done && (
            <div>
              <div style={{ textAlign: 'center', padding: '24px 0 32px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--green)', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                  <Icon name="check" size={28}/>
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{dryRun ? 'Dry run successful' : 'Import complete'}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{dryRun ? 'Everything looks good. Toggle off dry run to write to the database.' : '10,114 contacts imported · 43 unsubscribes preserved'}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Contacts</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>10,114</div>
                </div>
                <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Segments</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>6</div>
                </div>
                <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Unsubscribes</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>43</div>
                </div>
                <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, textAlign: 'center' }}>
                  <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Duplicates</div>
                  <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>43</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ Login ============
const LoginPage = ({ onLogin }) => {
  const [picker, setPicker] = useState(false);
  const [err, setErr] = useState(null);
  const accounts = [
    { email: 'sam.chen@infstones.com', name: 'Sam Chen', avatar: 'SC', valid: true },
    { email: 'priya.r@infstones.com', name: 'Priya Reddy', avatar: 'PR', valid: true },
    { email: 'visitor@gmail.com', name: 'Personal account', avatar: 'V', valid: false, error: 'Only @infstones.com accounts are allowed' },
    { email: 'contractor@infstones.com', name: 'Not in users list', avatar: 'C', valid: false, error: 'No account found with this email address' },
  ];

  return (
    <div className="login-page">
      <div className="login-left">
        <div>
          <div className="hstack" style={{ gap: 10 }}>
            <div className="sb-logo" style={{ background: '#EDB500' }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 4L18 4L22 12L18 20L6 20L2 12L6 4Z" fill="none" stroke="#0B0E1E" strokeWidth="2"/><rect x="9" y="9" width="6" height="6" fill="#0B0E1E"/></svg>
            </div>
            <div style={{ fontFamily: 'Syncopate', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: 'white' }}>INFSTONES</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'white', marginBottom: 16, maxWidth: 420 }}>
            Email marketing, owned end‑to‑end.
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, maxWidth: 380 }}>
            Self-hosted campaigns for the InfStones validator, builder, and staker communities. Powered by AWS SES.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          <span>v0.9.0-beta</span>
          <span>SOC 2 Type II</span>
          <span>GDPR · CAN-SPAM</span>
        </div>
      </div>
      <div className="login-right">
        <div className="login-card">
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 6px' }}>Sign in to InfStones Email</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 32px' }}>Use your @infstones.com Google Workspace account.</p>
          <button className="google-btn" onClick={() => { setErr(null); setPicker(true); }}>
            <GoogleG size={18}/> Sign in with Google
          </button>
          {err && (
            <div style={{ marginTop: 16, padding: 12, background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 8, fontSize: 13, display: 'flex', gap: 8 }}>
              <Icon name="x" size={14}/> {err}
            </div>
          )}
          <div style={{ marginTop: 32, padding: 14, background: 'var(--bg-sunken)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            Having trouble? Ask a workspace admin to add your account at <span className="mono" style={{ color: 'var(--ink)' }}>Settings → Users</span>.
          </div>
        </div>
        {picker && (
          <div className="modal-overlay" onClick={() => setPicker(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
              <div className="modal-hd">
                <div className="hstack" style={{ gap: 8, marginBottom: 8 }}><GoogleG size={20}/><span style={{ fontSize: 12, color: 'var(--muted)' }}>Sign in with Google</span></div>
                <h2>Choose an account</h2>
                <p>to continue to <span className="mono">mail.infstones.com</span></p>
              </div>
              <div style={{ padding: 8 }}>
                {accounts.map(a => (
                  <div key={a.email} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px',
                    cursor: 'pointer', borderRadius: 8, transition: 'background 120ms',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunken)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    onClick={() => {
                      if (a.valid) { onLogin(a); setPicker(false); }
                      else { setErr(a.error); setPicker(false); }
                    }}
                  >
                    <div className="sb-avatar" style={{ background: a.valid ? 'linear-gradient(135deg, var(--amber), #CA9600)' : 'var(--bg-sunken)', color: a.valid ? 'var(--ink)' : 'var(--muted)' }}>{a.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>{a.email}</div>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--hairline)', marginTop: 4, padding: '10px 16px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center' }}>
                    <Icon name="plus" size={14}/>
                  </div>
                  Use another account
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

window.TemplateGallery = TemplateGallery;
window.Subscribers = Subscribers;
window.Segments = Segments;
window.Settings = Settings;
window.Migration = Migration;
window.LoginPage = LoginPage;
