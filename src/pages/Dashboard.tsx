import { Link, useNavigate } from "react-router-dom";
import { Users, Send, BarChart3, MousePointerClick, Plus, Upload, ArrowUpRight } from "lucide-react";
import { mockCampaigns, mockSubscribers, mockTrend } from "../mock/data";
import type { CampaignStatus } from "../mock/data";

const sentCampaigns = mockCampaigns.filter((c) => c.status === "sent");
const totalDelivered = sentCampaigns.reduce((a, c) => a + c.recipients, 0);
const avgOpen = sentCampaigns.length
  ? Math.round(
      (sentCampaigns.reduce((a, c) => a + c.uniqueOpens, 0) /
        sentCampaigns.reduce((a, c) => a + c.recipients, 0)) *
        100
    )
  : 0;
const avgClick = sentCampaigns.length
  ? Math.round(
      (sentCampaigns.reduce((a, c) => a + c.uniqueClicks, 0) /
        sentCampaigns.reduce((a, c) => a + c.recipients, 0)) *
        100
    )
  : 0;

const kpis = [
  { label: "Total Subscribers", value: mockSubscribers.length.toLocaleString(), delta: "+3.2%", up: true, icon: Users, spark: [4, 5, 5, 6, 7, 7, 8] },
  { label: "Campaigns Sent", value: sentCampaigns.length, unit: "", delta: "+2", up: true, icon: Send, spark: [1, 2, 2, 3, 3, 4, 4] },
  { label: "Avg Open Rate", value: avgOpen, unit: "%", delta: "+1.4pp", up: true, icon: BarChart3, spark: [48, 52, 55, 56, 59, 57, 60] },
  { label: "Avg Click Rate", value: avgClick, unit: "%", delta: "-0.3pp", up: false, icon: MousePointerClick, spark: [17, 19, 20, 21, 22, 20, 23] },
];

function Sparkline({ points, w = 80, h = 28 }: { points: number[]; w?: number; h?: number }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${h - ((p - min) / range) * h}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
      <path d={d} stroke="var(--amber)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendChart() {
  const width = 680;
  const height = 200;
  const pad = { t: 20, r: 20, b: 28, l: 32 };
  const points = mockTrend;
  const maxRate = Math.max(...points.map((p) => Math.max(p.openRate, p.clickRate)));
  const scaleX = (i: number) => pad.l + (i * (width - pad.l - pad.r)) / (points.length - 1);
  const scaleY = (v: number) => pad.t + (height - pad.t - pad.b) * (1 - v / maxRate);

  const openPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(p.openRate)}`).join(" ");
  const clickPath = points.map((p, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(p.clickRate)}`).join(" ");
  const areaPath = `${openPath} L${scaleX(points.length - 1)},${height - pad.b} L${scaleX(0)},${height - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="trend-chart" preserveAspectRatio="xMidYMid meet">
      {/* Gridlines */}
      {[0, 0.5, 1].map((f) => {
        const y = pad.t + (height - pad.t - pad.b) * f;
        return (
          <g key={f}>
            <line x1={pad.l} x2={width - pad.r} y1={y} y2={y} stroke="var(--hairline)" strokeDasharray="2 4" />
            <text x={pad.l - 6} y={y + 3} fontSize="10" fill="var(--muted-2)" textAnchor="end" fontFamily="var(--font-mono)">
              {Math.round(maxRate * (1 - f))}%
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="var(--amber-tint)" opacity="0.6" />
      <path d={openPath} stroke="var(--amber-active)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={clickPath} stroke="var(--ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" />
      {points.map((p, i) => (
        <g key={p.date}>
          <circle cx={scaleX(i)} cy={scaleY(p.openRate)} r="3" fill="var(--amber-active)" />
          <text x={scaleX(i)} y={height - 8} fontSize="10" fill="var(--muted)" textAnchor="middle" fontFamily="var(--font-mono)">
            {p.date.slice(5)}
          </text>
        </g>
      ))}
    </svg>
  );
}

const statusClass: Record<CampaignStatus, string> = {
  sent: "sent",
  scheduled: "scheduled",
  draft: "draft",
  sending: "sending",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const recent = mockCampaigns.slice(0, 5);

  return (
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {totalDelivered.toLocaleString()} emails delivered across {sentCampaigns.length} sent campaigns this quarter.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/subscribers" className="btn btn-secondary">
            <Upload size={14} />
            Import Subscribers
          </Link>
          <Link to="/campaigns/new" className="btn btn-primary">
            <Plus size={14} />
            New Campaign
          </Link>
        </div>
      </div>

      {/* KPI grid */}
      <div className="kpi-grid" style={{ marginBottom: 20 }}>
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div className="kpi" key={k.label}>
              <div className="kpi-label">
                <Icon size={13} />
                {k.label}
              </div>
              <div className="kpi-value">
                {k.value}
                {k.unit && <span className="unit">{k.unit}</span>}
              </div>
              <span className={`kpi-delta ${k.up ? "up" : "down"}`}>
                <ArrowUpRight size={12} style={{ transform: k.up ? "none" : "rotate(90deg)" }} />
                {k.delta}
                <span className="prev">vs. last month</span>
              </span>
              <div className="kpi-spark">
                <Sparkline points={k.spark} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-hd">
          <div>
            <h3>Engagement trend</h3>
            <div className="sub">Open rate and click rate over the last 90 days</div>
          </div>
          <div className="hstack" style={{ fontSize: 12, color: "var(--muted)" }}>
            <span className="hstack" style={{ gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--amber-active)" }} />
              Open rate
            </span>
            <span className="hstack" style={{ gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--ink)" }} />
              Click rate
            </span>
          </div>
        </div>
        <div className="card-pad">
          <TrendChart />
        </div>
      </div>

      {/* Recent campaigns */}
      <div className="card">
        <div className="card-hd">
          <h3>Recent campaigns</h3>
          <Link to="/campaigns" className="btn btn-ghost btn-sm">
            View all
            <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Recipients</th>
                <th>Open rate</th>
                <th>Click rate</th>
                <th>Sent</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((c) => (
                <tr
                  key={c.id}
                  className="clickable"
                  onClick={() => {
                    if (c.status === "sent") navigate(`/campaigns/${c.id}/report`);
                    else if (c.status === "draft") navigate(`/campaigns/${c.id}/edit`);
                    else navigate("/campaigns");
                  }}
                >
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
                  <td className="num">{c.recipients.toLocaleString()}</td>
                  <td className="num">
                    {c.recipients > 0 ? `${Math.round((c.uniqueOpens / c.recipients) * 100)}%` : "—"}
                  </td>
                  <td className="num">
                    {c.recipients > 0 ? `${Math.round((c.uniqueClicks / c.recipients) * 100)}%` : "—"}
                  </td>
                  <td className="muted">{c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
