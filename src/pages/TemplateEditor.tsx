import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Type, Image, MousePointerClick, Minus, Heading,
  FootprintsIcon, Trash2, GripVertical, Plus, ChevronUp, ChevronDown,
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
  { type: "text", icon: Type, label: "Text" },
  { type: "image", icon: Image, label: "Image" },
  { type: "button", icon: MousePointerClick, label: "Button" },
  { type: "divider", icon: Minus, label: "Divider" },
  { type: "footer", icon: FootprintsIcon, label: "Footer" },
];

function defaultBlock(type: BlockType): Omit<Block, "id"> {
  switch (type) {
    case "header":
      return { type, content: "Your Header Here", bgColor: "#6366f1", textColor: "#ffffff", align: "center", fontSize: 20 };
    case "text":
      return { type, content: "Add your text content here. You can edit this directly.", align: "left", fontSize: 14, textColor: "#374151" };
    case "image":
      return { type, imageUrl: "", imageAlt: "Image", align: "center" };
    case "button":
      return { type, buttonText: "Click Here", buttonLink: "https://", buttonColor: "#6366f1", align: "center" };
    case "divider":
      return { type };
    case "footer":
      return { type, content: "InfStones Inc. | 123 Blockchain Ave", subContent: "Unsubscribe | Manage Preferences", align: "center", textColor: "#9ca3af", fontSize: 12 };
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

function alignClass(align?: "left" | "center" | "right") {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

function BlockPreview({ block, selected, onClick }: { block: Block; selected: boolean; onClick: () => void }) {
  const ring = selected ? "ring-2 ring-indigo-500 ring-offset-1" : "ring-1 ring-transparent hover:ring-indigo-200";
  const wrap = `relative rounded cursor-pointer transition-all ${ring}`;

  switch (block.type) {
    case "header":
      return (
        <div className={wrap} style={{ backgroundColor: block.bgColor }} onClick={onClick}>
          <div className={`p-8 ${alignClass(block.align)}`}>
            <h2
              className="font-bold"
              style={{ color: block.textColor, fontSize: block.fontSize }}
            >
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
    case "button":
      return (
        <div className={`p-5 ${wrap} ${alignClass(block.align)}`} onClick={onClick}>
          <button
            className="px-6 py-2.5 text-white text-sm font-medium rounded-lg"
            style={{ backgroundColor: block.buttonColor || "#6366f1" }}
          >
            {block.buttonText || "Button"}
          </button>
        </div>
      );
    case "divider":
      return (
        <div className={`px-4 py-2 ${wrap}`} onClick={onClick}>
          <hr className="border-gray-300" />
        </div>
      );
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

function PropertiesPanel({
  block,
  onChange,
}: {
  block: Block;
  onChange: (partial: Partial<Block>) => void;
}) {
  const inputCls = "w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-4">
      {/* Alignment — for non-divider */}
      {block.type !== "divider" && (
        <div>
          <label className={labelCls}>Alignment</label>
          <div className="flex gap-1">
            {(["left", "center", "right"] as const).map((a) => (
              <button
                key={a}
                onClick={() => onChange({ align: a })}
                className={`flex-1 px-2 py-1 rounded text-xs font-medium capitalize ${
                  block.align === a ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header / Text / Footer specific */}
      {(block.type === "header" || block.type === "text" || block.type === "footer") && (
        <>
          <div>
            <label className={labelCls}>Content</label>
            <textarea
              value={block.content || ""}
              onChange={(e) => onChange({ content: e.target.value })}
              rows={3}
              className={inputCls + " resize-none"}
            />
          </div>
          {block.type === "footer" && (
            <div>
              <label className={labelCls}>Sub-text</label>
              <input
                type="text"
                value={block.subContent || ""}
                onChange={(e) => onChange({ subContent: e.target.value })}
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className={labelCls}>Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={block.textColor || "#374151"}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={block.textColor || ""}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className={inputCls + " flex-1"}
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Font Size (px)</label>
            <input
              type="number"
              value={block.fontSize || 14}
              onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
              min={10} max={48}
              className={inputCls}
            />
          </div>
        </>
      )}

      {/* Header bg color */}
      {block.type === "header" && (
        <div>
          <label className={labelCls}>Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={block.bgColor || "#6366f1"}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={block.bgColor || ""}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className={inputCls + " flex-1"}
            />
          </div>
        </div>
      )}

      {/* Image */}
      {block.type === "image" && (
        <>
          <div>
            <label className={labelCls}>Image URL</label>
            <input
              type="text"
              value={block.imageUrl || ""}
              onChange={(e) => onChange({ imageUrl: e.target.value })}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Alt Text</label>
            <input
              type="text"
              value={block.imageAlt || ""}
              onChange={(e) => onChange({ imageAlt: e.target.value })}
              className={inputCls}
            />
          </div>
        </>
      )}

      {/* Button */}
      {block.type === "button" && (
        <>
          <div>
            <label className={labelCls}>Button Text</label>
            <input
              type="text"
              value={block.buttonText || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Link URL</label>
            <input
              type="text"
              value={block.buttonLink || ""}
              onChange={(e) => onChange({ buttonLink: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Button Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={block.buttonColor || "#6366f1"}
                onChange={(e) => onChange({ buttonColor: e.target.value })}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={block.buttonColor || ""}
                onChange={(e) => onChange({ buttonColor: e.target.value })}
                className={inputCls + " flex-1"}
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
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [saved, setSaved] = useState(false);

  const selectedBlock = blocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: BlockType) {
    const newBlock: Block = { id: uid(), ...defaultBlock(type) };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedId(newBlock.id);
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
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <Link
          to="/templates"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="text-sm font-medium text-gray-900 border-none focus:outline-none focus:ring-0 bg-transparent min-w-40"
        />
        <div className="ml-auto">
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {saved ? "✓ Saved" : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar — block picker */}
        <div className="w-48 bg-white border-r border-gray-200 p-3 space-y-1 shrink-0 overflow-y-auto">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">
            Add Block
          </p>
          {BLOCK_DEFS.map((b) => (
            <button
              key={b.type}
              onClick={() => addBlock(b.type)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
            >
              <b.icon className="w-4 h-4 shrink-0" />
              <span>{b.label}</span>
              <Plus className="w-3 h-3 ml-auto opacity-50" />
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-3">
            <p className="text-xs text-gray-400 px-2">Click any block to add it to the canvas</p>
          </div>
        </div>

        {/* Center canvas */}
        <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {blocks.length === 0 && (
              <div className="p-16 text-center text-gray-400">
                <p className="text-sm">Click blocks on the left to add them here</p>
              </div>
            )}
            {blocks.map((block, idx) => (
              <div key={block.id} className="group relative">
                {/* Block controls overlay */}
                <div className="absolute right-2 top-2 z-10 hidden group-hover:flex items-center gap-1">
                  <button
                    onClick={() => moveBlock(block.id, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveBlock(block.id, 1)}
                    disabled={idx === blocks.length - 1}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-red-600 shadow-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="absolute left-1 top-1/2 -translate-y-1/2 z-10 hidden group-hover:flex">
                  <GripVertical className="w-4 h-4 text-gray-300" />
                </div>
                <BlockPreview
                  block={block}
                  selected={selectedId === block.id}
                  onClick={() => setSelectedId(block.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar — properties */}
        <div className="w-60 bg-white border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
          {selectedBlock ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Properties
                </p>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {selectedBlock.type}
                </span>
              </div>
              <PropertiesPanel
                block={selectedBlock}
                onChange={(partial) => updateBlock(selectedBlock.id, partial)}
              />
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => deleteBlock(selectedBlock.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Block
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 pt-8">
              <p className="text-xs">Select a block to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
