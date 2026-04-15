import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";
import { mockTemplates } from "../mock/data";

export default function Templates() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <Link
          to="/templates/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Template
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockTemplates.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
            <div className="h-40 flex items-center justify-center" style={{ backgroundColor: t.color + "15" }}>
              <div className="space-y-2 w-3/4">
                <div className="h-3 rounded" style={{ backgroundColor: t.color, width: "60%" }} />
                <div className="h-2 rounded bg-gray-200 w-full" />
                <div className="h-2 rounded bg-gray-200 w-4/5" />
                <div className="h-6 rounded mt-3" style={{ backgroundColor: t.color + "40", width: "40%" }} />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Modified {new Date(t.lastModified).toLocaleDateString()}</p>
              </div>
              <Link
                to={`/templates/${t.id}/edit`}
                className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-indigo-50"
              >
                <Pencil className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
