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
  Edit2
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
    calculationResult,
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
    <header className="bg-charcoal text-ivory border-b border-border/20 px-4 sm:px-6 py-2.5 flex items-center justify-between z-30 select-none shadow-md">
      {/* Brand & Project Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onExitPlayground}
          className="flex items-center space-x-2 group text-left"
          title="Back to Krishna Tiles Home"
        >
          <div className="w-8 h-8 rounded-lg bg-brass flex items-center justify-center font-serif font-bold text-charcoal shadow-sm group-hover:scale-105 transition-transform">
            KT
          </div>
          <div className="hidden md:block">
            <span className="text-xs uppercase tracking-widest text-brass-light font-medium block">Krishna Tiles</span>
            <span className="text-[10px] text-stone-dark block -mt-0.5">The Live Tile Playground</span>
          </div>
        </button>

        <div className="h-6 w-[1px] bg-charcoal-muted hidden md:block" />

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
              className="bg-charcoal-soft border border-brass text-ivory px-2 py-0.5 rounded text-sm font-serif focus:outline-none"
            />
          ) : (
            <div 
              onClick={() => {
                setTitleDraft(project.title);
                setIsEditingTitle(true);
              }}
              className="flex items-center space-x-1.5 cursor-pointer hover:text-brass-light transition-colors group"
              title="Click to rename project"
            >
              <h1 className="text-sm font-serif font-medium tracking-wide">
                {project.title}
              </h1>
              <Edit2 className="w-3 h-3 text-muted group-hover:text-brass-light" />
            </div>
          )}

          {/* Saved Status Indicator */}
          <span className="text-[10px] font-mono text-muted-light hidden lg:inline-flex items-center space-x-1 bg-charcoal-soft px-2 py-0.5 rounded">
            {saveStatus === 'saving' ? (
              <span className="text-amber-400">Saving changes...</span>
            ) : (
              <span className="text-emerald-400 flex items-center">
                <Check className="w-2.5 h-2.5 mr-0.5" /> All changes saved
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Center View Mode Switcher */}
      <div className="hidden lg:flex items-center bg-charcoal-soft p-1 rounded-xl border border-charcoal-muted/50 space-x-1">
        {viewModes.map(mode => {
          const Icon = mode.icon;
          const isActive = activeViewMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setActiveViewMode(mode.id)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-brass text-charcoal shadow-sm' 
                  : 'text-stone hover:text-ivory hover:bg-charcoal/50'
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
        <div className="flex items-center space-x-0.5 bg-charcoal-soft rounded-lg p-0.5 border border-charcoal-muted/40">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo ? 'text-ivory hover:bg-charcoal' : 'text-muted/40 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo ? 'text-ivory hover:bg-charcoal' : 'text-muted/40 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-1.5 text-stone hover:text-ivory hover:bg-charcoal-soft rounded-lg transition-colors hidden sm:block relative"
          title="Share Project Link"
        >
          <Share2 className="w-4 h-4" />
          {showShareToast && (
            <div className="absolute right-0 top-10 bg-charcoal text-ivory text-[10px] px-2 py-1 rounded shadow-modal whitespace-nowrap border border-brass">
              Project link copied!
            </div>
          )}
        </button>

        {/* Print / PDF Estimate */}
        <button
          onClick={onOpenPdf}
          className="p-1.5 text-stone hover:text-ivory hover:bg-charcoal-soft rounded-lg transition-colors hidden sm:block"
          title="Print or Export PDF Estimate"
        >
          <Printer className="w-4 h-4" />
        </button>

        {/* Project Templates / Reset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowResetDropdown(!showResetDropdown)}
            className="p-1.5 text-stone hover:text-ivory hover:bg-charcoal-soft rounded-lg transition-colors"
            title="Project Options & Templates"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {showResetDropdown && (
            <div className="absolute right-0 top-10 w-48 bg-charcoal border border-charcoal-muted rounded-xl shadow-modal py-1.5 z-40 text-xs">
              <button
                onClick={() => {
                  resetProjectToDefault();
                  setShowResetDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-stone hover:text-ivory hover:bg-charcoal-soft transition-colors"
              >
                Load Chettinad Villa Demo
              </button>
              <button
                onClick={() => {
                  resetProjectToBlank();
                  setShowResetDropdown(false);
                }}
                className="w-full text-left px-3 py-2 text-stone hover:text-ivory hover:bg-charcoal-soft transition-colors"
              >
                Start Blank Project
              </button>
            </div>
          )}
        </div>

        {/* Request Quotation Primary CTA */}
        <button
          onClick={onRequestQuote}
          className="flex items-center space-x-1.5 bg-brass hover:bg-brass-light text-charcoal font-semibold px-3.5 py-1.5 rounded-lg text-xs shadow-sm hover:shadow-brass-glow transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Request Quotation</span>
        </button>
      </div>
    </header>
  );
};
