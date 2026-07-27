import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { FolderKanban, Search, Download, ExternalLink, Image as ImageIcon, FileText, Layers, Check } from 'lucide-react';

export const AssetLibraryModule = () => {
  const { activeWorkspace } = useWorkspace();
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const assets = [
    { id: 'ast_1', name: 'Cyberpunk Glassmorphism Background', type: 'IMAGE', url: 'https://picsum.photos/seed/aiads1/800/800', date: '2026-07-25', credits: 5 },
    { id: 'ast_2', name: 'Brand DNA 101 Carousel Slides', type: 'CAROUSEL', url: 'https://picsum.photos/seed/aiads2/800/800', date: '2026-07-24', credits: 10 },
    { id: 'ast_3', name: 'SEO Pillar Article Draft (PDF)', type: 'DOCUMENT', url: 'https://picsum.photos/seed/aiads3/800/800', date: '2026-07-22', credits: 0 },
    { id: 'ast_4', name: 'Modern B2B Executive Persona Visual', type: 'IMAGE', url: 'https://picsum.photos/seed/aiads4/800/800', date: '2026-07-20', credits: 5 }
  ];

  const filteredAssets = assets.filter(a => 
    (filterType === 'ALL' || a.type === filterType) &&
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyUrl = (id, url) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-extrabold text-white">Central Asset Library & Cloud Storage Vault</h1>
          </div>
          <p className="text-xs text-slate-400">
            Stores every generated visual, document, carousel, and repurposed variant for <strong className="text-white">{activeWorkspace.brandName}</strong>.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="glass-input text-xs pl-8 py-1.5"
            />
          </div>

          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="glass-input text-xs py-1.5"
          >
            <option value="ALL">All Types</option>
            <option value="IMAGE">AI Images</option>
            <option value="CAROUSEL">Carousels</option>
            <option value="DOCUMENT">Documents</option>
          </select>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="p-4 rounded-3xl glass-card border border-slate-800 hover:border-brand-500/40 transition-all space-y-3 group">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 right-2 bg-slate-950/80 text-brand-400 font-bold text-[9px] px-2 py-0.5 rounded-full border border-slate-800">
                {asset.type}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs truncate">{asset.name}</h3>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{asset.date}</span>
                <span className="text-cyan-400">{asset.credits > 0 ? `${asset.credits} Credits` : 'Free Text'}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 border-t border-slate-800">
              <button 
                onClick={() => copyUrl(asset.id, asset.url)} 
                className="w-full btn-secondary py-1.5 text-[11px]"
              >
                {copiedId === asset.id ? <Check className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                {copiedId === asset.id ? 'Copied' : 'Copy Link'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
