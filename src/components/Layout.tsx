import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  FileText,
  Users,
  FolderOpen,
  Settings as SettingsIcon,
  Plus,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { mockCampaigns, mockSubscribers } from "../mock/data";
import { useRole } from "../context/RoleContext";

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  count?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const crumbFor: Record<string, string> = {
  dashboard: "Dashboard",
  campaigns: "Campaigns",
  "campaigns/new": "New Campaign",
  subscribers: "Subscribers",
  groups: "Groups",
  templates: "Templates",
  "templates/new": "New Template",
  settings: "Settings",
};

function currentCrumb(pathname: string) {
  const clean = pathname.replace(/^\//, "");
  if (crumbFor[clean]) return crumbFor[clean];
  const parts = clean.split("/");
  if (parts[0] === "campaigns" && parts[2] === "report") return "Campaign Report";
  if (parts[0] === "campaigns" && parts[2] === "edit") return "Edit Campaign";
  if (parts[0] === "templates" && parts[2] === "edit") return "Edit Template";
  return crumbFor[parts[0]] ?? "Workspace";
}

export default function Layout() {
  const { pathname } = useLocation();
  const crumb = currentCrumb(pathname);
  const { role, setRole, isAdmin } = useRole();

  const sections: NavSection[] = [
    {
      title: "Main",
      items: [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/campaigns", icon: Mail, label: "Campaigns", count: mockCampaigns.length },
        { to: "/templates", icon: FileText, label: "Templates" },
      ],
    },
    {
      title: "Audience",
      items: [
        { to: "/subscribers", icon: Users, label: "Subscribers", count: mockSubscribers.length },
        { to: "/groups", icon: FolderOpen, label: "Groups" },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Workspace",
            items: [{ to: "/settings", icon: SettingsIcon, label: "Settings" }],
          },
        ]
      : []),
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <img src="/ifs-logo.svg" alt="InfStones" />
        </div>

        <Link to="/campaigns/new" className="sb-compose">
          <Plus size={14} />
          New Campaign
          <kbd>C</kbd>
        </Link>

        <nav className="sb-nav">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="sb-section-title">{section.title}</div>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `sb-item ${isActive ? "active" : ""}`}
                  >
                    <Icon className="sb-icon" />
                    <span>{item.label}</span>
                    {item.count !== undefined && <span className="sb-count">{item.count}</span>}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">HL</div>
            <div className="sb-user-info">
              <div className="sb-user-name">Hongxuan Liu</div>
              <div className="sb-user-role">{role === "admin" ? "Admin" : "Member"}</div>
            </div>
            <ChevronDown size={14} style={{ color: "var(--muted-2)" }} />
          </div>
          <div style={{ padding: "8px 12px 10px", borderTop: "1px solid var(--hairline)" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Demo: switch role</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className={`btn btn-sm ${role === "admin" ? "btn-primary" : "btn-ghost"}`}
                style={{ flex: 1 }}
                onClick={() => setRole("admin")}
              >
                Admin
              </button>
              <button
                className={`btn btn-sm ${role === "member" ? "btn-primary" : "btn-ghost"}`}
                style={{ flex: 1 }}
                onClick={() => setRole("member")}
              >
                Member
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumbs">
            <span>Workspace</span>
            <span className="sep">/</span>
            <span className="current">{crumb}</span>
          </div>
          <div className="topbar-search">
            <Search size={14} className="search-icon" />
            <input placeholder="Search campaigns, subscribers, templates..." />
            <kbd>⌘K</kbd>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="dot" />
            </button>
            <button className="icon-btn" aria-label="Help">
              <HelpCircle size={16} />
            </button>
          </div>
        </header>

        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
