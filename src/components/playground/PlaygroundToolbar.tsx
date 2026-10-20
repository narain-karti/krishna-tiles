import React, { useState } from 'react';
import { useProject, ViewMode } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { 
  RotateCcw, 
  RotateCw, 
  Eye, 
  Grid, 
  Layers, 
  Package, 
  Wallet, 
  Share2, 
  Printer, 
  FileText, 
  Check, 
  Sparkles,
  ChevronDown,
  Edit2,
  ArrowUpRight
} from 'lucide-react';

interface PlaygroundToolbarProps {
  onRequestQuote: () => void;
  onOpenPdf: () => void;
  onExitPlayground: () => void;
}

export const PlaygroundToolbar: React.FC<PlaygroundToolbarProps> = ({
  onRequestQuote,
  onOpenPdf,
  onExitPlayground,
}) => {
  const {
    project,
    updateProjectDetails,
    activeRoomId,
    setActiveRoomId,
    activeViewMode,
    setActiveViewMode,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    resetProjectToDefault,
    resetProjectToBlank,
  } = useProject();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(project.title);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showResetDropdown, setShowResetDropdown] = useState(false);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleDraft.trim()) {
      updateProjectDetails({ title: titleDraft.trim() });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const viewModes: { id: ViewMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'room_preview', label: 'Room 2.5D', icon: Eye },
    { id: 'surface_plan', label: 'Surface CAD', icon: Grid },
    { id: 'wall_elevation', label: 'Elevation', icon: Layers },
    { id: 'material_board', label: 'Materials', icon: Package },
    { id: 'budget_planner', label: 'Budget', icon: Wallet },
  ];

  return (
    <header className="bg-carbon text-white border-b border-carbon-border px-4 sm:px-6 py-3 flex items-center justify-between z-30 select-none shadow-md">
      {/* Brand & Project Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onExitPlayground}
          className="flex items-center space-x-2 group text-left"
          title="Back to Krishna Tiles Home"
        >
          <div className="flex items-center space-x-1.5">
            <span className="font-stencil text-2xl tracking-wider text-white">
              .KRISHNA
            </span>
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
          </div>
        </button>

        <div className="h-5 w-[1px] bg-carbon-border hidden md:block" />

        {/* Editable Title */}
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-carbon-card border border-neon text-white px-3 py-1 rounded-full text-xs font-semibold focus:outline-none"
            />
          ) : (
            <div 
              onClick={() => {
                setTitleDraft(project.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center space-x-2 cursor-pointer hover:text-neon transition-colors group"
              title="Click to rename project"
            >
              <h1 className="text-xs sm:text-sm font-bold tracking-wide">
                {project.title}
              </h1>
              <Edit2 className="w-3 h-3 text-muted group-hover:text-neon" />
            </div>
          )}

          {/* Saved Status Indicator */}
          <span className="text-[10px] font-mono text-muted-light hidden lg:inline-flex items-center space-x-1 bg-carbon-card px-2.5 py-0.5 rounded-full border border-carbon-border">
            {saveStatus === 'saving' ? (
              <span className="text-amber-400">Saving...</span>
            ) : (
              <span className="text-neon flex items-center">
                <Check className="w-2.5 h-2.5 mr-0.5" /> Saved
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Center View Mode Switcher */}
      <div className="hidden lg:flex items-center bg-carbon-card p-1 rounded-full border border-carbon-border space-x-1">
        {viewModes.map(mode => {
          const Icon = mode.icon;
          const isActive = activeViewMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveViewMode(mode.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-neon text-carbon shadow-neon-glow' 
                  : 'text-stone hover:text-white hover:bg-carbon-surface'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Tools */}
      <div className="flex items-center space-x-2">
        {/* Undo / Redo */}
        <div className="flex items-center space-x-0.5 bg-carbon-card rounded-full p-0.5 border border-carbon-border">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-full transition-colors ${
              canUndo ? 'text-white hover:bg-carbon' : 'text-muted/40 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-full transition-colors ${
              canRedo ? 'text-white hover:bg-carbon' : 'text-muted/40 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-2 text-stone hover:text-white hover:bg-carbon-card rounded-full transition-colors hidden sm:block relative"
          title="Share Project Link"
        >
          <Share2 className="w-4 h-4" />
          {showShareToast && (
            <div className="absolute right-0 top-10 bg-carbon text-white text-[10px] px-3 py-1 rounded-full shadow-modal whitespace-nowrap border border-neon">
              Project link copied!
            </div>
          )}
        </button>

        {/* Print / PDF Estimate */}
        <button
          onClick={onOpenPdf}
          className="p-2 text-stone hover:text-white hover:bg-carbon-card rounded-full transition-colors hidden sm:block"
          title="Print or Export PDF Estimate"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Project Templates / Reset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowResetDropdown(!showResetDropdown)}
            className="p-2 text-stone hover:text-white hover:bg-carbon-card rounded-full transition-colors"
            title="Project Options & Templates"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {showResetDropdown && (
            <div className="absolute right-0 top-11 w-48 bg-carbon-card border border-carbon-border rounded-2xl shadow-modal py-2 z-40 text-xs">
              <button
                onClick={() => {
                  resetProjectToDefault();
                  setShowResetDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-stone hover:text-white hover:bg-carbon-surface transition-colors font-medium"
              >
                Load Demo Villa
              </button>
              <button
                onClick={() => {
                  resetProjectToBlank();
                  setShowResetDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-stone hover:text-white hover:bg-carbon-surface transition-colors font-medium"
              >
                Start Blank Project
              </button>
            </div>
          )}
        </div>

        {/* Request Quotation Primary CTA (Neon Green Pill with Arrow) */}
        <button
          onClick={onRequestQuote}
          className="flex items-center space-x-2 bg-neon hover:bg-neon-light text-carbon font-extrabold px-4 py-2 rounded-full text-xs shadow-neon-glow hover:scale-105 transition-all group"
        >
          <span>Get Quote</span>
          <div className="w-4 h-4 rounded-full bg-carbon text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </button>
      </div>
    </header>
  );
};
