import React, { useState } from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { StoreFront } from './components/store/StoreFront';
import { TilePlaygroundWorkspace } from './components/playground/TilePlaygroundWorkspace';
import { AdminDashboard } from './components/admin/AdminDashboard';

type AppScreen = 'store' | 'playground' | 'admin';

const MainAppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('store');
  const { activeRoom, activeSurface, assignTileToSurface, setActiveViewMode } = useProject();

  const handleOpenPlayground = (productId?: string) => {
    if (productId && activeRoom && activeSurface) {
      assignTileToSurface(activeRoom.id, activeSurface.id, productId);
    }
    setActiveViewMode('room_preview');
    setCurrentScreen('playground');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitPlayground = () => {
    setCurrentScreen('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentScreen('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = () => {
    setCurrentScreen('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  switch (currentScreen) {
    case 'playground':
      return <TilePlaygroundWorkspace onExit={handleExitPlayground} />;
    case 'admin':
      return <AdminDashboard onBackToStore={handleBackToStore} />;
    case 'store':
    default:
      return (
        <StoreFront
          onOpenPlayground={handleOpenPlayground}
          onOpenAdmin={handleOpenAdmin}
        />
      );
  }
};

export default function App() {
  return (
    <ProjectProvider>
      <MainAppContent />
    </ProjectProvider>
  );
}
