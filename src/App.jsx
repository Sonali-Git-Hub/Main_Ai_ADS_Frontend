import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { AISAAssistantDrawer } from './components/layout/AISAAssistantDrawer';
import { QuickPostModal } from './components/modals/QuickPostModal';
import { ScraperOverlayModal } from './components/modals/ScraperOverlayModal';
import { CreditTopupModal } from './components/modals/CreditTopupModal';

// Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { BrandDnaModule } from './components/modules/BrandDnaModule';
import { StrategyModule } from './components/modules/StrategyModule';
import { SeoModule } from './components/modules/SeoModule';
import { CalendarModule } from './components/modules/CalendarModule';
import { ContentStudioModule } from './components/modules/ContentStudioModule';
import { CampaignBuilderModule } from './components/modules/CampaignBuilderModule';
import { CreativeStudioModule } from './components/modules/CreativeStudioModule';
import { RepurposeModule } from './components/modules/RepurposeModule';
import { AssetLibraryModule } from './components/modules/AssetLibraryModule';
import { ApprovalsDeskModule } from './components/modules/ApprovalsDeskModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { TeamRbacModule } from './components/modules/TeamRbacModule';
import { SettingsBillingModule } from './components/modules/SettingsBillingModule';

const MainContent = () => {
  const { activeModule } = useWorkspace();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <DashboardModule />;
      case 'brands': return <BrandDnaModule />;
      case 'strategy': return <StrategyModule />;
      case 'seo': return <SeoModule />;
      case 'calendar': return <CalendarModule />;
      case 'studio': return <ContentStudioModule />;
      case 'campaigns': return <CampaignBuilderModule />;
      case 'creative': return <CreativeStudioModule />;
      case 'repurpose': return <RepurposeModule />;
      case 'assets': return <AssetLibraryModule />;
      case 'approvals': return <ApprovalsDeskModule />;
      case 'analytics': return <AnalyticsModule />;
      case 'team': return <TeamRbacModule />;
      case 'settings': return <SettingsBillingModule />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Global Modals & Overlay Drawers */}
      <QuickPostModal />
      <ScraperOverlayModal />
      <CreditTopupModal />
      <AISAAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <MainContent />
    </WorkspaceProvider>
  );
}
