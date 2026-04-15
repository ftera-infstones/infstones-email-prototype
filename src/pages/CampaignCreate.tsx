import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Send, CheckCircle2, Monitor, Smartphone,
  Copy, CheckCheck, Link2, Plus, ChevronUp, ChevronDown, Trash2, GripVertical, X,
} from "lucide-react";
import { mockGroups, mockTemplates, DEFAULT_SOCIAL_PLATFORMS } from "../mock/data";
import type { Block, BlockType } from "../mock/data";
import { uid, defaultBlock, getBlankBlocks, loadTemplateBlocks } from "../mock/data";
import { BLOCK_DEFS, BlockPreview, PropertiesPanel, getCornerRadius } from "../components/BlockEditor";

// ─── HTML generator ───────────────────────────────────────────────────────────

function addUtm(url: string, utmParams: Record<string, string>, content?: string): string {
  if (!url || !url.startsWith("http")) return url || "#";
  try {
    const u = new URL(url);
    Object.entries(utmParams).forEach(([k, v]) => { if (v) u.searchParams.set(k, v); });
    if (content) u.searchParams.set("utm_content", content);
    return u.toString();
  } catch { return url; }
}

function buildHtmlFromBlocks(blocks: Block[], utmParams: Record<string, string>): string {
  const rows = blocks.map(block => {
    const textAlign = `text-align:${block.align || "left"}`;

    switch (block.type) {
      case "header":
        return `<tr><td style="background:${block.bgColor || "#6366f1"};padding:32px 40px;${textAlign}">
          <h2 style="margin:0;color:${block.textColor || "#fff"};font-size:${block.fontSize || 20}px;font-weight:700">${block.content || "Header"}</h2>
        </td></tr>`;

      case "text":
        return `<tr><td style="padding:20px 40px;${textAlign}">
          <p style="margin:0;color:${block.textColor || "#374151"};font-size:${block.fontSize || 14}px;line-height:1.75">${(block.content || "").replace(/\n/g, "<br>")}</p>
        </td></tr>`;

      case "image":
        if (!block.imageUrl) return "";
        return `<tr><td style="padding:20px 40px;${textAlign}">
          <img src="${block.imageUrl}" alt="${block.imageAlt || ""}" style="max-width:100%;height:auto;display:inline-block;border-radius:4px">
        </td></tr>`;

      case "button": {
        const r     = getCornerRadius(block.cornerRadius);
        const color = block.buttonColor || "#6366f1";
        const href  = addUtm(block.buttonLink || "#", utmParams, "cta_button");
        const full  = block.buttonWidth === "full";
        let s = "";
        if (block.buttonStyle === "outlined") {
          s = `display:${full?"block":"inline-block"};background:transparent;color:${color};padding:13px 36px;border-radius:${r};text-decoration:none;font-size:14px;font-weight:600;border:2px solid ${color}`;
        } else if (block.buttonStyle === "text") {
          s = `display:${full?"block":"inline-block"};background:transparent;color:${color};padding:13px 0;text-decoration:none;font-size:14px;font-weight:600`;
        } else {
          s = `display:${full?"block":"inline-block"};background:${color};color:#fff;padding:13px 36px;border-radius:${r};text-decoration:none;font-size:14px;font-weight:600`;
        }
        return `<tr><td style="padding:20px 40px;${textAlign}">
          <a href="${href}" style="${s}">${block.buttonText || "Click Here"}</a>
        </td></tr>`;
      }

      case "divider": {
        const ls    = block.lineStyle || "solid";
        const thick = block.thickness || "1";
        const color = block.lineColor || "#e5e7eb";
        const sp    = block.spacing ?? 16;
        return `<tr><td style="padding:${sp}px 40px">
          <hr style="border:none;border-top:${thick}px ${ls} ${color};margin:0">
        </td></tr>`;
      }

      case "social": {
        const platforms = (block.socialPlatforms || DEFAULT_SOCIAL_PLATFORMS).filter(p => p.enabled);
        const size      = parseInt(block.iconSize || "24");
        const align     = block.socialAlignment || "center";
        const iStyle    = block.iconStyle || "colored";
        const fs        = Math.max(11, size - 12);
        const links = platforms.map(p => {
          const color  = iStyle === "monochrome" ? "#6b7280" : p.color;
          const border = iStyle === "outline" ? `border:1.5px solid ${color};padding:3px 8px;border-radius:4px;` : "";
          const fg     = iStyle === "outline" ? color : (iStyle === "monochrome" ? color : "#fff");
          const bg     = (iStyle === "colored") ? `background:${color};` : "";
          const pad    = (iStyle !== "outline") ? "padding:3px 10px;" : "";
          return `<a href="${p.url}" style="color:${fg};font-size:${fs}px;font-weight:600;margin:0 6px;text-decoration:none;border-radius:4px;${bg}${pad}${border}">${p.name}</a>`;
        }).join("");
        return `<tr><td style="padding:16px 40px;text-align:${align}">${links}</td></tr>`;
      }

      case "footer":
        return `<tr><td style="background:#0f0f1a;padding:24px 40px;text-align:${block.align || "center"}">
          <p style="margin:0;color:${block.textColor || "#9ca3af"};font-size:${block.fontSize || 12}px">${block.content || ""}</p>
          ${block.subContent ? `<p style="margin:8px 0 0;color:${block.textColor || "#9ca3af"};font-size:${block.fontSize || 12}px">${block.subContent}</p>` : ""}
        </td></tr>`;

      default: return "";
    }
  }).join("\n");

  return `<!DOCTYPE html><html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">
${rows}
</table></td></tr></table>
</body></html>`;
}

function buildUtmUrl(base: string, params: Record<string, string>): string {
  return addUtm(base, params);
}

// ─── Inline block canvas editor (used inside modal) ───────────────────────────

function BlockCanvas({
  blocks,
  selectedId,
  onSelect,
  onMove,
  onDelete,
}: {
  blocks: Block[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove:   (id: string, dir: -1 | 1) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {blocks.length === 0 && (
        <div className="p-12 text-center text-gray-400 text-sm">Add a block from the left panel</div>
      )}
      {blocks.map((block, idx) => (
        <div key={block.id} className="group relative">
          <div className="absolute right-2 top-2 z-10 hidden group-hover:flex items-center gap-1">
            <button onClick={() => onMove(block.id, -1)} disabled={idx === 0}
              className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
              <ChevronUp className="w-3 h-3" />
            </button>
            <button onClick={() => onMove(block.id, 1)} disabled={idx === blocks.length - 1}
              className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
              <ChevronDown className="w-3 h-3" />
            </button>
            <button onClick={() => onDelete(block.id)}
              className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-red-600 shadow-sm">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex">
            <GripVertical className="w-4 h-4 text-gray-300" />
          </div>
          <BlockPreview block={block} selected={selectedId === block.id} onClick={() => onSelect(block.id)} />
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const steps = ["Basics", "Template", "Preview & UTM", "Schedule", "Review"];

export default function CampaignCreate() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(0);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied]           = useState<string | null>(null);

  // Campaign form
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

  // Email blocks — loaded from template or blank
  const [campaignBlocks, setCampaignBlocks] = useState<Block[]>(getBlankBlocks());

  // Block editor modal state
  const [showEditorModal, setShowEditorModal]   = useState(false);
  const [editorSelectedId, setEditorSelectedId] = useState<string | null>(null);

  // Test email modal state
  const [showTestModal, setShowTestModal]   = useState(false);
  const [testStep, setTestStep]             = useState<"form" | "success">("form");
  const [testRecipients, setTestRecipients] = useState<string[]>([""]);

  // UTM
  const [utm, setUtm] = useState({ source: "email", medium: "newsletter", campaign: "", content: "", term: "" });
  const campaignSlug = form.subject.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "campaign";

  const utmParams: Record<string, string> = useMemo(() => ({
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign || campaignSlug,
    ...(utm.content ? { utm_content: utm.content } : {}),
    ...(utm.term    ? { utm_term:    utm.term    } : {}),
  }), [utm, campaignSlug]);

  const emailHtml = useMemo(
    () => buildHtmlFromBlocks(campaignBlocks, utmParams),
    [campaignBlocks, utmParams],
  );

  const sampleLinks = useMemo(() => [
    { label: "Read the Full Issue (CTA button)", base: "https://infstones.com/blog",          content: "cta_button"   },
    { label: "Staking highlights link",          base: "https://infstones.com/staking",       content: "staking_link" },
    { label: "Unsubscribe link",                 base: "https://app.infstones.com/unsubscribe", content: ""           },
  ].map((link, i) => ({
    ...link,
    tracked: buildUtmUrl(link.base, { ...utmParams, ...(link.content ? { utm_content: link.content } : {}) }),
    key: `link-${i}`,
  })), [utmParams]);

  // ── helpers ──────────────────────────────────────────────────────────────────

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleGroup = (name: string) =>
    setForm(f => ({ ...f, groups: f.groups.includes(name) ? f.groups.filter(g => g !== name) : [...f.groups, name] }));

  function selectTemplate(id: string) {
    setForm(f => ({ ...f, templateId: id }));
    const loaded = id ? loadTemplateBlocks(id) : getBlankBlocks();
    setCampaignBlocks(loaded);
    setEditorSelectedId(loaded[0]?.id ?? null);
  }

  // ── editor modal block operations ─────────────────────────────────────────

  const editorAddBlock = useCallback((type: BlockType) => {
    const nb: Block = { id: uid(), ...defaultBlock(type) };
    setCampaignBlocks(prev => [...prev, nb]);
    setEditorSelectedId(nb.id);
  }, []);

  const editorUpdateBlock = useCallback((id: string, partial: Partial<Block>) => {
    setCampaignBlocks(prev => prev.map(b => b.id === id ? { ...b, ...partial } : b));
  }, []);

  const editorDeleteBlock = useCallback((id: string) => {
    setCampaignBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      setEditorSelectedId(s => s === id ? (next[0]?.id ?? null) : s);
      return next;
    });
  }, []);

  const editorMoveBlock = useCallback((id: string, dir: -1 | 1) => {
    setCampaignBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }, []);

  const editorSelectedBlock = campaignBlocks.find(b => b.id === editorSelectedId) ?? null;

  // ─── render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Campaign</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "text-gray-900 font-medium" : "text-gray-400"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* ── Step 1: Basics ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What's this email about?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
              <input type="text" value={form.previewText} onChange={e => setForm({ ...form, previewText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Shows in inbox preview" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                <input type="text" value={form.fromName} onChange={e => setForm({ ...form, fromName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                <input type="email" value={form.fromEmail} onChange={e => setForm({ ...form, fromEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Group(s)</label>
              <div className="flex flex-wrap gap-2">
                {mockGroups.map(g => (
                  <button key={g.id} onClick={() => toggleGroup(g.name)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${form.groups.includes(g.name) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                    {g.name} ({g.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Template ───────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Choose a starting template for your campaign</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => selectTemplate("")}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${form.templateId === "" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">Blank</div>
                <p className="text-sm font-medium text-gray-900">Start from scratch</p>
                <p className="text-xs text-gray-500 mt-0.5">Edit content in Preview step</p>
              </button>
              {mockTemplates.map(t => (
                <button key={t.id} onClick={() => selectTemplate(t.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${form.templateId === t.id ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
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

        {/* ── Step 3: Preview & UTM ──────────────────────────────────────── */}
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setShowEditorModal(true); if (!editorSelectedId && campaignBlocks[0]) setEditorSelectedId(campaignBlocks[0].id); }}
                    className="px-3 py-1.5 text-sm border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Edit Content
                  </button>
                  <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setPreviewMode("desktop")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${previewMode === "desktop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      <Monitor className="w-4 h-4" /> Desktop
                    </button>
                    <button onClick={() => setPreviewMode("mobile")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${previewMode === "mobile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                      <Smartphone className="w-4 h-4" /> Mobile
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview container */}
              <div className="bg-gray-100 rounded-xl p-4 flex justify-center overflow-auto">
                {previewMode === "desktop" ? (
                  <div className="w-full" style={{ maxWidth: 600 }}>
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
                        className="w-full border-0 block"
                        style={{ height: 520 }}
                        sandbox="allow-same-origin"
                      />
                    </div>
                  </div>
                ) : (
                  /* Mobile phone frame */
                  <div style={{ width: 415, flexShrink: 0 }}>
                    <div
                      style={{
                        width: 395,
                        margin: "0 auto",
                        border: "10px solid #1f2937",
                        borderRadius: 44,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.1)",
                        overflow: "hidden",
                        position: "relative",
                        background: "#1f2937",
                      }}
                    >
                      {/* Notch */}
                      <div style={{ height: 28, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 80, height: 10, background: "#374151", borderRadius: 10 }} />
                      </div>
                      <iframe
                        srcDoc={emailHtml}
                        title="Mobile Preview"
                        className="border-0 block bg-white"
                        style={{ width: 375, height: 812, display: "block" }}
                        sandbox="allow-same-origin"
                      />
                      {/* Home indicator */}
                      <div style={{ height: 24, background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 100, height: 4, background: "#4b5563", borderRadius: 4 }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* UTM */}
            <div>
              <h2 className="text-sm font-semibold text-gray-900 mb-1">UTM Tracking</h2>
              <p className="text-xs text-gray-500 mb-4">UTM parameters are appended to links in this campaign for Google Analytics / GA4 tracking.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { key: "source",   label: "utm_source",   placeholder: "email",      hint: "Traffic source" },
                    { key: "medium",   label: "utm_medium",   placeholder: "newsletter", hint: "Marketing medium" },
                    { key: "campaign", label: "utm_campaign", placeholder: campaignSlug, hint: "Leave blank to auto-generate from subject" },
                    { key: "content",  label: "utm_content",  placeholder: "optional",   hint: "Differentiates links in the same campaign" },
                    { key: "term",     label: "utm_term",     placeholder: "optional",   hint: "Paid search keywords (usually N/A for email)" },
                  ].map(({ key, label, placeholder, hint }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <span className="font-mono text-indigo-600">{label}</span>
                      </label>
                      <input type="text" value={utm[key as keyof typeof utm]}
                        onChange={e => setUtm(u => ({ ...u, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      <p className="text-xs text-gray-400 mt-1">{hint}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-medium text-gray-700">Tracked Links Preview</p>
                  {sampleLinks.map(link => (
                    <div key={link.key} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-xs font-medium text-gray-600">{link.label}</span>
                      </div>
                      <div className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                        <code className="text-xs text-gray-500 break-all flex-1 leading-relaxed">{link.tracked}</code>
                        <button onClick={() => copyToClipboard(link.tracked, link.key)}
                          className="shrink-0 p-1 text-gray-400 hover:text-indigo-600 rounded" title="Copy URL">
                          {copied === link.key ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Schedule ───────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex gap-4">
              <button onClick={() => setForm({ ...form, sendNow: true })}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${form.sendNow ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
                <Send className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-sm font-medium text-gray-900">Send Now</p>
                <p className="text-xs text-gray-500 mt-1">Send immediately after review</p>
              </button>
              <button onClick={() => setForm({ ...form, sendNow: false })}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-colors ${!form.sendNow ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"}`}>
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
                  <input type="date" value={form.scheduleDate} onChange={e => setForm({ ...form, scheduleDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" value={form.scheduleTime} onChange={e => setForm({ ...form, scheduleTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Review ─────────────────────────────────────────────── */}
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
                  {form.templateId ? mockTemplates.find(t => t.id === form.templateId)?.name : "From scratch"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UTM Campaign</span>
                <span className="text-gray-900 font-mono text-xs">{utm.campaign || campaignSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blocks</span>
                <span className="text-gray-900">{campaignBlocks.length} blocks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Schedule</span>
                <span className="text-gray-900">{form.sendNow ? "Send immediately" : `${form.scheduleDate} ${form.scheduleTime}`}</span>
              </div>
            </div>
            <button onClick={() => { setShowTestModal(true); setTestStep("form"); }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Send Test Email
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={() => (step > 0 ? setStep(step - 1) : navigate("/campaigns"))}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => navigate("/campaigns")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            <Send className="w-4 h-4" /> Send Campaign
          </button>
        )}
      </div>

      {/* ── Block editor modal ─────────────────────────────────────────────── */}
      {showEditorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
              <h3 className="text-sm font-semibold text-gray-900">Edit Email Content</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{campaignBlocks.length} blocks</span>
                <button onClick={() => setShowEditorModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            {/* Body */}
            <div className="flex flex-1 min-h-0">
              {/* Block palette */}
              <div className="w-40 border-r border-gray-200 p-3 space-y-1 shrink-0 overflow-y-auto">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Add Block</p>
                {BLOCK_DEFS.map(b => (
                  <button key={b.type} onClick={() => editorAddBlock(b.type)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    <b.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{b.label}</span>
                    <Plus className="w-2.5 h-2.5 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
              {/* Canvas */}
              <div className="flex-1 bg-gray-100 overflow-y-auto p-6">
                <BlockCanvas
                  blocks={campaignBlocks}
                  selectedId={editorSelectedId}
                  onSelect={setEditorSelectedId}
                  onMove={editorMoveBlock}
                  onDelete={editorDeleteBlock}
                />
              </div>
              {/* Properties */}
              <div className="w-60 border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
                {editorSelectedBlock ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Properties</p>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                        {editorSelectedBlock.type}
                      </span>
                    </div>
                    <PropertiesPanel
                      block={editorSelectedBlock}
                      onChange={partial => editorUpdateBlock(editorSelectedBlock.id, partial)}
                    />
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <button onClick={() => editorDeleteBlock(editorSelectedBlock.id)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Block
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-400 pt-8 text-xs">Select a block to edit its properties</div>
                )}
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200 shrink-0">
              <button onClick={() => setShowEditorModal(false)}
                className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Done — Apply to Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Test email modal ───────────────────────────────────────────────── */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-xl">
            {testStep === "form" ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Send Test Email</h3>
                  <button onClick={() => setShowTestModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-indigo-50 rounded-lg px-4 py-2.5 text-sm">
                  <span className="text-gray-500">Subject: </span>
                  <span className="font-medium text-gray-800">[TEST] {form.subject || "(no subject)"}</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-700">Recipients (up to 5)</label>
                  {testRecipients.map((r, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="email"
                        value={r}
                        onChange={e => { const n = [...testRecipients]; n[i] = e.target.value; setTestRecipients(n); }}
                        placeholder="email@example.com"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {testRecipients.length > 1 && (
                        <button onClick={() => setTestRecipients(prev => prev.filter((_, j) => j !== i))}
                          className="px-2 text-gray-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {testRecipients.length < 5 && (
                    <button onClick={() => setTestRecipients(prev => [...prev, ""])}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
                      <Plus className="w-3 h-3" /> Add recipient
                    </button>
                  )}
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button onClick={() => setShowTestModal(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => setTestStep("success")}
                    className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Send Test
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-semibold text-gray-900">Test email sent!</h3>
                <p className="text-sm text-gray-500">
                  Sent to: <span className="font-medium text-gray-700">{testRecipients.filter(Boolean).join(", ") || "your inbox"}</span>
                </p>
                <button
                  onClick={() => { setShowTestModal(false); setTestStep("form"); }}
                  className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
