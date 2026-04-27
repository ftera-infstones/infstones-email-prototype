import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Copy, Eye, Pencil } from "lucide-react";
import { mockCampaigns } from "../mock/data";
import type { CampaignStatus } from "../mock/data";

type Filter = "all" | CampaignStatus;

const statusClass: Record<CampaignStatus, string> = {
  sent: "sent",
  scheduled: "scheduled",
  draft: "draft",
  sending: "sending",
};

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sent", label: "Sent" },
  { key: "scheduled", label: "Scheduled" },
  { key: "draft", label: "Drafts" },
];

export default function Campaigns() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? mockCampaigns : mockCampaigns.filter((c) => c.status === filter)),
    [filter]
  );

  const counts = useMemo(() => {
    const by: Record<string, number> = { all: mockCampaigns.length };
    for (const c of mockCampaigns) by[c.status] = (by[c.status] ?? 0) + 1;
    return by;
  }, []);

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="page-subtitle">
            Create, schedule, and review all of your email sends in one place.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/campaigns/new" className="btn btn-primary">
            <Plus size={14} />
            New Campaign
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <div className="segmented">
          {tabs.map((t) => (
            <button key={t.key} className={filter === t.key ? "active" : ""} onClick={() => setFilter(t.key)}>
              {t.label}
              <span className="muted mono" style={{ fontSize: 11 }}>
                {counts[t.key] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Audience</th>
                <th>Recipients</th>
                <th>Open</th>
                <th>Click</th>
                <th>Sent at</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                      {c.subject}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[c.status]}`}>
                      <span className="badge-dot" />
                      {c.status}
                    </span>
                  </td>
                  <td>
                    {c.groups.length > 0 ? (
                      <div className="hstack" style={{ flexWrap: "wrap", gap: 4 }}>
                        {c.groups.map((g) => (
                          <span key={g} className="chip">
                            {g}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="num">{c.recipients.toLocaleString()}</td>
                  <td className="num">
                    {c.recipients > 0 ? `${Math.round((c.uniqueOpens / c.recipients) * 100)}%` : "—"}
                  </td>
                  <td className="num">
                    {c.recipients > 0 ? `${Math.round((c.uniqueClicks / c.recipients) * 100)}%` : "—"}
                  </td>
                  <td className="muted">
                    {c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="actions">
                    <div className="hstack" style={{ justifyContent: "flex-end", gap: 4 }}>
                      {c.status === "sent" && (
                        <button
                          className="btn btn-icon"
                          title="View report"
                          onClick={() => navigate(`/campaigns/${c.id}/report`)}
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      {(c.status === "draft" || c.status === "scheduled") && (
                        <button
                          className="btn btn-icon"
                          title="Edit"
                          onClick={() => navigate(`/campaigns/${c.id}/edit`)}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                      <button className="btn btn-icon" title="Duplicate">
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty">
              <h3>No campaigns in this filter</h3>
              <p>Switch to "All" above, or create a new campaign to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
