import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  FolderKanban, Search, Download, ExternalLink, Image as ImageIcon,
  FileText, Layers, Check, ArrowUpRight, Sparkles, Film, BookOpen,
  Copy, Eye, X, Calendar, Tag, Clock, Trash2, FolderOpen, LayoutGrid
} from 'lucide-react';

// ━━━ Section Card Data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ASSET_SECTIONS = [
  {
    id: 'ALL',
    title: 'All Assets',
    subtitle: 'Complete Brand Vault & Cloud Storage',
    icon: FolderKanban,
    colorClass: 'from-indigo-500/10 to-purple-500/5',
    hoverBorder: 'hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    iconColor: 'text-indigo-500',
    accentClass: 'border-indigo-500/30 bg-indigo-500/5'
  },
  {
    id: 'IMAGE',
    title: 'AI Visuals',
    subtitle: 'Generated Images, Banners & Graphics',
    icon: ImageIcon,
    colorClass: 'from-cyan-500/10 to-sky-500/5',
    hoverBorder: 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    iconColor: 'text-cyan-500',
    accentClass: 'border-cyan-500/30 bg-cyan-500/5'
  },
  {
    id: 'CAROUSEL',
    title: 'Carousels',
    subtitle: 'Slide Decks, Briefs & Multi-Frame Assets',
    icon: Layers,
    colorClass: 'from-purple-500/10 to-fuchsia-500/5',
    hoverBorder: 'hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500',
    accentClass: 'border-purple-500/30 bg-purple-500/5'
  },
  {
    id: 'DOCUMENT',
    title: 'Documents',
    subtitle: 'Scripts, Storyboards, Kits & PDFs',
    icon: FileText,
    colorClass: 'from-amber-500/10 to-orange-500/5',
    hoverBorder: 'hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    iconColor: 'text-amber-500',
    accentClass: 'border-amber-500/30 bg-amber-500/5'
  }
];

// ━━━ Format Date ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ━━━ Asset Detail Drawer ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AssetDetailDrawer = ({ asset, onClose }) => {
  if (!asset) return null;

  const typeColors = {
    IMAGE: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    CAROUSEL: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    DOCUMENT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg mx-4 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        {/* Image Preview */}
        <div className="relative aspect-video bg-slate-950">
          {asset.url && asset.url.startsWith('http') ? (
            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-slate-600" />
            </div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${typeColors[asset.type] || 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
            {asset.type}
          </span>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{asset.name}</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Created</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-brand-500" /> {formatDate(asset.date)}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Credits Used</span>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1 flex items-center gap-1.5">
                <Tag className="w-3 h-3" /> {asset.credits > 0 ? `${asset.credits} Credits` : 'Free'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => navigator.clipboard.writeText(asset.url)}
              className="flex-1 btn-secondary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Link
            </button>
            {asset.url && asset.url.startsWith('http') && (
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ━━━ Main Asset Library Module ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const AssetLibraryModule = () => {
  const { activeWorkspace, t, globalAssets = [] } = useWorkspace();
  const [activeSection, setActiveSection] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const initialAssets = [
    { id: 'ast_1', name: 'Cyberpunk Glassmorphism Background', type: 'IMAGE', url: 'https://picsum.photos/seed/aiads1/800/800', date: '2026-07-25', credits: 5 },
    { id: 'ast_2', name: 'Brand DNA 101 Carousel Slides', type: 'CAROUSEL', url: 'https://picsum.photos/seed/aiads2/800/800', date: '2026-07-24', credits: 10 },
    { id: 'ast_3', name: 'SEO Pillar Article Draft (PDF)', type: 'DOCUMENT', url: 'https://picsum.photos/seed/aiads3/800/800', date: '2026-07-22', credits: 0 },
    { id: 'ast_4', name: 'Modern B2B Executive Persona Visual', type: 'IMAGE', url: 'https://picsum.photos/seed/aiads4/800/800', date: '2026-07-20', credits: 5 },
    { id: 'ast_5', name: 'AI Campaign Launch Carousel', type: 'CAROUSEL', url: 'https://picsum.photos/seed/aiads5/800/800', date: '2026-07-18', credits: 10 },
    { id: 'ast_6', name: 'Brand Voice Tone Guidelines', type: 'DOCUMENT', url: 'https://picsum.photos/seed/aiads6/800/800', date: '2026-07-15', credits: 0 },
    { id: 'ast_7', name: 'Product Hero Shot — Dark Mode', type: 'IMAGE', url: 'https://picsum.photos/seed/aiads7/800/800', date: '2026-07-12', credits: 5 },
    { id: 'ast_8', name: 'Reel Script — Brand Launch 60s', type: 'DOCUMENT', url: 'https://picsum.photos/seed/aiads8/800/800', date: '2026-07-10', credits: 0 },
  ];

  const assets = [...globalAssets, ...initialAssets];

  const filteredAssets = assets.filter(a =>
    (activeSection === 'ALL' || a.type === activeSection) &&
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sectionCounts = {
    ALL: assets.length,
    IMAGE: assets.filter(a => a.type === 'IMAGE').length,
    CAROUSEL: assets.filter(a => a.type === 'CAROUSEL').length,
    DOCUMENT: assets.filter(a => a.type === 'DOCUMENT').length,
  };

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const typeColors = {
    IMAGE: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    CAROUSEL: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    DOCUMENT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  };

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* ━━━ Header Bar ━━━ */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Central {t('assetLibraryTitle', 'Asset Library')} & Cloud Storage Vault</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Stores every generated visual, document, carousel, and repurposed variant for <strong className="text-slate-900 dark:text-white">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="glass-input text-xs pl-8 py-2.5 pr-4 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 font-medium w-64"
          />
        </div>
      </div>

      {/* ━━━ 4 Section Cards (like Creative Studio) ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSET_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;
          const count = sectionCounts[sec.id] || 0;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-5 rounded-3xl text-left transition-all duration-300 border flex flex-col justify-between group relative overflow-hidden bg-white/80 dark:bg-slate-900/60 ${
                isSelected
                  ? 'border-brand-500 dark:border-brand-500 ring-2 ring-brand-500/20 bg-brand-500/5 dark:bg-brand-500/10 shadow-lg'
                  : `border-slate-200 dark:border-slate-800 ${sec.hoverBorder}`
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sec.colorClass} opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${sec.badgeBg} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className={`w-5 h-5 ${sec.iconColor}`} />
                  </div>
                  <ArrowUpRight className={`w-4 h-4 transition-all duration-300 ${isSelected ? 'text-brand-500 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'}`} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{sec.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{sec.subtitle}</p>
                </div>
              </div>
              <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>{isSelected ? 'Active Filter' : 'Select Category'}</span>
                <span className={`${sec.iconColor} opacity-80 group-hover:opacity-100 font-extrabold text-xs`}>{count} items</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ━━━ Assets Grid ━━━ */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              className="p-4 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition-all duration-300 space-y-3 group cursor-pointer hover:shadow-lg hover:shadow-brand-500/5"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                {asset.url && asset.url.startsWith('http') ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                    <FileText className="w-10 h-10 text-slate-600" />
                  </div>
                )}
                <span className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${typeColors[asset.type] || 'bg-slate-500/10 text-slate-400 border-slate-500/30'}`}>
                  {asset.type}
                </span>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs truncate">{asset.name}</h3>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  <span>{formatDate(asset.date)}</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{asset.credits > 0 ? `${asset.credits} Credits` : 'Free'}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={(e) => { e.stopPropagation(); copyUrl(asset.id, asset.url); }}
                  className="w-full btn-secondary py-1.5 text-[11px]"
                >
                  {copiedId === asset.id ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                  {copiedId === asset.id ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-14 h-14 rounded-3xl bg-brand-500/10 flex items-center justify-center">
            <FolderOpen className="w-7 h-7 text-brand-500" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">No Assets Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              No assets match your current filter. Generate content in <strong>Creative Studio</strong> or <strong>Content Studio</strong> and they will automatically appear here.
            </p>
          </div>
        </div>
      )}

      {/* ━━━ Asset Detail Drawer ━━━ */}
      {selectedAsset && (
        <AssetDetailDrawer asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  );
};
