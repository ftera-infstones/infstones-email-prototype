import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { mockGroups, mockTemplates } from "../mock/data";

const steps = ["Basics", "Template", "Schedule", "Review"];

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showTestModal, setShowTestModal] = useState(false);
  const [form, setForm] = useState({
    subject: "",
    previewText: "",
    fromName: "InfStones Team",
    fromEmail: "hello@infstones.com",
    groups: [] as string[],
    templateId: "",
    sendNow: true,
    scheduleDate: "",
    scheduleTime: "",
  });

  const toggleGroup = (name: string) => {
    setForm((f) => ({
      ...f,
      groups: f.groups.includes(name) ? f.groups.filter((g) => g !== name) : [...f.groups, name],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "text-gray-900 font-medium" : "text-gray-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Basics */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What's this email about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
              <input
                type="text"
                value={form.previewText}
                onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Shows in inbox preview"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input
                  type="text"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input
                  type="email"
                  value={form.fromEmail}
                  onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Group(s)</label>
              <div className="flex flex-wrap gap-2">
                {mockGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => toggleGroup(g.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.groups.includes(g.name)
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {g.name} ({g.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Template */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Choose a template for your campaign</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setForm({ ...form, templateId: "" })}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  form.templateId === "" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
                  Blank
                </div>
                <p className="text-sm font-medium text-gray-900">Start from scratch</p>
              </button>
              {mockTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm({ ...form, templateId: t.id })}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    form.templateId === t.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-full h-24 rounded mb-3" style={{ backgroundColor: t.color + "20" }}>
                    <div className="h-full flex items-center justify-center">
                      <div className="w-16 h-3 rounded" style={{ backgroundColor: t.color }} />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex gap-4">
              <button
                onClick={() => setForm({ ...form, sendNow: true })}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                  form.sendNow ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Send className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium text-gray-900">Send Now</p>
                <p className="text-xs text-gray-500 mt-1">Send immediately after review</p>
              </button>
              <button
                onClick={() => setForm({ ...form, sendNow: false })}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${
                  !form.sendNow ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <svg className="w-6 h-6 mx-auto mb-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-900">Schedule</p>
                <p className="text-xs text-gray-500 mt-1">Pick a date and time</p>
              </button>
            </div>
            {!form.sendNow && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.scheduleDate}
                    onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={form.scheduleTime}
                    onChange={(e) => setForm({ ...form, scheduleTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-lg bg-gray-50 p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subject</span>
                <span className="text-gray-900 font-medium">{form.subject || "(not set)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">From</span>
                <span className="text-gray-900">{form.fromName} &lt;{form.fromEmail}&gt;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Groups</span>
                <span className="text-gray-900">{form.groups.join(", ") || "(none)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Template</span>
                <span className="text-gray-900">
                  {form.templateId ? mockTemplates.find((t) => t.id === form.templateId)?.name : "From scratch"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Schedule</span>
                <span className="text-gray-900">
                  {form.sendNow ? "Send immediately" : `${form.scheduleDate} ${form.scheduleTime}`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowTestModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Send Test Email
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : navigate("/campaigns"))}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => navigate("/campaigns")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-4 h-4" /> Send Campaign
          </button>
        )}
      </div>

      {/* Test email modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">Test email sent!</h3>
            <p className="text-sm text-gray-500">A test email has been sent to your inbox.</p>
            <button
              onClick={() => setShowTestModal(false)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
