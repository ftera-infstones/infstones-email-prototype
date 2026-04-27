import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { mockCampaigns, mockRecipientActivity } from "../mock/data";

export default function CampaignReport() {
  const { id } = useParams();
  const campaign = mockCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="page-inner">
        <div className="empty">
          <h3>Campaign not found</h3>
          <p>It may have been deleted. Head back to the campaigns list to pick another one.</p>
          <Link to="/campaigns" className="btn btn-primary" style={{ marginTop: 14 }}>
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const openRate = campaign.recipients > 0 ? Math.round((campaign.uniqueOpens / campaign.recipients) * 100) : 0;
  const clickRate = campaign.recipients > 0 ? Math.round((campaign.uniqueClicks / campaign.recipients) * 100) : 0;
  const ctor = campaign.uniqueOpens > 0 ? Math.round((campaign.uniqueClicks / campaign.uniqueOpens) * 100) : 0;

  const statItems = [
    { label: "Delivered", value: campaign.recipients },
    { label: "Opens", value: campaign.opens },
    { label: "Unique opens", value: campaign.uniqueOpens },
    { label: "Clicks", value: campaign.clicks },
    { label: "Unique clicks", value: campaign.uniqueClicks },
    { label: "Bounces", value: campaign.bounces },
    { label: "Unsubscribes", value: campaign.unsubscribes },
  ];

  const funnelBase = Math.max(campaign.recipients, 1);
  const funnel = [
    { label: "Delivered", value: campaign.recipients, pct: 100 },
    { label: "Unique opens", value: campaign.uniqueOpens, pct: (campaign.uniqueOpens / funnelBase) * 100 },
    { label: "Unique clicks", value: campaign.uniqueClicks, pct: (campaign.uniqueClicks / funnelBase) * 100 },
    { label: "Unsubscribes", value: campaign.unsubscribes, pct: (campaign.unsubscribes / funnelBase) * 100 },
  ];

  return (
    <div className="page-inner">
      <Link to="/campaigns" className="btn btn-ghost btn-sm" style={{ marginBottom: 12, paddingLeft: 0 }}>
        <ArrowLeft size={14} />
        Back to campaigns
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">{campaign.name}</h1>
          <p className="page-subtitle">
            Sent on {new Date(campaign.sentAt!).toLocaleDateString()} to{" "}
            <strong>{campaign.recipients.toLocaleString()}</strong> recipients · Subject: {campaign.subject}
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary">Duplicate</button>
          <button className="btn btn-secondary">Export CSV</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div className="big-stat">
          <p className="pct amber">{openRate}%</p>
          <p className="label">Open rate</p>
        </div>
        <div className="big-stat">
          <p className="pct green">{clickRate}%</p>
          <p className="label">Click rate</p>
        </div>
        <div className="big-stat">
          <p className="pct" style={{ color: "var(--ink)" }}>
            {ctor}%
          </p>
          <p className="label">Click-to-open rate</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-hd">
          <h3>Engagement funnel</h3>
          <span className="muted" style={{ fontSize: 12 }}>
            Percentages based on recipients
          </span>
        </div>
        <div className="card-pad">
          <div className="funnel">
            {funnel.map((row) => (
              <div className="funnel-row" key={row.label}>
                <span>{row.label}</span>
                <div className="track">
                  <div className="fill" style={{ width: `${Math.max(row.pct, 1)}%` }} />
                </div>
                <span className="num">{row.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-hd">
          <h3>Detailed stats</h3>
        </div>
        <div className="card-pad">
          <div className="stat-grid">
            {statItems.map((s) => (
              <div className="stat-cell" key={s.label}>
                <p className="label">{s.label}</p>
                <div className="value">{s.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3>Recipient activity</h3>
          <span className="muted" style={{ fontSize: 12 }}>
            Sampled view · {mockRecipientActivity.length} shown
          </span>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Opened</th>
                <th>Clicked</th>
              </tr>
            </thead>
            <tbody>
              {mockRecipientActivity.map((r) => (
                <tr key={r.email}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td className="muted">{r.email}</td>
                  <td>
                    {r.opened ? (
                      <Check size={14} style={{ color: "var(--green)" }} />
                    ) : (
                      <X size={14} style={{ color: "var(--muted-2)" }} />
                    )}
                  </td>
                  <td>
                    {r.clicked ? (
                      <Check size={14} style={{ color: "var(--green)" }} />
                    ) : (
                      <X size={14} style={{ color: "var(--muted-2)" }} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
