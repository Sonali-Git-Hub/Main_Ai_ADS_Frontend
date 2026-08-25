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
import { RepurposeModule } from './features/repurpose/RepurposeModule';
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
      case 'repurpose':
        return (
          <NoBrandGate moduleName="Content Repurposer">
            <RepurposeModule />
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
      case 'settings': return <DashboardModule />;
      case 'adminDashboard': return <AdminDashboardModule />;
      default: return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FD] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
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
      <SettingsModal />

      {/* Floating AISA Assistant Toggle Button (Hidden when drawer is open) */}
      {!isAISAAssistantOpen && (
        <button
          onClick={() => setIsAISAAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 group"
          title="Open AI Ads™ Chatbot Assistant"
        >
          <Bot className="w-6 h-6" />
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
