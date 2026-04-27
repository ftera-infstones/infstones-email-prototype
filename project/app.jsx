// Main app: context provider, routing, toast, tweaks wiring
const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "accent": "#EDB500",
  "density": "comfortable",
  "sidebarStyle": "light",
  "fontStack": "inter",
  "showKpiTrend": true
}/*EDITMODE-END*/;

const FONT_STACKS = {
  inter: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  geist: `'Geist', -apple-system, BlinkMacSystemFont, sans-serif`,
  mono_display: `'JetBrains Mono', ui-monospace, monospace`,
};

const App = () => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ifs_user') || 'null'); } catch { return null; }
  });
  const [route, setRoute] = useState(() => localStorage.getItem('ifs_route') || 'dashboard');
  const [ctx, setCtx] = useState({}); // { campaignId, editorId }
  const [toasts, setToasts] = useState([]);
  const [tweaks, setTweaks] = useState(DEFAULT_TWEAKS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [users, setUsers] = useState(SAMPLE_DATA.users);

  useEffect(() => { localStorage.setItem('ifs_route', route); }, [route]);
  useEffect(() => {
    if (user) localStorage.setItem('ifs_user', JSON.stringify(user));
    else localStorage.removeItem('ifs_user');
  }, [user]);

  // Apply tweaks to CSS
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--amber', tweaks.accent);
    r.style.setProperty('--amber-hover', shade(tweaks.accent, -8));
    r.style.setProperty('--amber-active', shade(tweaks.accent, -14));
    r.style.setProperty('--font-sans', FONT_STACKS[tweaks.fontStack] || FONT_STACKS.inter);
    document.body.dataset.density = tweaks.density;
    document.body.dataset.sidebar = tweaks.sidebarStyle;
  }, [tweaks]);

  // Tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (key, value) => {
    setTweaks(t => {
      const next = { ...t, [key]: value };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
      return next;
    });
  };

  const toast = useCallback((message, tone = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  useEffect(() => { window.__toast = toast; }, [toast]);

  const currentUser = user || { name: 'Not signed in', email: '', role: 'guest', avatar: '?' };

  const api = {
    route, setRoute: (r) => { setRoute(r); setCtx({}); },
    ctx,
    currentUser,
    users,
    addUser: ({ email, role }) => {
      const name = email.split('@')[0].split('.').map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
      const avatar = name.split(' ').map(n => n[0]).join('').slice(0, 2);
      setUsers(us => [...us, { id: 'u' + Date.now(), name, email, role, avatar, last: 'Invitation pending' }]);
      toast(`Invitation sent to ${email}`, 'success');
    },
    removeUser: (id) => { setUsers(us => us.filter(u => u.id !== id)); toast('User removed', 'success'); },
    changeRole: (id, role) => { setUsers(us => us.map(u => u.id === id ? { ...u, role } : u)); toast('Role updated', 'success'); },
    openCampaign: (id) => { setCtx({ campaignId: id }); setRoute('campaign-detail'); },
    openEditor: (id) => { setCtx({ editorId: id }); setRoute('editor'); },
    openCompose: () => setRoute('templates'),
    logout: () => { setUser(null); setRoute('dashboard'); },
    toast,
  };

  // Login gate
  if (!user) {
    return (
      <>
        <LoginPage onLogin={(a) => {
          setUser({ name: a.name, email: a.email, role: a.email === 'sam.chen@infstones.com' ? 'admin' : 'member', avatar: a.avatar });
          toast(`Welcome back, ${a.name.split(' ')[0]}`, 'success');
        }}/>
        <ToastContainer toasts={toasts}/>
      </>
    );
  }

  const renderRoute = () => {
    switch (route) {
      case 'dashboard': return <Dashboard/>;
      case 'campaigns': return <CampaignsList/>;
      case 'campaign-detail': return <CampaignDetail id={ctx.campaignId}/>;
      case 'editor': return <CampaignEditor id={ctx.editorId}/>;
      case 'templates': return <TemplateGallery/>;
      case 'subscribers': return <Subscribers/>;
      case 'segments': return <Segments/>;
      case 'settings': return <Settings/>;
      case 'migration': return <Migration/>;
      default: return <Dashboard/>;
    }
  };

  const isFullBleed = route === 'editor';

  return (
    <AppContext.Provider value={api}>
      <div className="app">
        <Sidebar/>
        <div className="main">
          {!isFullBleed && <Topbar/>}
          <div className="page" style={isFullBleed ? { padding: 0 } : {}}>
            {renderRoute()}
          </div>
        </div>
      </div>
      {tweaksOpen && <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => setTweaksOpen(false)}/>}
      <ToastContainer toasts={toasts}/>
    </AppContext.Provider>
  );
};

// ========== Toasts ==========
const ToastContainer = ({ toasts }) => (
  <div style={{
    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: 8,
  }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: 'var(--ink)', color: 'white',
        padding: '10px 14px 10px 12px', borderRadius: 8,
        fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: 'var(--shadow-lg)', minWidth: 220, maxWidth: 380,
        animation: 'slideIn 180ms ease-out',
        borderLeft: `3px solid ${t.tone === 'success' ? 'var(--green)' : t.tone === 'error' ? 'var(--red)' : 'var(--amber)'}`,
      }}>
        <Icon name={t.tone === 'success' ? 'check' : t.tone === 'error' ? 'x' : 'info'} size={14}
          style={{ color: t.tone === 'success' ? 'var(--green)' : t.tone === 'error' ? 'var(--red)' : 'var(--amber)' }}/>
        {t.message}
      </div>
    ))}
  </div>
);

// ========== Tweaks ==========
const TweaksPanel = ({ tweaks, setTweak, onClose }) => (
  <div style={{
    position: 'fixed', bottom: 20, right: 20, zIndex: 800,
    width: 300, background: 'var(--surface)', border: '1px solid var(--hairline-strong)',
    borderRadius: 12, boxShadow: 'var(--shadow-lg)', padding: 0, overflow: 'hidden',
  }}>
    <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--hairline)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>Tweaks</div>
      <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={onClose}><Icon name="x" size={12}/></button>
    </div>
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <div className="field-label">Accent color</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#EDB500', '#227AFF', '#0F9D58', '#D64545', '#4F46E5', '#0B0E1E'].map(c => (
            <button key={c} onClick={() => setTweak('accent', c)} style={{
              width: 26, height: 26, borderRadius: 6, background: c,
              border: tweaks.accent === c ? '2px solid var(--ink)' : '1px solid var(--hairline-strong)',
              cursor: 'pointer', padding: 0,
            }}/>
          ))}
        </div>
      </div>
      <div>
        <div className="field-label">Density</div>
        <div className="segmented" style={{ width: '100%' }}>
          {['cozy', 'comfortable', 'compact'].map(d => (
            <button key={d} className={tweaks.density === d ? 'active' : ''} onClick={() => setTweak('density', d)} style={{ flex: 1 }}>{d}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="field-label">Sidebar</div>
        <div className="segmented" style={{ width: '100%' }}>
          {[['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => (
            <button key={k} className={tweaks.sidebarStyle === k ? 'active' : ''} onClick={() => setTweak('sidebarStyle', k)} style={{ flex: 1 }}>{l}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="field-label">Font</div>
        <div className="segmented" style={{ width: '100%' }}>
          {[['inter', 'Inter'], ['geist', 'Geist']].map(([k, l]) => (
            <button key={k} className={tweaks.fontStack === k ? 'active' : ''} onClick={() => setTweak('fontStack', k)} style={{ flex: 1 }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="field-label" style={{ marginBottom: 0 }}>Dashboard trend line</div>
        <div className={`switch ${tweaks.showKpiTrend ? 'on' : ''}`} onClick={() => setTweak('showKpiTrend', !tweaks.showKpiTrend)}/>
      </div>
    </div>
  </div>
);

// Shade helper
function shade(hex, percent) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = Math.max(0, Math.min(255, parseInt(c.slice(0, 2), 16) + percent * 2.55));
  const g = Math.max(0, Math.min(255, parseInt(c.slice(2, 4), 16) + percent * 2.55));
  const b = Math.max(0, Math.min(255, parseInt(c.slice(4, 6), 16) + percent * 2.55));
  return '#' + [r, g, b].map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
