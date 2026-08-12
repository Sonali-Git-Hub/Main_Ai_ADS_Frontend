import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { websiteBuilderAPI } from '../../services/api';
import {
  Globe, Plus, FolderKanban, Layout, Rocket, Sparkles, Bot, Send,
  Monitor, Tablet, Smartphone, RefreshCw, CheckCircle2, Download, Trash2,
  ExternalLink, Eye, ArrowRight, Dna, ShieldCheck, Terminal, Layers
} from 'lucide-react';

import { NewWebsiteView } from './NewWebsiteView';

export const AIWebsiteBuilderModule = () => {
  const { activeWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState('NEW_WEBSITE'); // NEW_WEBSITE, MY_WEBSITES, TEMPLATES, DEPLOYMENTS
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [activeWorkspace]);

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await websiteBuilderAPI.listProjects({ workspaceId: activeWorkspace?._id || activeWorkspace?.id });
      if (res && res.projects) {
        setProjects(res.projects);
      }
    } catch (err) {
      console.log('Fetch projects note:', err.message);
    } finally {
      setLoadingProjects(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in w-full max-w-[1600px] mx-auto pb-12">
      {/* ── MODULE HEADER & SUB-NAV TABS ─────────────────────────────────── */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI Website Builder
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Describe your website or app idea and AI will design, build, and run it automatically.
            </p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('NEW_WEBSITE')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'NEW_WEBSITE'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> New Website
          </button>
          <button
            onClick={() => setActiveTab('MY_WEBSITES')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'MY_WEBSITES'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" /> My Websites ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'TEMPLATES'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={() => setActiveTab('DEPLOYMENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'DEPLOYMENTS'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Rocket className="w-4 h-4" /> Deployments
          </button>
        </div>
      </div>

      {/* ── TAB 1: NEW WEBSITE CREATION (ROBERT REQUIREMENT ENGINE) ─────────── */}
      {activeTab === 'NEW_WEBSITE' && <NewWebsiteView />}

      {/* ── TAB 2: MY WEBSITES LISTING VIEW ──────────────────────────────────── */}
      {activeTab === 'MY_WEBSITES' && (
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">My Generated Websites</h3>
              <p className="text-xs text-slate-500 font-medium">All websites built with AI Website Builder in this workspace.</p>
            </div>
            <button
              onClick={() => setActiveTab('NEW_WEBSITE')}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-extrabold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New
            </button>
          </div>

          {loadingProjects ? (
            <div className="py-12 text-center text-xs text-slate-500 font-bold">Loading website projects...</div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FolderKanban className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-bold">No saved website projects found.</p>
              <button
                onClick={() => setActiveTab('NEW_WEBSITE')}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Build Your First Website &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {projects.map((proj) => (
                <div key={proj.projectId} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">{proj.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Score: {proj.healthScore?.overall || 100}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">{proj.businessType} • {proj.industry}</p>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                    <span>Version: {proj.activeVersion}</span>
                    <span className="text-emerald-500 font-bold">{proj.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: TEMPLATES VIEW ────────────────────────────────────────────── */}
      {activeTab === 'TEMPLATES' && (
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Curated Business Starter Templates</h3>
            <p className="text-xs text-slate-500 font-medium">Select a preset business blueprint to accelerate generation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { title: '🍔 Gourmet Bakery & Cafe', type: 'Food & Bakery', desc: 'Product catalog, cart, online ordering, reviews and contact.' },
              { title: '🛍️ Fashion E-Commerce Store', type: 'Retail Store', desc: 'Product filtering, shopping cart, checkout and WhatsApp order.' },
              { title: '🤖 AI Support Assistant Widget', type: 'SaaS App', desc: 'Automated support Q&A bot with lead capture form.' },
              { title: '💼 Premium SaaS Landing Page', type: 'SaaS Marketing', desc: 'Hero section, feature grid, pricing tables, and lead popup.' },
              { title: '🏠 Real Estate Listing Portal', type: 'Property', desc: 'Property search, location maps, agent lead inquiry.' },
              { title: '🎓 Academy & Online School', type: 'Education', desc: 'Course catalog, instructor profiles, student registration.' }
            ].map((tmpl, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{tmpl.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{tmpl.desc}</p>
                <button
                  onClick={() => setActiveTab('NEW_WEBSITE')}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors mt-2"
                >
                  Use Template &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: DEPLOYMENTS VIEW ─────────────────────────────────────────── */}
      {activeTab === 'DEPLOYMENTS' && (
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Multi-Channel Deployments</h3>
            <p className="text-xs text-slate-500 font-medium">Manage deployment providers, subdomain bindings, and static ZIP exports.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-extrabold text-blue-400 uppercase">1. Free AI ADS Subdomain Provider</span>
              <p className="text-slate-300 font-mono">https://&lt;brandname&gt;.ai-ads.site</p>
              <span className="text-emerald-400 text-[10px] font-bold">● Provider Abstraction Ready</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] font-extrabold text-purple-400 uppercase">2. Static ZIP Bundle Exporter</span>
              <p className="text-slate-300 font-mono">my-app-static-bundle.zip</p>
              <span className="text-purple-400 text-[10px] font-bold">● Export Engine Ready</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
