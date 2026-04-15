import { useState } from "react";
import { Plus, Users, Send, X, ArrowLeft } from "lucide-react";
import { mockGroups, mockSubscribers } from "../mock/data";

export default function Groups() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  if (selectedGroup) {
    const group = mockGroups.find((g) => g.name === selectedGroup);
    const members = mockSubscribers.filter((s) => s.groups.includes(selectedGroup));
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <button onClick={() => setSelectedGroup(null)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to groups
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedGroup}</h1>
          <p className="text-sm text-gray-500 mt-1">{group?.description}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {members.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-3 text-gray-600">{s.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockGroups.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGroup(g.name)}
            className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <h3 className="text-base font-semibold text-gray-900">{g.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{g.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4" /> {g.count} subscribers
              </span>
              <span className="inline-flex items-center gap-1">
                <Send className="w-4 h-4" /> {g.lastCampaign}
              </span>
            </div>
          </button>
        ))}
      </div>

      {showNewModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">New Group</h3>
              <button onClick={() => setShowNewModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. VIP Customers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} placeholder="What is this group for?" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => setShowNewModal(false)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
