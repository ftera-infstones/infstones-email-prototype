import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, ChevronUp, ChevronDown, Trash2, GripVertical } from "lucide-react";
import type { Block, BlockType } from "../mock/data";
import { uid, defaultBlock, loadTemplateBlocks, saveTemplateBlocks } from "../mock/data";
import { BLOCK_DEFS, BlockPreview, PropertiesPanel } from "../components/BlockEditor";

export default function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const templateId = id || "new";

  const [blocks, setBlocks]       = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("Untitled Template");
  const [saved, setSaved]         = useState(false);

  // Load blocks from localStorage (or defaults) on mount
  useEffect(() => {
    const loaded = loadTemplateBlocks(templateId);
    setBlocks(loaded);
    setSelectedId(loaded[0]?.id ?? null);
  }, [templateId]);

  const selectedBlock = blocks.find(b => b.id === selectedId) ?? null;

  function addBlock(type: BlockType) {
    const nb: Block = { id: uid(), ...defaultBlock(type) };
    setBlocks(prev => [...prev, nb]);
    setSelectedId(nb.id);
  }

  function updateBlock(id: string, partial: Partial<Block>) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...partial } : b));
  }

  function deleteBlock(id: string) {
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  }

  function handleSave() {
    saveTemplateBlocks(templateId, blocks);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col -m-6">
      {/* Toolbar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <Link to="/templates" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <input
          type="text"
          value={templateName}
          onChange={e => setTemplateName(e.target.value)}
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
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-2 mb-2">Add Block</p>
          {BLOCK_DEFS.map(b => (
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
                <div className="absolute right-2 top-2 z-10 hidden group-hover:flex items-center gap-1">
                  <button onClick={() => moveBlock(block.id, -1)} disabled={idx === 0}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button onClick={() => moveBlock(block.id, 1)} disabled={idx === blocks.length - 1}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-indigo-600 disabled:opacity-30 shadow-sm">
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button onClick={() => deleteBlock(block.id)}
                    className="p-1 rounded bg-white/90 border border-gray-200 text-gray-500 hover:text-red-600 shadow-sm">
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
        <div className="w-64 bg-white border-l border-gray-200 p-4 shrink-0 overflow-y-auto">
          {selectedBlock ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Properties</p>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium capitalize">
                  {selectedBlock.type}
                </span>
              </div>
              <PropertiesPanel block={selectedBlock} onChange={partial => updateBlock(selectedBlock.id, partial)} />
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => deleteBlock(selectedBlock.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Block
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
