import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Monitor,
  Smartphone,
  Copy,
  CheckCheck,
  Link2,
  Calendar,
  X,
} from "lucide-react";
import { mockGroups, mockTemplates } from "../mock/data";

const steps = ["Basics", "Template", "Preview & UTM", "Schedule", "Review"];

function buildEmailHtml(subject: string, campaignName: string) {
  const campaignEnc = encodeURIComponent(campaignName);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${subject || "Email Preview"}</title>
</head>
<body style="margin:0;padding:0;background:#F3F2ED;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3F2ED;padding:24px 0">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(11,14,30,0.08)">
    <tr><td style="background:#0B0E1E;padding:32px 40px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:3px;font-weight:700">INFSTONES</h1>
      <p style="margin:6px 0 0;color:#9A9DA8;font-size:10px;text-transform:uppercase;letter-spacing:2px">
        The Ultimate Web3 Infrastructure Platform
      </p>
    </td></tr>
    <tr><td style="padding:40px">
      <h2 style="margin:0 0 16px;color:#0B0E1E;font-size:20px;font-weight:700">${subject || "(No subject)"}</h2>
      <p style="margin:0 0 20px;color:#6B6E7B;line-height:1.75;font-size:14px">
        Welcome to another edition of the InfStones Insider Newsletter. Stay updated with the latest developments
        in Web3 infrastructure, staking insights, and community highlights.
      </p>
      <hr style="border:none;border-top:1px solid #E8E5DC;margin:28px 0">
      <h3 style="margin:0 0 14px;color:#0B0E1E;font-size:16px;font-weight:600">In this issue</h3>
      <ul style="margin:0 0 28px;padding-left:20px;color:#6B6E7B;font-size:14px;line-height:2.2">
        <li>Q1 2026 infrastructure growth recap</li>
        <li>New DePIN node deployments across 12 networks</li>
        <li>Upcoming community AMA &mdash; register now</li>
        <li>Partner spotlight &amp; Q2 roadmap preview</li>
      </ul>
      <div style="text-align:center;margin:32px 0">
        <a href="https://infstones.com/blog?utm_source=email&utm_medium=newsletter&utm_campaign=${campaignEnc}&utm_content=cta_button"
           style="display:inline-block;background:#EDB500;color:#0B0E1E;padding:13px 36px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.3px">
          Read the full issue &rarr;
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #E8E5DC;margin:28px 0">
      <h3 style="margin:0 0 12px;color:#0B0E1E;font-size:16px;font-weight:600">Staking highlights</h3>
      <p style="margin:0 0 14px;color:#6B6E7B;line-height:1.75;font-size:14px">
        Our network now supports over <strong style="color:#0B0E1E">80 blockchains</strong> with 99.9% uptime SLA.
        New integrations include Monad, Berachain, and Story Protocol.
      </p>
      <a href="https://infstones.com/staking?utm_source=email&utm_medium=newsletter&utm_campaign=${campaignEnc}&utm_content=staking_link"
         style="color:#CA9600;font-size:14px;text-decoration:none;font-weight:600">Explore staking options &rarr;</a>
    </td></tr>
    <tr><td style="background:#0B0E1E;padding:28px 40px;text-align:center">
      <div style="margin-bottom:12px">
        <a href="#" style="color:#EDB500;font-size:12px;margin:0 10px;text-decoration:none">X</a>
        <a href="#" style="color:#EDB500;font-size:12px;margin:0 10px;text-decoration:none">LinkedIn</a>
        <a href="#" style="color:#EDB500;font-size:12px;margin:0 10px;text-decoration:none">Telegram</a>
        <a href="#" style="color:#EDB500;font-size:12px;margin:0 10px;text-decoration:none">Discord</a>
      </div>
      <p style="margin:0;color:#6B6E7B;font-size:11px">&copy; 2026 InfStones Inc. All rights reserved.</p>
      <p style="margin:8px 0 0">
        <a href="#" style="color:#6B6E7B;font-size:11px;text-decoration:underline">Unsubscribe</a>
        <span style="color:#6B6E7B;font-size:11px;margin:0 8px">|</span>
        <a href="#" style="color:#6B6E7B;font-size:11px;text-decoration:underline">Manage preferences</a>
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

  const campaignSlug =
    form.subject
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") || "campaign";

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

  const sampleLinks = useMemo(
    () =>
      [
        { label: "Read the full issue (CTA)", base: "https://infstones.com/blog", content: "cta_button" },
        { label: "Staking highlights link", base: "https://infstones.com/staking", content: "staking_link" },
        { label: "Unsubscribe link", base: "https://app.infstones.com/unsubscribe", content: "" },
      ].map((link, i) => ({
        ...link,
        tracked: buildUtmUrl(link.base, {
          ...utmParams,
          ...(link.content ? { utm_content: link.content } : {}),
        }),
        key: `link-${i}`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [utm, campaignSlug]
  );

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
    <div className="page-inner">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create campaign</h1>
          <p className="page-subtitle">
            Set up subject, template, tracking, and schedule — review before sending.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="wizard-steps" style={{ marginBottom: 20 }}>
        {steps.map((s, i) => {
          const state = i < step ? "done" : i === step ? "current" : "future";
          return (
            <div key={s} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <div className={`wizard-step ${state}`}>
                <div className="dot">{i + 1}</div>
                <span>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="wizard-sep" />}
            </div>
          );
        })}
      </div>

      <div className="card card-pad" style={{ marginBottom: 16 }}>
        {/* Step 1: Basics */}
        {step === 0 && (
          <div className="vstack" style={{ gap: 16 }}>
            <div className="field">
              <label className="field-label">
                Subject line <span className="req">*</span>
              </label>
              <input
                className="input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="What's this email about?"
              />
            </div>
            <div className="field">
              <label className="field-label">Preview text</label>
              <input
                className="input"
                value={form.previewText}
                onChange={(e) => setForm({ ...form, previewText: e.target.value })}
                placeholder="Shows in the inbox preview, next to the subject"
              />
              <p className="field-hint">Most clients show around 90 characters.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field">
                <label className="field-label">From name</label>
                <input
                  className="input"
                  value={form.fromName}
                  onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                />
              </div>
              <div className="field">
                <label className="field-label">From email</label>
                <input
                  type="email"
                  className="input"
                  value={form.fromEmail}
                  onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Send to group(s)</label>
              <div className="hstack" style={{ flexWrap: "wrap", gap: 8 }}>
                {mockGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className={`chip-btn ${form.groups.includes(g.name) ? "selected" : ""}`}
                    onClick={() => toggleGroup(g.name)}
                  >
                    {g.name} <span className="muted mono" style={{ marginLeft: 4 }}>{g.count}</span>
                  </button>
                ))}
              </div>
              <p className="field-hint">
                {form.groups.length > 0
                  ? `Selected ${form.groups.length} group(s) — de-duplicated at send time.`
                  : "At least one group is required before scheduling."}
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Template */}
        {step === 1 && (
          <div>
            <p className="muted" style={{ margin: "0 0 16px", fontSize: 13 }}>
              Pick a starting point — you can customize every block later.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              <button
                type="button"
                className={`choice ${form.templateId === "" ? "selected" : ""}`}
                onClick={() => setForm({ ...form, templateId: "" })}
              >
                <div className="choice-thumb" style={{ background: "var(--bg-sunken)" }}>
                  <span className="muted mono" style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Blank
                  </span>
                </div>
                <p className="choice-title">Start from scratch</p>
                <div className="choice-meta">Build from empty template.</div>
              </button>
              {mockTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`choice ${form.templateId === t.id ? "selected" : ""}`}
                  onClick={() => setForm({ ...form, templateId: t.id })}
                >
                  <div className="choice-thumb" style={{ background: t.color + "15" }}>
                    <div className="mock" style={{ width: "80%", display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ height: 6, width: "55%", borderRadius: 3, background: t.color }} />
                      <div style={{ height: 4, borderRadius: 2, background: "rgba(11,14,30,0.1)" }} />
                      <div style={{ height: 4, width: "80%", borderRadius: 2, background: "rgba(11,14,30,0.1)" }} />
                      <div
                        style={{ height: 14, width: "40%", borderRadius: 4, background: t.color, marginTop: 6 }}
                      />
                    </div>
                  </div>
                  <p className="choice-title">{t.name}</p>
                  <div className="choice-meta">
                    Modified {new Date(t.lastModified).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Preview & UTM */}
        {step === 2 && (
          <div className="vstack" style={{ gap: 20 }}>
            <div>
              <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Email preview</h3>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    <span className="mono">{form.subject || "(no subject)"}</span>
                    {" "} · {" "}
                    {form.fromName} &lt;{form.fromEmail}&gt;
                  </div>
                </div>
                <div className="segmented">
                  <button
                    className={previewMode === "desktop" ? "active" : ""}
                    onClick={() => setPreviewMode("desktop")}
                  >
                    <Monitor size={12} /> Desktop
                  </button>
                  <button
                    className={previewMode === "mobile" ? "active" : ""}
                    onClick={() => setPreviewMode("mobile")}
                  >
                    <Smartphone size={12} /> Mobile
                  </button>
                </div>
              </div>

              <div className="email-preview-shell">
                <div
                  className="email-preview-window"
                  style={{ width: previewMode === "desktop" ? "100%" : 375, maxWidth: "100%" }}
                >
                  <div className="email-preview-topbar">
                    <div className="dots">
                      <span className="r" />
                      <span className="y" />
                      <span className="g" />
                    </div>
                    <div className="addr">{form.subject || "Email preview"}</div>
                  </div>
                  <iframe
                    srcDoc={emailHtml}
                    title="Email preview"
                    style={{ height: 480 }}
                    sandbox="allow-same-origin"
                  />
                </div>
              </div>
            </div>

            <hr className="hr" style={{ margin: 0 }} />

            {/* UTM */}
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>UTM tracking</h3>
              <div className="muted" style={{ fontSize: 12, marginTop: 2, marginBottom: 16 }}>
                Parameters are appended to every link so you can track this campaign in GA4.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div className="vstack" style={{ gap: 12 }}>
                  {(
                    [
                      { key: "source", label: "utm_source", placeholder: "email", hint: "Traffic source (email, newsletter)" },
                      { key: "medium", label: "utm_medium", placeholder: "newsletter", hint: "Marketing medium (email, cpc, referral)" },
                      {
                        key: "campaign",
                        label: "utm_campaign",
                        placeholder: campaignSlug,
                        hint: "Blank auto-generates from the subject line.",
                      },
                      { key: "content", label: "utm_content", placeholder: "optional", hint: "Distinguish variants of the same link." },
                      { key: "term", label: "utm_term", placeholder: "optional", hint: "Paid search keywords (N/A for email)." },
                    ] as const
                  ).map(({ key, label, placeholder, hint }) => (
                    <div className="field" key={key}>
                      <label className="field-label">
                        <span className="mono" style={{ color: "var(--amber-active)" }}>{label}</span>
                      </label>
                      <input
                        className="input"
                        value={utm[key]}
                        onChange={(e) => setUtm((u) => ({ ...u, [key]: e.target.value }))}
                        placeholder={placeholder}
                      />
                      <p className="field-hint">{hint}</p>
                    </div>
                  ))}
                </div>

                <div className="vstack" style={{ gap: 10 }}>
                  <div className="field-label" style={{ marginBottom: 0 }}>
                    Tracked links preview
                  </div>
                  {sampleLinks.map((link) => (
                    <div key={link.key}>
                      <div className="hstack" style={{ gap: 6, marginBottom: 6 }}>
                        <Link2 size={12} style={{ color: "var(--muted)" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--ink-2)" }}>{link.label}</span>
                      </div>
                      <div className="link-row">
                        <span />
                        <code>{link.tracked}</code>
                        <button
                          className="btn btn-icon btn-sm"
                          style={{ height: 24, width: 24 }}
                          onClick={() => copyToClipboard(link.tracked, link.key)}
                          title="Copy URL"
                        >
                          {copied === link.key ? (
                            <CheckCheck size={12} style={{ color: "var(--green)" }} />
                          ) : (
                            <Copy size={12} />
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
          <div className="vstack" style={{ gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <button
                type="button"
                className={`choice ${form.sendNow ? "selected" : ""}`}
                onClick={() => setForm({ ...form, sendNow: true })}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Send size={18} />
                  <strong style={{ fontSize: 14 }}>Send now</strong>
                </div>
                <p className="muted" style={{ margin: 0, fontSize: 12 }}>
                  Send as soon as you hit the send button in review.
                </p>
              </button>
              <button
                type="button"
                className={`choice ${!form.sendNow ? "selected" : ""}`}
                onClick={() => setForm({ ...form, sendNow: false })}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Calendar size={18} />
                  <strong style={{ fontSize: 14 }}>Schedule</strong>
                </div>
                <p className="muted" style={{ margin: 0, fontSize: 12 }}>
                  Pick a date and time. We'll handle the send.
                </p>
              </button>
            </div>
            {!form.sendNow && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field">
                  <label className="field-label">Date</label>
                  <input
                    className="input"
                    type="date"
                    value={form.scheduleDate}
                    onChange={(e) => setForm({ ...form, scheduleDate: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label className="field-label">Time</label>
                  <input
                    className="input"
                    type="time"
                    value={form.scheduleTime}
                    onChange={(e) => setForm({ ...form, scheduleTime: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="vstack" style={{ gap: 16 }}>
            <div className="summary-list">
              <div className="row">
                <span className="k">Subject</span>
                <span className="v">{form.subject || "(not set)"}</span>
              </div>
              <div className="row">
                <span className="k">From</span>
                <span className="v">
                  {form.fromName} &lt;{form.fromEmail}&gt;
                </span>
              </div>
              <div className="row">
                <span className="k">Groups</span>
                <span className="v">{form.groups.join(", ") || "(none selected)"}</span>
              </div>
              <div className="row">
                <span className="k">Template</span>
                <span className="v">
                  {form.templateId
                    ? mockTemplates.find((t) => t.id === form.templateId)?.name
                    : "From scratch"}
                </span>
              </div>
              <div className="row">
                <span className="k">UTM campaign</span>
                <span className="v mono">{utm.campaign || campaignSlug}</span>
              </div>
              <div className="row">
                <span className="k">Schedule</span>
                <span className="v">
                  {form.sendNow
                    ? "Send immediately"
                    : `${form.scheduleDate || "—"} ${form.scheduleTime || ""}`.trim()}
                </span>
              </div>
            </div>
            <div>
              <button className="btn btn-secondary" onClick={() => setShowTestModal(true)}>
                Send test email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="hstack" style={{ justifyContent: "space-between" }}>
        <button
          className="btn btn-secondary"
          onClick={() => (step > 0 ? setStep(step - 1) : navigate("/campaigns"))}
        >
          <ArrowLeft size={14} />
          Back
        </button>
        {step < 4 ? (
          <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
            Next
            <ArrowRight size={14} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => navigate("/campaigns")}>
            <Send size={14} />
            {form.sendNow ? "Send campaign" : "Schedule campaign"}
          </button>
        )}
      </div>

      {showTestModal && (
        <div className="modal-overlay" onClick={() => setShowTestModal(false)}>
          <div className="modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-hd">
              <h2>Test email sent</h2>
              <button className="btn btn-icon" onClick={() => setShowTestModal(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-bd" style={{ textAlign: "center", padding: "20px 24px 24px" }}>
              <CheckCircle2 size={40} style={{ color: "var(--green)", margin: "0 auto 10px" }} />
              <p className="muted" style={{ margin: 0 }}>
                A test email was sent to <strong>{form.fromEmail}</strong>.
              </p>
            </div>
            <div className="modal-ft">
              <button className="btn btn-primary" onClick={() => setShowTestModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
