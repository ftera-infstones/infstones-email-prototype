import { useState } from "react";
import { Plus, Users, Send, ArrowLeft, X } from "lucide-react";
import { mockGroups, mockSubscribers } from "../mock/data";

export default function Groups() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  if (selectedGroup) {
    const group = mockGroups.find((g) => g.name === selectedGroup);
    const members = mockSubscribers.filter((s) => s.groups.includes(selectedGroup));
    return (
      <div className="page-inner">
        <button
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0, marginBottom: 12 }}
          onClick={() => setSelectedGroup(null)}
        >
          <ArrowLeft size={14} />
          Back to groups
        </button>
        <div className="page-header">
          <div>
            <h1 className="page-title">{selectedGroup}</h1>
            <p className="page-subtitle">{group?.description}</p>
          </div>
          <div className="page-actions">
            <button className="btn btn-secondary">Edit group</button>
            <button className="btn btn-primary">
              <Plus size={14} />
              Add members
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <h3>Members</h3>
            <span className="muted" style={{ fontSize: 12 }}>
              {members.length} total
            </span>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {members.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td className="muted">{s.email}</td>
                    <td>{s.org ?? "—"}</td>
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
            {members.length === 0 && (
              <div className="empty">
                <h3>No members yet</h3>
                <p>Add subscribers to this group from the Subscribers page.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Groups</h1>
          <p className="page-subtitle">
            Organize subscribers into segments for targeted campaigns.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setShowNew(true)}>
            <Plus size={14} />
            New group
          </button>
        </div>
      </div>

      <div className="group-grid">
        {mockGroups.map((g) => (
          <button key={g.id} className="group-card" onClick={() => setSelectedGroup(g.name)}>
            <h3>{g.name}</h3>
            <p>{g.description}</p>
            <div className="meta">
              <span className="item">
                <Users size={12} /> {g.count.toLocaleString()} members
              </span>
              <span className="item">
                <Send size={12} /> Last: {g.lastCampaign}
              </span>
            </div>
          </button>
        ))}
      </div>

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <div>
                <h2>New group</h2>
                <p>Groups let you target campaigns to a specific audience slice.</p>
              </div>
              <button className="btn btn-icon" onClick={() => setShowNew(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-bd">
              <div className="field">
                <label className="field-label">
                  Name <span className="req">*</span>
                </label>
                <input className="input" placeholder="e.g. VIP customers" />
              </div>
              <div className="field">
                <label className="field-label">Description</label>
                <textarea className="textarea" rows={3} placeholder="What is this group for?" />
              </div>
            </div>
            <div className="modal-ft">
              <button className="btn btn-secondary" onClick={() => setShowNew(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => setShowNew(false)}>
                Create group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
