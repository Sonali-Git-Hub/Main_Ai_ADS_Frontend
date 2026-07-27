import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';

// Feature Modules (Modular Architecture)
import { DashboardModule } from './features/dashboard/DashboardModule';
import { BrandDnaModule } from './features/brandDna/BrandDnaModule';
import { ScraperOverlayModal } from './features/brandDna/ScraperOverlayModal';
import { StrategyModule } from './features/strategy/StrategyModule';
import { SeoModule } from './features/seo/SeoModule';
import { CalendarModule } from './features/calendar/CalendarModule';
import { ContentStudioModule } from './features/contentStudio/ContentStudioModule';
import { QuickPostModal } from './features/contentStudio/QuickPostModal';
import { CampaignBuilderModule } from './features/campaigns/CampaignBuilderModule';
import { CreativeStudioModule } from './features/creativeStudio/CreativeStudioModule';
import { CreditTopupModal } from './features/creativeStudio/CreditTopupModal';
import { RepurposeModule } from './features/repurpose/RepurposeModule';
import { AssetLibraryModule } from './features/assetLibrary/AssetLibraryModule';
import { ApprovalsDeskModule } from './features/approvals/ApprovalsDeskModule';
import { AnalyticsModule } from './features/analytics/AnalyticsModule';
import { TeamRbacModule } from './features/teamRbac/TeamRbacModule';
import { SettingsBillingModule } from './features/settingsBilling/SettingsBillingModule';
import { AISAAssistantDrawer } from './features/aisaAssistant/AISAAssistantDrawer';

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
    <div className="flex min-h-screen bg-[#F8F9FD] dark:bg-[#090d16] text-slate-900 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Feature Modals & Overlay Drawers */}
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
