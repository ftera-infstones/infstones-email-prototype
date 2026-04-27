import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Type as TypeIcon,
  Image as ImageIcon,
  MousePointerClick,
  Minus,
  Heading,
  PanelBottom,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

type BlockType = "header" | "text" | "image" | "button" | "divider" | "footer";

interface Block {
  id: string;
  type: BlockType;
  content?: string;
  subContent?: string;
  bgColor?: string;
  textColor?: string;
  align?: "left" | "center" | "right";
  fontSize?: number;
  buttonText?: string;
  buttonLink?: string;
  buttonColor?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const BLOCK_DEFS: { type: BlockType; icon: React.ElementType; label: string }[] = [
  { type: "header", icon: Heading, label: "Header" },
  { type: "text", icon: TypeIcon, label: "Text" },
  { type: "image", icon: ImageIcon, label: "Image" },
  { type: "button", icon: MousePointerClick, label: "Button" },
  { type: "divider", icon: Minus, label: "Divider" },
  { type: "footer", icon: PanelBottom, label: "Footer" },
];

function defaultBlock(type: BlockType): Omit<Block, "id"> {
  switch (type) {
    case "header":
      return { type, content: "Your Header Here", bgColor: "#0B0E1E", textColor: "#ffffff", align: "center", fontSize: 22 };
    case "text":
      return {
        type,
        content: "Add your text content here. You can edit this directly from the properties panel.",
        align: "left",
        fontSize: 14,
        textColor: "#2A2E3F",
      };
    case "image":
      return { type, imageUrl: "", imageAlt: "Image", align: "center" };
    case "button":
      return { type, buttonText: "Click here", buttonLink: "https://", buttonColor: "#EDB500", align: "center" };
    case "divider":
      return { type };
    case "footer":
      return {
        type,
        content: "InfStones Inc. · 123 Blockchain Ave, San Francisco CA",
        subContent: "Unsubscribe · Manage preferences",
        align: "center",
        textColor: "#6B6E7B",
        fontSize: 12,
      };
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const INITIAL_BLOCKS: Block[] = [
  { id: uid(), ...defaultBlock("header") },
  { id: uid(), ...defaultBlock("text") },
  { id: uid(), ...defaultBlock("button") },
  { id: uid(), ...defaultBlock("divider") },
  { id: uid(), ...defaultBlock("footer") },
];

function textAlign(a?: Block["align"]): "left" | "center" | "right" {
  return a === "center" || a === "right" ? a : "left";
}

function BlockPreview({ block, selected, onClick }: { block: Block; selected: boolean; onClick: () => void }) {
  const cls = `block-wrap ${selected ? "selected" : ""}`;

  switch (block.type) {
    case "header":
      return (
        <div className={cls} onClick={onClick} style={{ background: block.bgColor }}>
          <div style={{ padding: 32, textAlign: textAlign(block.align) }}>
            <h2 style={{ margin: 0, color: block.textColor, fontSize: block.fontSize, fontWeight: 700 }}>
              {block.content || "Header"}
            </h2>
          </div>
        </div>
      );
    case "text":
      return (
        <div className={cls} onClick={onClick} style={{ padding: 20, textAlign: textAlign(block.align) }}>
          <p style={{ margin: 0, color: block.textColor, fontSize: block.fontSize, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {block.content || "Text block"}
          </p>
        </div>
      );
    case "image":
      return (
        <div className={cls} onClick={onClick} style={{ padding: 20, textAlign: textAlign(block.align) }}>
          {block.imageUrl ? (
            <img src={block.imageUrl} alt={block.imageAlt} style={{ maxWidth: "100%", borderRadius: 6 }} />
          ) : (
            <div
              className="placeholder-img"
              style={{
                background:
                  "repeating-linear-gradient(-45deg, var(--bg-sunken) 0, var(--bg-sunken) 8px, var(--surface-2) 8px, var(--surface-2) 16px)",
                height: 140,
                display: "grid",
                placeItems: "center",
                borderRadius: 8,
                color: "var(--muted-2)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Paste image URL →
            </div>
          )}
        </div>
      );
    case "button":
      return (
        <div className={cls} onClick={onClick} style={{ padding: 20, textAlign: textAlign(block.align) }}>
          <button
            type="button"
            style={{
              padding: "10px 22px",
              color: "#0B0E1E",
              background: block.buttonColor,
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {block.buttonText || "Button"}
          </button>
        </div>
      );
    case "divider":
      return (
        <div className={cls} onClick={onClick} style={{ padding: "8px 20px" }}>
          <hr style={{ border: 0, borderTop: "1px solid var(--hairline)", margin: 0 }} />
        </div>
      );
    case "footer":
      return (
        <div className={cls} onClick={onClick} style={{ padding: 20, textAlign: textAlign(block.align) }}>
          <p style={{ margin: 0, color: block.textColor, fontSize: block.fontSize }}>{block.content}</p>
          {block.subContent && (
            <p style={{ margin: "4px 0 0", color: block.textColor, fontSize: block.fontSize }}>{block.subContent}</p>
          )}
        </div>
      );
  }
}

function PropertiesPanel({ block, onChange }: { block: Block; onChange: (partial: Partial<Block>) => void }) {
  const showText = block.type === "header" || block.type === "text" || block.type === "footer";

  return (
    <div className="vstack" style={{ gap: 14 }}>
      {block.type !== "divider" && (
        <div className="field">
          <label className="field-label">Alignment</label>
          <div className="segmented">
            {(["left", "center", "right"] as const).map((a) => (
              <button key={a} className={block.align === a ? "active" : ""} onClick={() => onChange({ align: a })}>
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {showText && (
        <>
          <div className="field">
            <label className="field-label">Content</label>
            <textarea
              className="textarea"
              value={block.content || ""}
              rows={3}
              onChange={(e) => onChange({ content: e.target.value })}
            />
          </div>
          {block.type === "footer" && (
            <div className="field">
              <label className="field-label">Sub-text</label>
              <input
                className="input"
                value={block.subContent || ""}
                onChange={(e) => onChange({ subContent: e.target.value })}
              />
            </div>
          )}
          <div className="field">
            <label className="field-label">Text color</label>
            <div className="hstack" style={{ gap: 8 }}>
              <input
                type="color"
                value={block.textColor || "#2A2E3F"}
                onChange={(e) => onChange({ textColor: e.target.value })}
                style={{ width: 32, height: 32, padding: 0, border: "1px solid var(--hairline)", borderRadius: 6, cursor: "pointer" }}
              />
              <input
                className="input"
                value={block.textColor || ""}
                onChange={(e) => onChange({ textColor: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label className="field-label">Font size (px)</label>
            <input
              className="input"
              type="number"
              min={10}
              max={48}
              value={block.fontSize || 14}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            />
          </div>
        </>
      )}

      {block.type === "header" && (
        <div className="field">
          <label className="field-label">Background</label>
          <div className="hstack" style={{ gap: 8 }}>
            <input
              type="color"
              value={block.bgColor || "#0B0E1E"}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              style={{ width: 32, height: 32, padding: 0, border: "1px solid var(--hairline)", borderRadius: 6, cursor: "pointer" }}
            />
            <input
              className="input"
              value={block.bgColor || ""}
              onChange={(e) => onChange({ bgColor: e.target.value })}
            />
          </div>
        </div>
      )}

      {block.type === "image" && (
        <>
          <div className="field">
            <label className="field-label">Image URL</label>
            <input
              className="input"
              value={block.imageUrl || ""}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="field">
            <label className="field-label">Alt text</label>
            <input
              className="input"
              value={block.imageAlt || ""}
              onChange={(e) => onChange({ imageAlt: e.target.value })}
            />
          </div>
        </>
      )}

      {block.type === "button" && (
        <>
          <div className="field">
            <label className="field-label">Button text</label>
            <input
              className="input"
              value={block.buttonText || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-label">Link URL</label>
            <input
              className="input"
              value={block.buttonLink || ""}
              onChange={(e) => onChange({ buttonLink: e.target.value })}
            />
          </div>
          <div className="field">
            <label className="field-label">Button color</label>
            <div className="hstack" style={{ gap: 8 }}>
              <input
                type="color"
                value={block.buttonColor || "#EDB500"}
                onChange={(e) => onChange({ buttonColor: e.target.value })}
                style={{ width: 32, height: 32, padding: 0, border: "1px solid var(--hairline)", borderRadius: 6, cursor: "pointer" }}
              />
              <input
                className="input"
                value={block.buttonColor || ""}
                onChange={(e) => onChange({ buttonColor: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function TemplateEditor() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_BLOCKS[0].id);
  const [templateName, setTemplateName] = useState("Untitled template");
  const [saved, setSaved] = useState(false);

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: BlockType) {
    const block: Block = { id: uid(), ...defaultBlock(type) };
    setBlocks((prev) => [...prev, block]);
    setSelectedId(block.id);
  }
  function updateBlock(id: string, partial: Partial<Block>) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...partial } : b)));
  }
  function deleteBlock(id: string) {
    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }
  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }
  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="page-inner full">
      <div className="editor-shell">
        <div className="editor-bar">
          <Link to="/templates" className="btn btn-ghost btn-sm" style={{ paddingLeft: 4 }}>
            <ArrowLeft size={14} />
            Back
          </Link>
          <input
            className="name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name"
          />
          <span className="muted" style={{ fontSize: 12 }}>
            {blocks.length} block{blocks.length === 1 ? "" : "s"}
          </span>
          <div className="spacer" />
          <button className="btn btn-secondary">Preview</button>
          <button className="btn btn-primary" onClick={save}>
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>

        <div className="editor-body">
          <aside className="editor-rail">
            <div className="rail-title">Add block</div>
            <div className="vstack" style={{ gap: 4 }}>
              {BLOCK_DEFS.map((b) => {
                const Icon = b.icon;
                return (
                  <button key={b.type} type="button" className="rail-item" onClick={() => addBlock(b.type)}>
                    <Icon size={14} />
                    <span>{b.label}</span>
                    <Plus size={12} style={{ marginLeft: "auto", color: "var(--muted-2)" }} />
                  </button>
                );
              })}
            </div>
            <hr className="hr" />
            <p className="muted" style={{ fontSize: 11, margin: "0 8px" }}>
              Click any block on the canvas to edit its properties on the right.
            </p>
          </aside>

          <section className="editor-canvas">
            <div className="canvas-sheet">
              {blocks.length === 0 && (
                <div className="empty" style={{ padding: "80px 20px" }}>
                  <h3>No blocks yet</h3>
                  <p>Add a header, text, or button from the left rail to get started.</p>
                </div>
              )}
              {blocks.map((block, i) => (
                <div key={block.id} style={{ position: "relative" }}>
                  <div className={`block-wrap ${selected?.id === block.id ? "selected" : ""}`} style={{ position: "relative" }}>
                    <BlockPreview
                      block={block}
                      selected={selected?.id === block.id}
                      onClick={() => setSelectedId(block.id)}
                    />
                    <div className="block-ctrls">
                      <button
                        title="Move up"
                        disabled={i === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, -1);
                        }}
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button
                        title="Move down"
                        disabled={i === blocks.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          moveBlock(block.id, 1);
                        }}
                      >
                        <ChevronDown size={12} />
                      </button>
                      <button
                        title="Delete"
                        className="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="editor-rail right">
            {selected ? (
              <>
                <div className="hstack" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <div className="rail-title" style={{ padding: 0 }}>
                    Properties
                  </div>
                  <span className="badge member">{selected.type}</span>
                </div>
                <PropertiesPanel
                  block={selected}
                  onChange={(partial) => updateBlock(selected.id, partial)}
                />
                <hr className="hr" />
                <button
                  className="btn btn-danger"
                  style={{ width: "100%" }}
                  onClick={() => deleteBlock(selected.id)}
                >
                  <Trash2 size={14} />
                  Delete block
                </button>
              </>
            ) : (
              <div className="empty" style={{ padding: 32 }}>
                <p>Select a block to edit its properties.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
