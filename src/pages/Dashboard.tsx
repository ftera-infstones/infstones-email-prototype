import { Link, useNavigate } from "react-router-dom";
import { Users, Send, BarChart3, MousePointerClick, Plus, Upload } from "lucide-react";
import { mockCampaigns, mockSubscribers, campaignSparklines } from "../mock/data";

const sentCampaigns = mockCampaigns.filter(c => c.status === "sent");
const avgOpen = sentCampaigns.length
  ? Math.round(sentCampaigns.reduce((a, c) => a + (c.uniqueOpens / c.recipients) * 100, 0) / sentCampaigns.length)
  : 0;
const avgClick = sentCampaigns.length
  ? Math.round(sentCampaigns.reduce((a, c) => a + (c.uniqueClicks / c.recipients) * 100, 0) / sentCampaigns.length)
  : 0;

const stats = [
  { label: "Total Subscribers", value: mockSubscribers.length, icon: Users,             color: "bg-indigo-50 text-indigo-600" },
  { label: "Campaigns Sent",    value: sentCampaigns.length,   icon: Send,              color: "bg-emerald-50 text-emerald-600" },
  { label: "Avg Open Rate",     value: `${avgOpen}%`,          icon: BarChart3,         color: "bg-amber-50 text-amber-600" },
  { label: "Avg Click Rate",    value: `${avgClick}%`,         icon: MousePointerClick, color: "bg-sky-50 text-sky-600" },
];

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);
  const h = 32, w = 80;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (p / max) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-20 h-8" fill="none">
      <path d={d} stroke="currentColor" strokeWidth="2" className="text-indigo-400" />
    </svg>
  );
}

const statusColor: Record<string, string> = {
  sent:      "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft:     "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> New Campaign
          </Link>
          <Link to="/subscribers"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> Import Subscribers
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent campaigns */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Campaigns</h2>
          <Link to="/campaigns" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Recipients</th>
                <th className="px-6 py-3 font-medium">Open Rate</th>
                <th className="px-6 py-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.slice(0, 5).map(c => (
                <tr key={c.id}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (c.status === "sent")  navigate(`/campaigns/${c.id}/report`);
                    else if (c.status === "draft") navigate(`/campaigns/${c.id}/edit`);
                    else navigate("/campaigns");
                  }}>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{c.recipients}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {c.recipients > 0 ? `${Math.round((c.uniqueOpens / c.recipients) * 100)}%` : "—"}
                  </td>
                  <td className="px-6 py-3">
                    <Sparkline points={campaignSparklines[c.id] || [1, 1, 1, 1, 1, 1, 1]} />
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
