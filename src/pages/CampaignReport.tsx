import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import { mockCampaigns, mockRecipientActivity } from "../mock/data";

export default function CampaignReport() {
  const { id } = useParams();
  const campaign = mockCampaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Campaign not found</p>
        <Link to="/campaigns" className="text-indigo-600 text-sm mt-2 inline-block">Back to campaigns</Link>
      </div>
    );
  }

  const openRate = campaign.recipients > 0 ? Math.round((campaign.uniqueOpens / campaign.recipients) * 100) : 0;
  const clickRate = campaign.recipients > 0 ? Math.round((campaign.uniqueClicks / campaign.recipients) * 100) : 0;

  const statItems = [
    { label: "Delivered", value: campaign.recipients },
    { label: "Opens", value: campaign.opens },
    { label: "Unique Opens", value: campaign.uniqueOpens },
    { label: "Clicks", value: campaign.clicks },
    { label: "Unique Clicks", value: campaign.uniqueClicks },
    { label: "Bounces", value: campaign.bounces },
    { label: "Unsubscribes", value: campaign.unsubscribes },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <Link to="/campaigns" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to campaigns
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sent on {new Date(campaign.sentAt!).toLocaleDateString()} to {campaign.recipients} recipients
        </p>
      </div>

      {/* Big rate numbers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-4xl font-bold text-indigo-600">{openRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Open Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-4xl font-bold text-emerald-600">{clickRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Click Rate</p>
        </div>
      </div>

      {/* Detail stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {statItems.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recipient activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recipient Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Opened</th>
                <th className="px-6 py-3 font-medium">Clicked</th>
              </tr>
            </thead>
            <tbody>
              {mockRecipientActivity.map((r) => (
                <tr key={r.email} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-6 py-3 text-gray-600">{r.email}</td>
                  <td className="px-6 py-3">
                    {r.opened ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {r.clicked ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300" />
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
