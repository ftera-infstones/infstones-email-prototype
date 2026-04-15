import { Image, Type, MousePointerClick, Minus, Heading, FootprintsIcon, Share2 } from "lucide-react";
import type { Block, BlockType, SocialPlatform } from "../mock/data";
import { DEFAULT_SOCIAL_PLATFORMS } from "../mock/data";

// ─── Block palette definitions ────────────────────────────────────────────────

export const BLOCK_DEFS: { type: BlockType; icon: React.ElementType; label: string }[] = [
  { type: "header",  icon: Heading,           label: "Header"  },
  { type: "text",    icon: Type,              label: "Text"    },
  { type: "image",   icon: Image,             label: "Image"   },
  { type: "button",  icon: MousePointerClick, label: "Button"  },
  { type: "divider", icon: Minus,             label: "Divider" },
  { type: "social",  icon: Share2,            label: "Social"  },
  { type: "footer",  icon: FootprintsIcon,    label: "Footer"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function getCornerRadius(cr: Block["cornerRadius"]): string {
  switch (cr) {
    case "4":    return "4px";
    case "8":    return "8px";
    case "24":   return "24px";
    case "pill": return "9999px";
    default:     return "8px";
  }
}

// ─── Block canvas preview ─────────────────────────────────────────────────────

export function BlockPreview({
  block,
  selected,
  onClick,
}: {
  block: Block;
  selected: boolean;
  onClick: () => void;
}) {
  const ring = selected
    ? "ring-2 ring-indigo-500 ring-offset-1"
    : "ring-1 ring-transparent hover:ring-indigo-200";
  const wrap = `relative rounded cursor-pointer transition-all ${ring}`;

  switch (block.type) {
    case "header":
      return (
        <div className={wrap} style={{ backgroundColor: block.bgColor }} onClick={onClick}>
          <div className={`p-8 ${alignClass(block.align)}`}>
            <h2 className="font-bold" style={{ color: block.textColor, fontSize: block.fontSize }}>
              {block.content || "Header"}
            </h2>
          </div>
        </div>
      );

    case "text":
      return (
        <div className={`p-4 ${wrap} ${alignClass(block.align)}`} onClick={onClick}>
          <p className="leading-relaxed whitespace-pre-wrap" style={{ color: block.textColor, fontSize: block.fontSize }}>
            {block.content || "Text block"}
          </p>
        </div>
      );

    case "image":
      return (
        <div className={`p-4 ${wrap} ${alignClass(block.align)}`} onClick={onClick}>
          {block.imageUrl ? (
            <img src={block.imageUrl} alt={block.imageAlt} className="max-w-full rounded mx-auto" />
          ) : (
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-36 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Image className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">Paste image URL in properties →</p>
              </div>
            </div>
          )}
        </div>
      );

    case "button": {
      const r = getCornerRadius(block.cornerRadius);
      const color = block.buttonColor || "#6366f1";
      const style = block.buttonStyle || "solid";
      const isFullWidth = block.buttonWidth === "full";

      let btnStyle: React.CSSProperties = { borderRadius: r, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "default" };
      if (style === "solid")    btnStyle = { ...btnStyle, backgroundColor: color, color: "#fff", border: "none" };
      if (style === "outlined") btnStyle = { ...btnStyle, backgroundColor: "transparent", color, border: `2px solid ${color}` };
      if (style === "text")     btnStyle = { ...btnStyle, backgroundColor: "transparent", color, border: "none", padding: "10px 0" };
      if (isFullWidth)          btnStyle.display = "block";

      return (
        <div className={`p-5 ${wrap} ${alignClass(block.align)}`} onClick={onClick}>
          <button style={btnStyle}>{block.buttonText || "Button"}</button>
        </div>
      );
    }

    case "divider": {
      const ls = block.lineStyle || "solid";
      const thick = block.thickness || "1";
      const color = block.lineColor || "#e5e7eb";
      const sp = block.spacing ?? 16;
      return (
        <div className={`px-4 ${wrap}`} style={{ paddingTop: sp, paddingBottom: sp }} onClick={onClick}>
          <hr style={{ borderStyle: ls, borderColor: color, borderTopWidth: `${thick}px`, borderBottom: "none", margin: 0 }} />
        </div>
      );
    }

    case "social": {
      const platforms = (block.socialPlatforms || DEFAULT_SOCIAL_PLATFORMS).filter(p => p.enabled);
      const iStyle = block.iconStyle || "colored";
      const iconSize = parseInt(block.iconSize || "24");
      const alignCls = block.socialAlignment === "center" ? "justify-center" : block.socialAlignment === "right" ? "justify-end" : "justify-start";
      const fontSize = iconSize >= 40 ? 13 : iconSize >= 32 ? 11 : 10;

      return (
        <div className={`p-4 ${wrap}`} onClick={onClick}>
          <div className={`flex flex-wrap gap-2 ${alignCls}`}>
            {platforms.map(p => {
              const bg    = iStyle === "monochrome" ? "#9ca3af" : (iStyle === "outline" ? "transparent" : p.color);
              const fgColor = iStyle === "outline" ? p.color : "#fff";
              const border  = iStyle === "outline" ? `1.5px solid ${p.color}` : "none";
              return (
                <span
                  key={p.id}
                  style={{
                    fontSize,
                    backgroundColor: bg,
                    color: fgColor,
                    border,
                    borderRadius: 4,
                    padding: "3px 8px",
                    fontWeight: 600,
                    letterSpacing: "0.3px",
                  }}
                >
                  {p.name}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    case "footer":
      return (
        <div className={`p-5 ${wrap} ${alignClass(block.align)}`} onClick={onClick}>
          <p style={{ color: block.textColor, fontSize: block.fontSize }}>{block.content}</p>
          {block.subContent && (
            <p className="mt-1" style={{ color: block.textColor, fontSize: block.fontSize }}>{block.subContent}</p>
          )}
        </div>
      );
  }
}

// ─── Properties panel ─────────────────────────────────────────────────────────

export function PropertiesPanel({
  block,
  onChange,
}: {
  block: Block;
  onChange: (partial: Partial<Block>) => void;
}) {
  const inputCls = "w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";
  const pillCls  = (active: boolean) =>
    `flex-1 px-2 py-1 rounded text-xs font-medium capitalize ${active ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`;

  return (
    <div className="space-y-4">
      {/* Alignment — most block types */}
      {block.type !== "divider" && block.type !== "social" && (
        <div>
          <label className={labelCls}>Alignment</label>
          <div className="flex gap-1">
            {(["left", "center", "right"] as const).map(a => (
              <button key={a} onClick={() => onChange({ align: a })} className={pillCls(block.align === a)}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {/* Header / Text / Footer ─ content + colors */}
      {(block.type === "header" || block.type === "text" || block.type === "footer") && (
        <>
          <div>
            <label className={labelCls}>Content</label>
            <textarea
              value={block.content || ""}
              onChange={e => onChange({ content: e.target.value })}
              rows={3}
              className={inputCls + " resize-none"}
            />
          </div>
          {block.type === "footer" && (
            <div>
              <label className={labelCls}>Sub-text</label>
              <input type="text" value={block.subContent || ""} onChange={e => onChange({ subContent: e.target.value })} className={inputCls} />
            </div>
          )}
          <div>
            <label className={labelCls}>Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={block.textColor || "#374151"} onChange={e => onChange({ textColor: e.target.value })} className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              <input type="text"  value={block.textColor || ""}        onChange={e => onChange({ textColor: e.target.value })} className={inputCls + " flex-1"} placeholder="#000000" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Font Size (px)</label>
            <input type="number" value={block.fontSize || 14} onChange={e => onChange({ fontSize: Number(e.target.value) })} min={10} max={48} className={inputCls} />
          </div>
        </>
      )}

      {/* Header — background color */}
      {block.type === "header" && (
        <div>
          <label className={labelCls}>Background Color</label>
          <div className="flex items-center gap-2">
            <input type="color" value={block.bgColor || "#6366f1"} onChange={e => onChange({ bgColor: e.target.value })} className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
            <input type="text"  value={block.bgColor || ""}        onChange={e => onChange({ bgColor: e.target.value })} className={inputCls + " flex-1"} />
          </div>
        </div>
      )}

      {/* Image */}
      {block.type === "image" && (
        <>
          <div>
            <label className={labelCls}>Image URL</label>
            <input type="text" value={block.imageUrl || ""} onChange={e => onChange({ imageUrl: e.target.value })} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Alt Text</label>
            <input type="text" value={block.imageAlt || ""} onChange={e => onChange({ imageAlt: e.target.value })} className={inputCls} />
          </div>
        </>
      )}

      {/* Button */}
      {block.type === "button" && (
        <>
          <div>
            <label className={labelCls}>Button Text</label>
            <input type="text" value={block.buttonText || ""} onChange={e => onChange({ buttonText: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Link URL</label>
            <input type="text" value={block.buttonLink || ""} onChange={e => onChange({ buttonLink: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={block.buttonColor || "#6366f1"} onChange={e => onChange({ buttonColor: e.target.value })} className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              <input type="text"  value={block.buttonColor || ""}        onChange={e => onChange({ buttonColor: e.target.value })} className={inputCls + " flex-1"} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Style</label>
            <div className="flex gap-1">
              {(["solid", "outlined", "text"] as const).map(s => (
                <button key={s} onClick={() => onChange({ buttonStyle: s })} className={pillCls((block.buttonStyle || "solid") === s)}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Corner Radius</label>
            <div className="flex gap-1">
              {([["4", "4px"], ["8", "8px"], ["24", "24px"], ["pill", "Pill"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => onChange({ cornerRadius: val })} className={pillCls((block.cornerRadius || "8") === val)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Width</label>
            <div className="flex gap-1">
              {(["auto", "full"] as const).map(w => (
                <button key={w} onClick={() => onChange({ buttonWidth: w })} className={pillCls((block.buttonWidth || "auto") === w)} style={{ textTransform: "none" }}>
                  {w === "auto" ? "Auto" : "Full Width"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Divider */}
      {block.type === "divider" && (
        <>
          <div>
            <label className={labelCls}>Line Style</label>
            <div className="flex gap-1">
              {(["solid", "dashed", "dotted"] as const).map(s => (
                <button key={s} onClick={() => onChange({ lineStyle: s })} className={pillCls((block.lineStyle || "solid") === s)}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Thickness</label>
            <div className="flex gap-1">
              {(["1", "2"] as const).map(t => (
                <button key={t} onClick={() => onChange({ thickness: t })} className={pillCls((block.thickness || "1") === t)}>{t}px</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={block.lineColor || "#e5e7eb"} onChange={e => onChange({ lineColor: e.target.value })} className="w-8 h-8 rounded border border-gray-300 cursor-pointer" />
              <input type="text"  value={block.lineColor || ""}        onChange={e => onChange({ lineColor: e.target.value })} className={inputCls + " flex-1"} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Spacing (px)</label>
            <input type="number" value={block.spacing ?? 16} onChange={e => onChange({ spacing: Number(e.target.value) })} min={0} max={80} className={inputCls} />
          </div>
        </>
      )}

      {/* Social */}
      {block.type === "social" && (
        <>
          <div>
            <label className={labelCls}>Alignment</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map(a => (
                <button key={a} onClick={() => onChange({ socialAlignment: a })} className={pillCls((block.socialAlignment || "center") === a)}>{a}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Icon Size</label>
            <div className="flex gap-1">
              {(["24", "32", "40"] as const).map(s => (
                <button key={s} onClick={() => onChange({ iconSize: s })} className={pillCls((block.iconSize || "24") === s)}>{s}px</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Icon Style</label>
            <div className="flex gap-1">
              {(["colored", "monochrome", "outline"] as const).map(s => (
                <button key={s} onClick={() => onChange({ iconStyle: s })} className={pillCls((block.iconStyle || "colored") === s) + " text-[10px]"}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Platforms</label>
            <div className="space-y-2">
              {(block.socialPlatforms || DEFAULT_SOCIAL_PLATFORMS).map((p, i) => {
                const platforms = block.socialPlatforms || DEFAULT_SOCIAL_PLATFORMS.map(x => ({ ...x }));
                const updatePlatform = (patch: Partial<SocialPlatform>) => {
                  const next = platforms.map((x, j) => j === i ? { ...x, ...patch } : x);
                  onChange({ socialPlatforms: next });
                };
                return (
                  <div key={p.id} className="border border-gray-100 rounded-lg p-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">{p.name}</span>
                      <button
                        onClick={() => updatePlatform({ enabled: !p.enabled })}
                        className={`w-8 h-4 rounded-full transition-colors ${p.enabled ? "bg-indigo-500" : "bg-gray-200"}`}
                      >
                        <span className={`block w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 ${p.enabled ? "translate-x-4" : "translate-x-0"}`} />
                      </button>
                    </div>
                    {p.enabled && (
                      <input
                        type="text"
                        value={p.url}
                        onChange={e => updatePlatform({ url: e.target.value })}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
