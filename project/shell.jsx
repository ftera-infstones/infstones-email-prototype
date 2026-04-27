// App shell — sidebar, topbar, navigation
const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Fragment } = React;

const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

const NAV = [
  { section: 'Main' },
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'campaigns', label: 'Campaigns', icon: 'mail', count: 11 },
  { key: 'templates', label: 'Templates', icon: 'layers' },
  { section: 'Audience' },
  { key: 'subscribers', label: 'Subscribers', icon: 'users', count: '10.1K' },
  { key: 'segments', label: 'Segments', icon: 'tag' },
  { section: 'Workspace' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
  { key: 'migration', label: 'Data Migration', icon: 'database' },
];

const Sidebar = () => {
  const { route, setRoute, openCompose } = useApp();
  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <img src="assets/ifs-logo.svg" alt="InfStones" style={{ height: 14, width: 'auto', display: 'block' }}/>
        <div className="sb-product-tag">Email Marketing</div>
      </div>
      <button className="sb-compose" onClick={openCompose}>
        <Icon name="plus" size={14} /> New Campaign
        <kbd>C</kbd>
      </button>
      <nav className="sb-nav">
        {NAV.map((item, i) => item.section ? (
          <div key={i} className="sb-section-title">{item.section}</div>
        ) : (
          <div
            key={item.key}
            className={`sb-item ${route === item.key ? 'active' : ''}`}
            onClick={() => setRoute(item.key)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.count != null && <span className="sb-count">{item.count}</span>}
          </div>
        ))}
      </nav>
      <UserMenu />
    </aside>
  );
};

const UserMenu = () => {
  const { currentUser, logout } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
    <div className="sb-footer" ref={ref} style={{ position: 'relative' }}>
      <div className="sb-user" onClick={() => setOpen(o => !o)}>
        <div className="sb-avatar">{currentUser.avatar}</div>
        <div className="sb-user-info">
          <div className="sb-user-name">{currentUser.name}</div>
          <div className="sb-user-role">{currentUser.role}</div>
        </div>
        <Icon name="chevronDown" size={14} className="sb-user-chevron" />
      </div>
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 4px)', left: 12, right: 12,
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-pop)', padding: 6, zIndex: 100
        }}>
          <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--hairline)' }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{currentUser.email}</div>
          </div>
          <MenuItem icon="users" label="Account settings" onClick={() => setOpen(false)}/>
          <MenuItem icon="help" label="Help & docs" onClick={() => setOpen(false)}/>
          <div style={{ height: 1, background: 'var(--hairline)', margin: '4px 0' }}/>
          <MenuItem icon="logout" label="Sign out" onClick={() => { setOpen(false); logout(); }}/>
        </div>
      )}
    </div>
  );
};

const MenuItem = ({ icon, label, onClick, danger }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
    fontSize: 13, borderRadius: 6, cursor: 'pointer', color: danger ? 'var(--red)' : 'var(--ink-2)',
  }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sunken)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <Icon name={icon} size={14} /> {label}
  </div>
);

const Topbar = () => {
  const { route, pageTitle } = useApp();
  const crumb = NAV.find(n => n.key === route);
  return (
    <div className="topbar">
      <div className="crumbs">
        <span>Workspace</span>
        <span className="sep">/</span>
        <span className="current">{pageTitle || (crumb && crumb.label) || route}</span>
      </div>
      <div className="topbar-search">
        <Icon name="search" size={14}/>
        <input placeholder="Search campaigns, subscribers, templates…" />
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn" title="What's new"><Icon name="sparkle" size={15}/></button>
        <button className="icon-btn" title="Notifications"><Icon name="bell" size={15}/><span className="dot"/></button>
        <button className="icon-btn" title="Help"><Icon name="help" size={15}/></button>
      </div>
    </div>
  );
};

window.Sidebar = Sidebar;
window.Topbar = Topbar;
window.AppContext = AppContext;
window.useApp = useApp;
