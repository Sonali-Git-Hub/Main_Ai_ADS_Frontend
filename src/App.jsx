import React from 'react';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NoBrandGate } from './components/layout/NoBrandGate';
import { Bot } from 'lucide-react';

// Feature Modules (Modular Architecture)
import { DashboardModule } from './features/dashboard/DashboardModule';
import { BrandDnaModule } from './features/brandDna/BrandDnaModule';
import { ScraperOverlayModal } from './features/brandDna/ScraperOverlayModal';
import { StrategyModule } from './features/strategy/StrategyModule';
import { SeoModule } from './features/seo/SeoModule';
import { CalendarModule } from './features/calendar/CalendarModule';
import { ContentStudioModule } from './features/contentStudio/ContentStudioModule';
import { AIWebsiteBuilderModule } from './features/websiteBuilder/AIWebsiteBuilderModule';
import { QuickPostModal } from './features/contentStudio/QuickPostModal';
import { CampaignBuilderModule } from './features/campaigns/CampaignBuilderModule';
import { CreativeStudioModule } from './features/creativeStudio/CreativeStudioModule';
import { CreditTopupModal } from './features/creativeStudio/CreditTopupModal';
import { AssetLibraryModule } from './features/assetLibrary/AssetLibraryModule';
import { ApprovalsDeskModule } from './features/approvals/ApprovalsDeskModule';
import { AnalyticsModule } from './features/analytics/AnalyticsModule';
import { TeamRbacModule } from './features/teamRbac/TeamRbacModule';
import { SettingsBillingModule } from './features/settingsBilling/SettingsBillingModule';
import { SettingsModal } from './features/settingsBilling/SettingsModal';
import { AISAAssistantDrawer } from './features/aisaAssistant/AISAAssistantDrawer';
import { Login } from './features/auth/Login';
import { AdminDashboardModule } from './features/admin/AdminDashboard';
import { AdminLayout } from './components/layout/AdminLayout';

const MainContent = () => {
  const { activeModule, isAISAAssistantOpen, setIsAISAAssistantOpen, user, loginUser } = useWorkspace();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }
  }, [activeModule]);

  if (!user) {
    return <Login onLoginSuccess={loginUser} />;
  }

  // If the user is our dedicated Super Admin, render the entirely separate admin flow
  if (user.role === 'SuperAdmin') {
    return <AdminLayout />;
  }


  const isWebsiteBuilder = ['websiteBuilder', 'websitebuilder', 'builder'].includes(activeModule);

  if (isWebsiteBuilder) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-[#070A11] text-slate-100">
        <AIWebsiteBuilderModule />
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <NoBrandGate moduleName="Dashboard">
            <DashboardModule />
          </NoBrandGate>
        );
      case 'brands': return <BrandDnaModule />;
      case 'strategy':
        return (
          <NoBrandGate moduleName="Marketing Strategy & Roadmap">
            <StrategyModule />
          </NoBrandGate>
        );
      case 'seo':
        return (
          <NoBrandGate moduleName="SEO Intelligence & Brief Builder">
            <SeoModule />
          </NoBrandGate>
        );
      case 'calendar':
        return (
          <NoBrandGate moduleName="Content Calendar">
            <CalendarModule />
          </NoBrandGate>
        );
      case 'studio':
        return (
          <NoBrandGate moduleName="Content Studio">
            <ContentStudioModule />
          </NoBrandGate>
        );
      case 'websiteBuilder':
      case 'websitebuilder':
      case 'builder':
        return (
          <NoBrandGate moduleName="AI Website Builder">
            <AIWebsiteBuilderModule />
          </NoBrandGate>
        );
      case 'campaigns':
        return (
          <NoBrandGate moduleName="Campaign Builder">
            <CampaignBuilderModule />
          </NoBrandGate>
        );
      case 'creative':
        return (
          <NoBrandGate moduleName="Creative Studio">
            <CreativeStudioModule />
          </NoBrandGate>
        );
      case 'assets':
        return (
          <NoBrandGate moduleName="Asset Library">
            <AssetLibraryModule />
          </NoBrandGate>
        );
      case 'approvals':
        return (
          <NoBrandGate moduleName="Approvals Desk">
            <ApprovalsDeskModule />
          </NoBrandGate>
        );
      case 'analytics':
        return (
          <NoBrandGate moduleName="Analytics">
            <AnalyticsModule />
          </NoBrandGate>
        );
      case 'team': return <TeamRbacModule />;
      case 'settings': return <SettingsBillingModule />;
      case 'adminDashboard': return <AdminDashboardModule />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <main className="p-3 sm:p-4 lg:p-5 flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {renderModule()}
        </main>
      </div>

      {/* Feature Modals & Overlay Drawers */}
      <QuickPostModal />
      <ScraperOverlayModal />
      <CreditTopupModal />
      <AISAAssistantDrawer />
      <SettingsModal />

      {/* Floating AISA Assistant Toggle Button (Hidden when drawer is open) */}
      {!isAISAAssistantOpen && (
        <button
          onClick={() => setIsAISAAssistantOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black shadow-2xl shadow-cyan-500/30 border-2 border-cyan-500/60 hover:border-cyan-400 p-0.5 transition-all hover:scale-110 active:scale-95 group overflow-hidden"
          title="Open AI Ads™ Chatbot Assistant"
        >
          <img
            src="/brain-icon-dark.jpg"
            alt="AI Ads™ Assistant"
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
          />
          {/* Live Pulsing Glow Ring */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-black"></span>
          </span>
        </button>
      )}
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
