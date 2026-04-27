import { useMemo, useState } from "react";
import { Plus, Upload, Search, X } from "lucide-react";
import { mockSubscribers, mockGroups } from "../mock/data";
import type { SubscriberStatus } from "../mock/data";

type StatusFilter = "all" | SubscriberStatus;

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Subscribers() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importDone, setImportDone] = useState(false);

  const filtered = useMemo(
    () =>
      mockSubscribers.filter((s) => {
        if (
          search &&
          !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.email.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        if (groupFilter && !s.groups.includes(groupFilter)) return false;
        if (statusFilter !== "all" && s.status !== statusFilter) return false;
        return true;
      }),
    [search, groupFilter, statusFilter]
  );

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "unsubscribed", label: "Unsubscribed" },
  ];

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscribers</h1>
          <p className="page-subtitle">
            {mockSubscribers.length.toLocaleString()} people · across {mockGroups.length} groups
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowImport(true);
              setImportDone(false);
            }}
          >
            <Upload size={14} />
            Import CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={14} />
            Add subscriber
          </button>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-field">
          <Search size={14} className="search-icon" />
          <input
            className="input"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option value="">All groups</option>
          {mockGroups.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
        <div className="segmented">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={statusFilter === t.key ? "active" : ""}
              onClick={() => setStatusFilter(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Organization</th>
                <th>Groups</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <div className="hstack" style={{ gap: 10 }}>
                      <div
                        className="sb-avatar"
                        style={{ width: 28, height: 28, fontSize: 11 }}
                      >
                        {initials(s.name)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="muted">{s.email}</td>
                  <td>{s.org ?? "—"}</td>
                  <td>
                    <div className="hstack" style={{ flexWrap: "wrap", gap: 4 }}>
                      {s.groups.map((g) => (
                        <span key={g} className="chip">
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${s.status === "active" ? "active" : "unsubscribed"}`}>
                      <span className="badge-dot" />
                      {s.status}
                    </span>
                  </td>
                  <td className="muted">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">
              <h3>No subscribers match</h3>
              <p>Try clearing filters or searching for a different name.</p>
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>Add subscriber</h2>
                <p>Add a single person. Bulk add? Use Import CSV.</p>
              </div>
              <button className="btn btn-icon" onClick={() => setShowAdd(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-bd">
              <div className="field">
                <label className="field-label">
                  Full name <span className="req">*</span>
                </label>
                <input className="input" placeholder="Jane Doe" />
              </div>
              <div className="field">
                <label className="field-label">
                  Email <span className="req">*</span>
                </label>
                <input className="input" type="email" placeholder="jane@example.com" />
              </div>
              <div className="field">
                <label className="field-label">Organization</label>
                <input className="input" placeholder="Acme Labs (optional)" />
              </div>
              <div className="field">
                <label className="field-label">Group</label>
                <select className="select">
                  {mockGroups.map((g) => (
                    <option key={g.id} value={g.name}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => setShowAdd(false)}>
                Add subscriber
              </button>
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <div className="modal-overlay" onClick={() => setShowImport(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>Import CSV</h2>
                <p>Upload a MailerLite (or similar) export. We'll auto-map common fields.</p>
              </div>
              <button className="btn btn-icon" onClick={() => setShowImport(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-bd">
              {!importDone ? (
                <div className="dropzone" onClick={() => setImportDone(true)}>
                  <Upload size={20} style={{ color: "var(--muted)" }} />
                  <h4>Click or drag & drop your CSV file here</h4>
                  <p>Supports MailerLite, Mailchimp, CSV up to 10MB</p>
                </div>
              ) : (
                <div className="notice success">
                  <div>
                    <strong>Imported 247 subscribers</strong>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      All subscribers were added to the <strong>Newsletter</strong> group.
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-ft">
              <button
                className={importDone ? "btn btn-primary" : "btn btn-secondary"}
                onClick={() => setShowImport(false)}
              >
                {importDone ? "Done" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
