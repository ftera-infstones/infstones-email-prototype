import { Link } from "react-router-dom";
import { Plus, Copy, Eye, Pencil } from "lucide-react";
import { mockCampaigns } from "../mock/data";

const statusColor: Record<string, string> = {
  sent: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
  draft: "bg-gray-100 text-gray-600",
};

export default function Campaigns() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Recipients</th>
                <th className="px-6 py-3 font-medium">Open Rate</th>
                <th className="px-6 py-3 font-medium">Click Rate</th>
                <th className="px-6 py-3 font-medium">Sent At</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{c.recipients}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {c.recipients > 0 ? `${Math.round((c.uniqueOpens / c.recipients) * 100)}%` : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {c.recipients > 0 ? `${Math.round((c.uniqueClicks / c.recipients) * 100)}%` : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {c.sentAt ? new Date(c.sentAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {c.status === "draft" && (
                        <Link
                          to={`/campaigns/${c.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                      )}
                      {c.status === "sent" && (
                        <Link
                          to={`/campaigns/${c.id}/report`}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <button
                        className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
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
