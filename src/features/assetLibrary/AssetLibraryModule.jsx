import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  FolderKanban, Search, Download, ExternalLink,
  FileText, Share2, Mail, Newspaper, Layers, Check, ArrowRight,
  Copy, Eye, X, Calendar, Tag, Trash2, FolderOpen, Sparkles
} from 'lucide-react';

// ━━━ Content Studio Aligned Asset Sections ━━━━━━━━━━━━━━━━━━━━━
const ASSET_SECTIONS = [
  {
    id: 'ALL',
    title: 'All Assets',
    subtitle: 'Complete Brand Vault & Cloud Repository',
    icon: FolderKanban,
    colorClass: 'from-indigo-500/10 to-purple-500/5',
    hoverBorder: 'hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    iconColor: 'text-indigo-500',
    studioTab: 'BLOG'
  },
  {
    id: 'BLOG',
    title: 'Blog',
    subtitle: 'Articles, Guides & SEO Copy',
    icon: FileText,
    colorClass: 'from-blue-500/10 to-cyan-500/5',
    hoverBorder: 'hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    iconColor: 'text-blue-500',
    studioTab: 'BLOG'
  },
  {
    id: 'SOCIAL',
    title: 'Social Media',
    subtitle: 'Posts, Carousels & Reels',
    icon: Share2,
    colorClass: 'from-purple-500/10 to-pink-500/5',
    hoverBorder: 'hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    badgeBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    iconColor: 'text-purple-500',
    studioTab: 'SOCIAL'
  },
  {
    id: 'EMAIL',
    title: 'Email / Letter',
    subtitle: 'Newsletters & Cold Outreach',
    icon: Mail,
    colorClass: 'from-emerald-500/10 to-teal-500/5',
    hoverBorder: 'hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    iconColor: 'text-emerald-500',
    studioTab: 'EMAIL'
  }
];

// ━━━ Format Date ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const formatDate = (iso) => {
  if (!iso) return 'Recent';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ━━━ Clean Article Text Helper ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const cleanText = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  return raw
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[\s*_-]{3,}\s*$/gm, '')
    .replace(/^\*\s+/gm, '• ')
    .replace(/^-\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ━━━ Asset Detail Drawer / Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AssetDetailDrawer = ({ asset, onClose, onDelete }) => {
  if (!asset) return null;
  const [copiedContent, setCopiedContent] = useState(false);

  const typeColors = {
    BLOG: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    SOCIAL: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    EMAIL: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    NEWSPAPER: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    CAROUSEL: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
  };

  const handleCopyContent = () => {
    const textToCopy = asset.content || asset.url || asset.name;
    navigator.clipboard.writeText(textToCopy);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const isVisual = asset.url && (asset.url.startsWith('http') || asset.url.startsWith('data:image'));
  const cleanedBody = cleanText(asset.content);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl mx-auto border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header Preview Banner */}
        <div className="relative aspect-video max-h-[260px] bg-slate-950 shrink-0 overflow-hidden">
          {isVisual ? (
            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 p-6 text-center">
              <FileText className="w-12 h-12 text-brand-400 mb-2 opacity-80" />
              <p className="text-sm font-extrabold text-white line-clamp-2 max-w-md">{asset.name}</p>
            </div>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${typeColors[asset.type] || 'bg-brand-500/10 text-brand-400 border-brand-500/30'}`}>
            {asset.type || 'DOCUMENT'}
          </span>
        </div>

        {/* Details & Body */}
        <div className="p-6 space-y-4 overflow-y-auto font-sans flex-1">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{asset.name}</h2>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-brand-500" /> {formatDate(asset.date)}</span>
                <span>&bull;</span>
                <span>Type: <strong className="text-slate-700 dark:text-slate-300">{asset.type}</strong></span>
              </div>
            </div>
            {onDelete && (
              <button
                onClick={() => { onDelete(asset.id); onClose(); }}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Full Text / Copy Content Section */}
          {cleanedBody && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Asset Content</span>
                <button
                  onClick={handleCopyContent}
                  className="text-[11px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3 h-3" /> {copiedContent ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans">
                {cleanedBody}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCopyContent}
              className="flex-1 btn-secondary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" /> {copiedContent ? 'Copied Text!' : 'Copy Content'}
            </button>
            {isVisual && (
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                download={`asset_${asset.id}.jpg`}
                className="flex-1 btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Download Asset
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
  const { activeWorkspace, t, globalAssets = [], removeGlobalAsset, setActiveModule, studioTarget, setStudioTarget } = useWorkspace();
  const [activeSection, setActiveSection] = useState(() => {
    return studioTarget?.assetTab || studioTarget?.targetTab || 'ALL';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    if (studioTarget?.assetTab || studioTarget?.targetTab) {
      setActiveSection(studioTarget.assetTab || studioTarget.targetTab);
    }
  }, [studioTarget]);

  const currentWsId = activeWorkspace?._id || activeWorkspace?.id;
  const currentBrand = activeWorkspace?.brandName;

  // Filter assets dynamically by workspace/brand
  const assets = globalAssets.filter(a => {
    if (!a.workspaceId && !a.metadata?.brand) return true;
    return a.workspaceId === currentWsId || a.metadata?.brand === currentBrand;
  });

  const matchesCategory = (asset, sectionId) => {
    if (sectionId === 'ALL') return true;
    const type = (asset.type || asset.category || '').toUpperCase();
    const plat = (asset.metadata?.platform || '').toUpperCase();
    if (sectionId === 'BLOG') return type === 'BLOG' || plat === 'BLOG' || type === 'SEO';
    if (sectionId === 'SOCIAL') return type === 'SOCIAL' || type === 'IMAGE' || type === 'CAROUSEL' || type === 'AD' || plat === 'INSTAGRAM' || plat === 'FACEBOOK' || plat === 'LINKEDIN';
    if (sectionId === 'EMAIL') return type === 'EMAIL' || plat === 'EMAIL';
    return type === sectionId;
  };

  const filteredAssets = assets.filter(a =>
    matchesCategory(a, activeSection) &&
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sectionCounts = {
    ALL: assets.length,
    BLOG: assets.filter(a => matchesCategory(a, 'BLOG')).length,
    SOCIAL: assets.filter(a => matchesCategory(a, 'SOCIAL')).length,
    EMAIL: assets.filter(a => matchesCategory(a, 'EMAIL')).length,
  };

  const copyUrl = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const typeColors = {
    BLOG: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    SOCIAL: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    EMAIL: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    CAROUSEL: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-[1600px] mx-auto p-6">

      {/* ━━━ Header Bar ━━━ */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Central {t('assetLibraryTitle', 'Asset Library')} & Content Vault</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Dynamic storage vault for all generated blogs, social posts, and email campaigns for <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved assets..."
            className="glass-input text-xs pl-8 py-2.5 pr-4 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 font-medium w-64"
          />
        </div>
      </div>

      {/* ━━━ Category Reference Cards (Matching Content Studio Style) ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ASSET_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;
          const count = sectionCounts[sec.id] || 0;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`p-5 rounded-3xl text-left transition-all duration-300 border flex flex-col justify-between group relative overflow-hidden bg-white dark:bg-slate-900/60 shadow-sm ${
                isSelected
                  ? 'border-brand-500 dark:border-brand-500 ring-2 ring-brand-500/20 bg-brand-500/5 dark:bg-brand-500/10 shadow-md'
                  : `border-slate-200 dark:border-slate-800 ${sec.hoverBorder}`
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${sec.colorClass} opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${sec.badgeBg} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className={`w-5 h-5 ${sec.iconColor}`} />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {count}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{sec.title}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{sec.subtitle}</p>
                </div>
              </div>

              <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span className={isSelected ? 'text-brand-600 dark:text-brand-400 font-extrabold' : ''}>
                  {isSelected ? 'Active Vault' : 'Filter Section'}
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-brand-600 dark:text-brand-400 font-bold">
                  View Assets <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ━━━ Dynamic Assets Grid ━━━ */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => {
            const isVisual = asset.url && (asset.url.startsWith('http') || asset.url.startsWith('data:image'));
            return (
              <div
                key={asset.id}
                className="p-4 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500/40 transition-all duration-300 space-y-3 group cursor-pointer hover:shadow-lg hover:shadow-brand-500/5 flex flex-col justify-between"
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 relative">
                  {isVisual ? (
                    <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 p-4 text-center">
                      <FileText className="w-8 h-8 text-brand-400 mb-1 opacity-70" />
                      <p className="text-[11px] font-bold text-slate-200 line-clamp-2">{asset.name}</p>
                    </div>
                  )}
                  <span className={`absolute top-2 right-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border shadow-sm ${typeColors[asset.type] || 'bg-brand-500/10 text-brand-400 border-brand-500/30'}`}>
                    {asset.type || 'DOCUMENT'}
                  </span>
                  
                  {/* Hover Quick-Inspect Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                      <Eye className="w-4 h-4" /> Open Asset
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs line-clamp-2 leading-snug">{asset.name}</h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                    <span>{formatDate(asset.date)}</span>
                    <span className="text-brand-600 dark:text-brand-400 font-bold">{asset.metadata?.platform ? asset.metadata.platform.toUpperCase() : (asset.type || 'ASSET')}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(asset.id, asset.content || asset.url || asset.name);
                    }}
                    className="w-full btn-secondary py-1.5 text-[11px] font-bold flex items-center justify-center gap-1 text-slate-600 dark:text-slate-300"
                  >
                    {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === asset.id ? 'Copied Content!' : 'Copy Text'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ━━━ Dynamic Empty State with Direct Link to Content Studio ━━━ */
        <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 flex items-center justify-center text-brand-500">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              No {activeSection === 'ALL' ? '' : activeSection} Assets in Vault
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              You haven't saved any {activeSection.toLowerCase()} assets for <strong>{activeWorkspace?.brandName || 'this brand'}</strong> yet. Generate high-velocity content in Content Studio and save it here.
            </p>
          </div>
          <button
            onClick={() => {
              if (setActiveModule) setActiveModule('content');
              if (window.location.pathname !== '/content-studio') {
                window.history.pushState({ module: 'content' }, '', '/content-studio');
              }
            }}
            className="btn-primary py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Open Content Studio
          </button>
        </div>
      )}

      {/* ━━━ Asset Detail Drawer ━━━ */}
      {selectedAsset && (
        <AssetDetailDrawer asset={selectedAsset} onClose={() => setSelectedAsset(null)} onDelete={removeGlobalAsset} />
      )}
    </div>
  );
};
