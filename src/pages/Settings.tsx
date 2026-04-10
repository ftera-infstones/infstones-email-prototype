import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

const tabs = ["General", "Sending", "Import"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("General");
  const [importDone, setImportDone] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === "General" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                defaultValue="InfStones"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default From Name</label>
              <input
                type="text"
                defaultValue="InfStones Team"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default From Email</label>
              <input
                type="email"
                defaultValue="hello@infstones.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "Sending" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AWS SES Region</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>us-east-1</option>
                <option>us-west-2</option>
                <option>eu-west-1</option>
                <option>ap-southeast-1</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AWS Credentials Status</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Connected</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">S3 Bucket (Attachments)</label>
              <input
                type="text"
                defaultValue="infstones-email-attachments"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "Import" && (
          <div className="space-y-5 max-w-lg">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Import from MailerLite</h3>
              <p className="text-sm text-gray-500 mt-1">
                Export your subscribers from MailerLite as CSV and upload them here.
                We'll map the fields automatically.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-2">
              <p className="font-medium text-gray-700">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to MailerLite → Subscribers → Export</li>
                <li>Select "All subscribers" and export as CSV</li>
                <li>Upload the CSV file below</li>
                <li>Review the mapping and confirm import</li>
              </ol>
            </div>
            {!importDone ? (
              <div
                onClick={() => setImportDone(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click or drag & drop your MailerLite CSV export</p>
                <p className="text-xs text-gray-400 mt-1">CSV files up to 10MB</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-emerald-700">Imported 247 subscribers from MailerLite export</p>
                <p className="text-xs text-emerald-600 mt-1">All subscribers have been added to the Newsletter group</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
