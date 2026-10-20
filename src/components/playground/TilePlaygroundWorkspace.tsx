import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { PlaygroundToolbar } from './PlaygroundToolbar';
import { ProjectHierarchyPanel } from './ProjectHierarchyPanel';
import { PropertiesInspectorPanel } from './PropertiesInspectorPanel';
import { PersistentEstimateDock } from './PersistentEstimateDock';
import { RoomPreviewCanvas } from '../canvas/RoomPreviewCanvas';
import { SurfacePlanCanvas } from '../canvas/SurfacePlanCanvas';
import { WallElevationCanvas } from '../canvas/WallElevationCanvas';
import { MaterialBoardCanvas } from '../canvas/MaterialBoardCanvas';
import { BudgetPlannerCanvas } from '../canvas/BudgetPlannerCanvas';
import { QuoteRequestModal } from '../modals/QuoteRequestModal';
import { PdfQuotationModal } from '../modals/PdfQuotationModal';

interface TilePlaygroundWorkspaceProps {
  onExit: () => void;
}

export const TilePlaygroundWorkspace: React.FC<TilePlaygroundWorkspaceProps> = ({
  onExit,
}) => {
  const { activeViewMode } = useProject();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Render active canvas based on viewMode
  const renderCanvas = () => {
    switch (activeViewMode) {
      case 'surface_plan':
        return <SurfacePlanCanvas />;
      case 'wall_elevation':
        return <WallElevationCanvas />;
      case 'material_board':
        return <MaterialBoardCanvas />;
      case 'budget_planner':
        return <BudgetPlannerCanvas />;
      case 'room_preview':
      default:
        return <RoomPreviewCanvas />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#EDE8DF]">
      {/* 1. Top Project Toolbar */}
      <PlaygroundToolbar
        onRequestQuote={() => setIsQuoteModalOpen(true)}
        onOpenPdf={() => setIsPdfModalOpen(true)}
        onExitPlayground={onExit}
      />

      {/* 2. Coordinated Main Region: Left Hierarchy, Center Canvas, Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Project Structure */}
        <ProjectHierarchyPanel />

        {/* Center Canvas: Live Material Playground */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {renderCanvas()}
        </main>

        {/* Right Panel: Properties & Tile Inspector */}
        <PropertiesInspectorPanel />
      </div>

      {/* 3. Persistent Estimate Dock */}
      <PersistentEstimateDock
        onRequestQuote={() => setIsQuoteModalOpen(true)}
      />

      {/* 4. Modals */}
      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

      <PdfQuotationModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
};
