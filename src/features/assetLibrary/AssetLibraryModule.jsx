import React, { useState, useEffect, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  FolderKanban, Search, Download, ExternalLink, Image as ImageIcon,
  FileText, Layers, Check, ArrowUpRight, Sparkles, Film, BookOpen,
  Copy, Eye, X, Calendar, Tag, Clock, Trash2, FolderOpen, LayoutGrid,
  CheckCircle2, ArrowLeft, Share2, Twitter, Linkedin, Mail, MessageCircle, Send, Link2
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

// ━━━ Direct Device Download Helper ━━━━━━━━━━━━━━━━━━━━━━━━━
const triggerDirectDeviceDownload = async (asset) => {
  if (!asset) return false;
  const cleanName = (asset.name || 'asset').replace(/[^a-z0-9_\- ]/gi, '_').slice(0, 60);

  // Case 1: Image or Remote URL -> Route through backend download proxy with Content-Disposition: attachment
  if (asset.url) {
    if (asset.url.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = asset.url;
      a.download = `${cleanName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }

    const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
    const proxyUrl = `${apiBase}/content/download-asset?url=${encodeURIComponent(asset.url)}&filename=${encodeURIComponent(cleanName)}`;

    // Trigger attachment download via hidden iframe (never navigates page or opens new tab)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = proxyUrl;
    document.body.appendChild(iframe);
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 6000);
    return true;
  }

  // Case 2: Pure Text Content (Document / Script without URL) -> Instant Client-Side Blob Download
  if (asset.content) {
    const blob = new Blob([asset.content], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${cleanName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    return true;
  }

  return false;
};

// ━━━ Asset Detail Drawer ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AssetDetailDrawer = ({ asset, onClose, onDelete }) => {
  if (!asset) return null;
  const [copiedContent, setCopiedContent] = useState(false);
  const [downloadedDrawer, setDownloadedDrawer] = useState(false);

  const typeColors = {
    IMAGE: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    CAROUSEL: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    DOCUMENT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(asset.content || asset.url || '');
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleDrawerDownload = async () => {
    await triggerDirectDeviceDownload(asset);
    setDownloadedDrawer(true);
    setTimeout(() => setDownloadedDrawer(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg mx-4 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Image / Header Preview */}
        <div className="relative aspect-video bg-slate-950 shrink-0">
          {asset.url && asset.url.startsWith('http') ? (
            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-center">
              <FileText className="w-12 h-12 text-brand-400 mb-2" />
              <p className="text-xs font-bold text-slate-300 line-clamp-2">{asset.name}</p>
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
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{asset.name}</h2>
            {onDelete && (
              <button
                onClick={() => { onDelete(asset.id); onClose(); }}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Delete Asset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

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

          {/* Full Text / Copy Content Section */}
          {asset.content && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Asset Content / Body</span>
                <button
                  onClick={handleCopyContent}
                  className="text-[10px] font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline"
                >
                  <Copy className="w-3 h-3" /> {copiedContent ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {asset.content}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCopyContent}
              className="flex-1 btn-secondary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" /> {copiedContent ? 'Copied Text!' : 'Copy Asset Content'}
            </button>
            <button
              onClick={handleDrawerDownload}
              className="flex-1 btn-primary py-2.5 text-xs font-bold flex items-center justify-center gap-2"
            >
              {downloadedDrawer ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5" />}
              {downloadedDrawer ? 'Downloaded!' : 'Download to Device'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ━━━ Main Asset Library Module ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const AssetLibraryModule = () => {
  const { activeWorkspace, t, globalAssets = [], removeGlobalAsset, selectedAssetContext, setSelectedAssetContext } = useWorkspace();
  const [activeSection, setActiveSection] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const hasAutoOpenedRef = useRef(false);

  const initialAssets = [];

  // Filter assets for current workspace/brand or global
  const currentWsId = activeWorkspace?._id || activeWorkspace?.id;
  const currentBrand = activeWorkspace?.brandName;

  const assets = [...globalAssets, ...initialAssets].filter(a => {
    if (!a.workspaceId && !a.metadata?.brand) return true;
    return a.workspaceId === currentWsId || a.metadata?.brand === currentBrand;
  });

  // ── Deep-link from Calendar: auto-filter + auto-open matching asset ──────
  const isSameDayAsset = (assetDate, calDate) => {
    if (!assetDate || !calDate) return false;
    const a = new Date(assetDate);
    const b = new Date(calDate);
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  };

  useEffect(() => {
    if (!selectedAssetContext || hasAutoOpenedRef.current) return;
    hasAutoOpenedRef.current = true;

    // Find best matching asset: by date, then by topic keywords, then by platform
    const match = assets.find(a => {
      const dateMatch = isSameDayAsset(a.date, selectedAssetContext.calendarDate);
      const nameMatch = selectedAssetContext.topic &&
        a.name.toLowerCase().includes(
          (selectedAssetContext.topic || '').toLowerCase().slice(0, 20)
        );
      const platMatch = selectedAssetContext.platform &&
        a.name.toLowerCase().includes(
          (selectedAssetContext.platform || '').toLowerCase()
        );
      return dateMatch || nameMatch || platMatch;
    });

    if (match) {
      setSelectedAsset(match);
    }
  }, [selectedAssetContext, assets]);

  // Reset auto-open ref when context changes
  useEffect(() => {
    hasAutoOpenedRef.current = false;
  }, [selectedAssetContext?.calendarDate]);

  const filteredAssets = assets.filter(a => {
    const sectionMatch = activeSection === 'ALL' || a.type === activeSection;
    const searchMatch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
    // If navigated from Calendar, also show context-date assets at the top (but don't hide others)
    return sectionMatch && searchMatch;
  });

  // Sort: if calendar context active, bring matching assets to top
  const sortedAssets = selectedAssetContext
    ? [...filteredAssets].sort((a, b) => {
        const aMatch = isSameDayAsset(a.date, selectedAssetContext?.calendarDate);
        const bMatch = isSameDayAsset(b.date, selectedAssetContext?.calendarDate);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      })
    : filteredAssets;

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

  // ── Download helper ──────────────────────────────────────────────
  const [downloadedId, setDownloadedId] = useState(null);
  const downloadAsset = async (e, asset) => {
    e.stopPropagation();
    const success = await triggerDirectDeviceDownload(asset);
    if (success) {
      setDownloadedId(asset.id);
      setTimeout(() => setDownloadedId(null), 2500);
    }
  };

  // ── Share helpers ────────────────────────────────────────────────
  const [sharePopoverId, setSharePopoverId] = useState(null);
  const sharePopoverRef = useRef(null);

  const getShareTargets = (asset) => [
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4 text-green-500" />,
      bg: 'hover:bg-green-500/10',
      href: `https://wa.me/?text=${encodeURIComponent(`${asset.name}\n${asset.url || ''}`)}`,
    },
    {
      label: 'Telegram',
      icon: <Send className="w-4 h-4 text-sky-500" />,
      bg: 'hover:bg-sky-500/10',
      href: `https://t.me/share/url?url=${encodeURIComponent(asset.url || '')}&text=${encodeURIComponent(asset.name)}`,
    },
    {
      label: 'X (Twitter)',
      icon: <Twitter className="w-4 h-4 text-slate-800 dark:text-white" />,
      bg: 'hover:bg-slate-100 dark:hover:bg-slate-800',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(asset.name)}&url=${encodeURIComponent(asset.url || '')}`,
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin className="w-4 h-4 text-blue-600" />,
      bg: 'hover:bg-blue-500/10',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(asset.url || '')}`,
    },
    {
      label: 'Email',
      icon: <Mail className="w-4 h-4 text-amber-500" />,
      bg: 'hover:bg-amber-500/10',
      href: `mailto:?subject=${encodeURIComponent(asset.name)}&body=${encodeURIComponent(`${asset.name}\n${asset.url || ''}`)}`,
    },
    {
      label: copiedId === asset.id ? 'Copied!' : 'Copy Link',
      icon: copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4 text-brand-500" />,
      bg: 'hover:bg-brand-500/10',
      action: () => copyUrl(asset.id, asset.url),
    },
  ];

  // Close share popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sharePopoverRef.current && !sharePopoverRef.current.contains(e.target)) {
        setSharePopoverId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* ━━━ Calendar Deep-Link Banner ━━━ */}
      {selectedAssetContext && (
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Viewing assets for {selectedAssetContext.dateLabel}</p>
              <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">
                {selectedAssetContext.topic || selectedAssetContext.platform || 'Scheduled post'} · Assets from this date are highlighted below
              </p>
            </div>
          </div>
          <button
            onClick={() => { setSelectedAssetContext(null); hasAutoOpenedRef.current = false; }}
            className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Clear filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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

        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets..."
            className="glass-input text-xs pl-4 pr-10 py-2.5 text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 font-medium w-64 rounded-xl"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
      {sortedAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sortedAssets.map(asset => {
            const isHighlighted = selectedAssetContext && isSameDayAsset(asset.date, selectedAssetContext?.calendarDate);
            return (
            <div
              key={asset.id}
              className={`p-4 rounded-3xl glass-card border transition-all duration-300 space-y-3 group cursor-pointer hover:shadow-lg ${
                isHighlighted
                  ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10 hover:border-emerald-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-brand-500/40 hover:shadow-brand-500/5'
              }`}
              onClick={() => setSelectedAsset(asset)}
            >
              {/* Highlighted date badge */}
              {isHighlighted && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Downloaded · {selectedAssetContext.dateLabel}
                  </span>
                </div>
              )}
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

              {/* ── Download + Share action bar ── */}
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200 dark:border-slate-800">

                {/* Download button */}
                <button
                  title="Download asset"
                  onClick={(e) => downloadAsset(e, asset)}
                  className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-xl text-[11px] font-bold transition-all ${
                    downloadedId === asset.id
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-brand-500/10 hover:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/20 hover:border-brand-500/40'
                  }`}
                >
                  {downloadedId === asset.id
                    ? <><Check className="w-3.5 h-3.5" />&nbsp;Saved!</>
                    : <><Download className="w-3.5 h-3.5" />&nbsp;Download</>}
                </button>

                {/* Share button + popover */}
                <div
                  className="relative"
                  ref={sharePopoverId === asset.id ? sharePopoverRef : null}
                >
                  <button
                    title="Share this asset"
                    onClick={(e) => { e.stopPropagation(); setSharePopoverId(prev => prev === asset.id ? null : asset.id); }}
                    className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Share Popover */}
                  {sharePopoverId === asset.id && (
                    <div
                      className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 w-44 animate-in fade-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Share via</p>
                      <div className="space-y-0.5">
                        {getShareTargets(asset).map((target) => (
                          target.href ? (
                            <a
                              key={target.label}
                              href={target.href}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setSharePopoverId(null)}
                              className={`flex items-center gap-2.5 px-2 py-2 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 ${target.bg} transition-colors cursor-pointer`}
                            >
                              {target.icon}
                              {target.label}
                            </a>
                          ) : (
                            <button
                              key={target.label}
                              onClick={() => { target.action(); }}
                              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 ${target.bg} transition-colors`}
                            >
                              {target.icon}
                              {target.label}
                            </button>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            );
          })}
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
        <AssetDetailDrawer asset={selectedAsset} onClose={() => setSelectedAsset(null)} onDelete={removeGlobalAsset} />
      )}
    </div>
  );
};
