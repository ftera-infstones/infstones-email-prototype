import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Send, CheckCircle2, Monitor, Smartphone, Copy, CheckCheck, Link2 } from "lucide-react";
import { mockGroups, mockTemplates } from "../mock/data";

const steps = ["Basics", "Template", "Preview & UTM", "Schedule", "Review"];

function buildEmailHtml(subject: string, campaignName: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${subject || "Email Preview"}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
    <tr><td style="background:#0f0f1a;padding:32px 40px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:2px;font-weight:700">InfStones</h1>
      <p style="margin:6px 0 0;color:#6b6b8a;font-size:11px;text-transform:uppercase;letter-spacing:2px">THE ULTIMATE WEB3 INFRASTRUCTURE PLATFORM</p>
    </td></tr>
    <tr><td style="padding:40px">
      <h2 style="margin:0 0 16px;color:#111827;font-size:20px;font-weight:700">${subject || "(No subject)"}</h2>
      <p style="margin:0 0 20px;color:#6b7280;line-height:1.75;font-size:14px">
        Welcome to another edition of the InfStones Insider Newsletter. Stay updated with the latest developments
        in Web3 infrastructure, staking insights, and community highlights.
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
      <h3 style="margin:0 0 14px;color:#111827;font-size:16px;font-weight:600">In This Issue</h3>
      <ul style="margin:0 0 28px;padding-left:20px;color:#6b7280;font-size:14px;line-height:2.2">
        <li>Q1 2026 infrastructure growth recap</li>
        <li>New DePIN node deployments across 12 networks</li>
        <li>Upcoming community AMA — register now</li>
        <li>Partner spotlight &amp; Q2 roadmap preview</li>
      </ul>
      <div style="text-align:center;margin:32px 0">
        <a href="https://infstones.com/blog?utm_source=email&utm_medium=newsletter&utm_campaign=${encodeURIComponent(campaignName)}&utm_content=cta_button"
           style="display:inline-block;background:#6366f1;color:#ffffff;padding:13px 36px;border-radius:7px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.3px">
          Read the Full Issue →
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
      <h3 style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:600">Staking Highlights</h3>
      <p style="margin:0 0 14px;color:#6b7280;line-height:1.75;font-size:14px">
        Our network now supports over <strong style="color:#111827">80 blockchains</strong> with 99.9% uptime SLA.
        New integrations include Monad, Berachain, and Story Protocol.
      </p>
      <a href="https://infstones.com/staking?utm_source=email&utm_medium=newsletter&utm_campaign=${encodeURIComponent(campaignName)}&utm_content=staking_link"
         style="color:#6366f1;font-size:14px;text-decoration:none">Explore staking options →</a>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0">
      <h3 style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:600">About InfStones</h3>
      <p style="margin:0;color:#6b7280;line-height:1.75;font-size:14px">
        InfStones is the world's leading blockchain infrastructure provider, powering staking, node deployment,
        and DePIN infrastructure across global networks.
      </p>
    </td></tr>
    <tr><td style="background:#0f0f1a;padding:28px 40px;text-align:center">
      <div style="margin-bottom:14px">
        <a href="https://twitter.com/infstones" style="color:#6366f1;font-size:12px;margin:0 10px;text-decoration:none">X (Twitter)</a>
        <a href="https://linkedin.com/company/infstones" style="color:#6366f1;font-size:12px;margin:0 10px;text-decoration:none">LinkedIn</a>
        <a href="https://t.me/infstones" style="color:#6366f1;font-size:12px;margin:0 10px;text-decoration:none">Telegram</a>
        <a href="https://discord.gg/infstones" style="color:#6366f1;font-size:12px;margin:0 10px;text-decoration:none">Discord</a>
      </div>
      <p style="margin:0;color:#4b4b6a;font-size:11px">© 2026 InfStones Inc. All rights reserved.</p>
      <p style="margin:8px 0 0">
        <a href="#" style="color:#4b4b6a;font-size:11px;text-decoration:underline">Unsubscribe</a>
        <span style="color:#4b4b6a;font-size:11px;margin:0 8px">|</span>
        <a href="#" style="color:#4b4b6a;font-size:11px;text-decoration:underline">Manage Preferences</a>
      </p>
    </td></tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildUtmUrl(base: string, params: Record<string, string>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([k, v]) => {
    if (v) url.searchParams.set(k, v);
  });
  return url.toString();
}

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showTestModal, setShowTestModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState<string | null>(null);

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

  const [utm, setUtm] = useState({
    source: "email",
    medium: "newsletter",
    campaign: "",
    content: "",
    term: "",
  });

  // Sync utm.campaign with subject when user enters subject
  const campaignSlug = form.subject.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "campaign";

  const emailHtml = useMemo(
    () => buildEmailHtml(form.subject, utm.campaign || campaignSlug),
    [form.subject, utm.campaign, campaignSlug]
  );

  const utmParams: Record<string, string> = {
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign || campaignSlug,
    ...(utm.content ? { utm_content: utm.content } : {}),
    ...(utm.term ? { utm_term: utm.term } : {}),
  };

  const sampleLinks = useMemo(() => [
    { label: "Read the Full Issue (CTA button)", base: "https://infstones.com/blog", content: "cta_button" },
    { label: "Staking highlights link", base: "https://infstones.com/staking", content: "staking_link" },
    { label: "Unsubscribe link", base: "https://app.infstones.com/unsubscribe", content: "" },
  ].map((link, i) => ({
    ...link,
    tracked: buildUtmUrl(link.base, { ...utmParams, ...(link.content ? { utm_content: link.content } : {}) }),
    key: `link-${i}`,
  })), [utm, campaignSlug]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleGroup = (name: string) => {
    setForm((f) => ({
      ...f,
      groups: f.groups.includes(name) ? f.groups.filter((g) => g !== name) : [...f.groups, name],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 flex-wrap">
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

        {/* Step 3: Preview & UTM */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Email Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">Email Preview</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Subject: <span className="font-medium text-gray-700">{form.subject || "(not set)"}</span>
                    {"  "}·{"  "}
                    From: <span className="font-medium text-gray-700">{form.fromName} &lt;{form.fromEmail}&gt;</span>
                  </p>
                </div>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      previewMode === "desktop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Monitor className="w-4 h-4" /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      previewMode === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Smartphone className="w-4 h-4" /> Mobile
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-4 flex justify-center">
                <div
                  style={{ width: previewMode === "desktop" ? "100%" : "375px", maxWidth: "100%" }}
                  className="transition-all duration-300"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      </div>
                      <div className="flex-1 bg-white rounded border border-gray-200 px-3 py-1 text-xs text-gray-400 font-mono truncate">
                        {form.subject || "Email Preview"}
                      </div>
                    </div>
                    <iframe
                      srcDoc={emailHtml}
                      title="Email Preview"
                      className="w-full border-0"
                      style={{ height: "480px" }}
                      sandbox="allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* UTM Configuration */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">UTM Tracking</h2>
              <p className="text-xs text-gray-500 mb-4">
                UTM parameters are appended to links in this campaign to track traffic in Google Analytics / GA4.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Parameters */}
                <div className="space-y-4">
                  {[
                    { key: "source", label: "utm_source", placeholder: "email", hint: "Traffic source (e.g. email, newsletter)" },
                    { key: "medium", label: "utm_medium", placeholder: "newsletter", hint: "Marketing medium (e.g. email, cpc)" },
                    {
                      key: "campaign",
                      label: "utm_campaign",
                      placeholder: campaignSlug,
                      hint: "Leave blank to auto-generate from subject line",
                    },
                    { key: "content", label: "utm_content", placeholder: "optional", hint: "Differentiates links in the same campaign" },
                    { key: "term", label: "utm_term", placeholder: "optional", hint: "Paid search keywords (usually N/A for email)" },
                  ].map(({ key, label, placeholder, hint }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <span className="font-mono text-indigo-600">{label}</span>
                      </label>
                      <input
                        type="text"
                        value={utm[key as keyof typeof utm]}
                        onChange={(e) => setUtm((u) => ({ ...u, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-400 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>

                {/* Tracked links preview */}
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700">Tracked Links Preview</p>
                  {sampleLinks.map((link) => (
                    <div key={link.key} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs font-medium text-gray-600">{link.label}</span>
                      </div>
                      <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <code className="text-xs text-gray-500 break-all flex-1 leading-relaxed">{link.tracked}</code>
                        <button
                          onClick={() => copyToClipboard(link.tracked, link.key)}
                          className="shrink-0 p-1 text-gray-400 hover:text-indigo-600 rounded"
                          title="Copy URL"
                        >
                          {copied === link.key ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 3 && (
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

        {/* Step 5: Review */}
        {step === 4 && (
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
                <span className="text-gray-500">UTM Campaign</span>
                <span className="text-gray-900 font-mono text-xs">{utm.campaign || campaignSlug}</span>
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
        {step < 4 ? (
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
