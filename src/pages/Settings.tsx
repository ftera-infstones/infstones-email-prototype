import { useState } from "react";
import { Upload, CheckCircle, Plus, Pencil, Trash2, X } from "lucide-react";
import { mockUsers } from "../mock/data";
import type { User, UserRole } from "../mock/data";

type Tab = "general" | "sending" | "import" | "users";

const tabs: { key: Tab; label: string; hint: string }[] = [
  { key: "general", label: "General", hint: "Org, defaults" },
  { key: "sending", label: "Sending", hint: "AWS SES setup" },
  { key: "import", label: "Import", hint: "MailerLite CSV" },
  { key: "users", label: "Users", hint: "Team access" },
];

export default function Settings() {
  const [tab, setTab] = useState<Tab>("general");
  const [importDone, setImportDone] = useState(false);

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Workspace configuration, sending provider, and data import.</p>
        </div>
      </div>

      <div className="settings-shell">
        <nav className="settings-nav">
          {tabs.map((t) => (
            <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
              <div>{t.label}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                {t.hint}
              </div>
            </button>
          ))}
        </nav>

        <section>
          {tab === "general" && (
            <div className="card">
              <div className="card-hd">
                <h3>General</h3>
                <span className="muted" style={{ fontSize: 12 }}>
                  Defaults applied to new campaigns
                </span>
              </div>
              <div className="card-pad vstack" style={{ gap: 14, maxWidth: 520 }}>
                <div className="field">
                  <label className="field-label">Organization name</label>
                  <input className="input" defaultValue="InfStones" />
                </div>
                <div className="field">
                  <label className="field-label">Default from name</label>
                  <input className="input" defaultValue="InfStones Team" />
                </div>
                <div className="field">
                  <label className="field-label">Default from email</label>
                  <input className="input" type="email" defaultValue="hello@infstones.com" />
                </div>
                <div>
                  <button className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          )}

          {tab === "sending" && (
            <div className="card">
              <div className="card-hd">
                <h3>Sending</h3>
                <span className="muted" style={{ fontSize: 12 }}>
                  Powered by AWS SES
                </span>
              </div>
              <div className="card-pad vstack" style={{ gap: 14, maxWidth: 520 }}>
                <div className="field">
                  <label className="field-label">AWS SES region</label>
                  <select className="select" defaultValue="us-east-1">
                    <option>us-east-1</option>
                    <option>us-west-2</option>
                    <option>eu-west-1</option>
                    <option>ap-southeast-1</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">AWS credentials</label>
                  <div className="notice success">
                    <CheckCircle size={16} />
                    <div>
                      <strong>Connected</strong>
                      <div style={{ fontSize: 12, marginTop: 2 }}>Last verified 2 hours ago.</div>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">S3 bucket (attachments)</label>
                  <input className="input" defaultValue="infstones-email-attachments" />
                </div>
                <div>
                  <button className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          )}

          {tab === "import" && (
            <div className="card">
              <div className="card-hd">
                <h3>Import subscribers</h3>
                <span className="muted" style={{ fontSize: 12 }}>
                  MailerLite / Mailchimp / CSV
                </span>
              </div>
              <div className="card-pad vstack" style={{ gap: 14, maxWidth: 520 }}>
                <div className="notice info">
                  <div>
                    <strong>How it works</strong>
                    <ol style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 12, lineHeight: 1.8 }}>
                      <li>Export subscribers from MailerLite as CSV.</li>
                      <li>Upload the file below — fields are mapped automatically.</li>
                      <li>Review and confirm the import.</li>
                    </ol>
                  </div>
                </div>

                {!importDone ? (
                  <div className="dropzone" onClick={() => setImportDone(true)}>
                    <Upload size={20} style={{ color: "var(--muted)" }} />
                    <h4>Click or drag & drop your CSV file</h4>
                    <p>CSV up to 10MB</p>
                  </div>
                ) : (
                  <div className="notice success">
                    <CheckCircle size={16} />
                    <div>
                      <strong>Imported 247 subscribers</strong>
                      <div style={{ fontSize: 12, marginTop: 2 }}>
                        Added to the <strong>Newsletter</strong> group.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "users" && <UsersTab />}
        </section>
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UsersTab() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [newForm, setNewForm] = useState({ name: "", email: "", role: "member" as UserRole });
  const [editRole, setEditRole] = useState<UserRole>("member");

  function openEdit(u: User) {
    setEditUser(u);
    setEditRole(u.role);
  }

  function handleAdd() {
    if (!newForm.name || !newForm.email) return;
    const u: User = {
      id: `u${Date.now()}`,
      name: newForm.name,
      email: newForm.email,
      role: newForm.role,
      status: "active",
      invitedAt: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, u]);
    setShowAdd(false);
    setNewForm({ name: "", email: "", role: "member" });
  }

  function handleEdit() {
    if (!editUser) return;
    setUsers(users.map((u) => (u.id === editUser.id ? { ...u, role: editRole } : u)));
    setEditUser(null);
  }

  function handleDelete(id: string) {
    setUsers(users.filter((u) => u.id !== id));
    setConfirmDeleteId(null);
  }

  const confirmTarget = users.find((u) => u.id === confirmDeleteId);

  return (
    <div className="card">
      <div className="card-hd" style={{ justifyContent: "space-between" }}>
        <div>
          <h3>Users</h3>
          <span className="muted" style={{ fontSize: 12 }}>
            Manage team members and their roles
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>
          <Plus size={13} style={{ marginRight: 4 }} />
          Add user
        </button>
      </div>

      <div className="tbl-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Invited</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: "32px 0" }}>
                  No users yet.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "var(--bg-sunken)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--ink-2)",
                        flexShrink: 0,
                      }}
                    >
                      {initials(u.name)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: "var(--muted)" }}>{u.email}</td>
                <td>
                  <span className={`badge ${u.role}`}>{u.role === "admin" ? "Admin" : "Member"}</span>
                </td>
                <td>
                  <span className={`badge ${u.status === "active" ? "active" : "draft"}`}>
                    {u.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>
                <td style={{ color: "var(--muted)", fontSize: 12 }}>{u.invitedAt}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => openEdit(u)}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Pencil size={12} />
                      Edit User
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setConfirmDeleteId(u.id)}
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Trash2 size={12} />
                      Delete User
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>Add user</h2>
                <p>Invite a team member to this workspace.</p>
              </div>
              <button className="btn-icon" onClick={() => setShowAdd(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-bd">
              <div className="field">
                <label className="field-label">
                  Full name <span className="req">*</span>
                </label>
                <input
                  className="input"
                  placeholder="e.g. Jane Smith"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label">
                  Email address <span className="req">*</span>
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="e.g. jane@infstones.com"
                  value={newForm.email}
                  onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label">Role</label>
                <select
                  className="select"
                  value={newForm.role}
                  onChange={(e) => setNewForm({ ...newForm, role: e.target.value as UserRole })}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
                <div className="field-hint">Admins can access all Settings. Members cannot.</div>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                disabled={!newForm.name || !newForm.email}
                onClick={handleAdd}
              >
                Add user
              </button>
            </div>
          </div>
        </div>
      )}

      {editUser && (
        <div className="modal-overlay" onClick={() => setEditUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>Edit user</h2>
                <p>Change role for {editUser.name}.</p>
              </div>
              <button className="btn-icon" onClick={() => setEditUser(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-bd">
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--bg-sunken)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink-2)",
                  }}
                >
                  {initials(editUser.name)}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{editUser.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{editUser.email}</div>
                </div>
              </div>
              <div className="field">
                <label className="field-label">Role</label>
                <select
                  className="select"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
                <div className="field-hint">Admins can access all Settings. Members cannot.</div>
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-secondary" onClick={() => setEditUser(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleEdit}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>Delete user</h2>
                <p>This action cannot be undone.</p>
              </div>
              <button className="btn-icon" onClick={() => setConfirmDeleteId(null)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-bd">
              <p style={{ color: "var(--ink-2)" }}>
                Are you sure you want to delete <strong>{confirmTarget?.name}</strong>? They will lose
                access to this workspace immediately.
              </p>
            </div>
            <div className="modal-ft">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDeleteId)}>
                Delete user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
