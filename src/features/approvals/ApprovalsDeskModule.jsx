import React, { useState } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { CheckCircle2, ShieldCheck, ShieldAlert, XCircle, ArrowRight, UserCheck, MessageSquare, Clock } from 'lucide-react';

export const ApprovalsDeskModule = () => {
  const { approvalsQueue, updateApprovalStatus, activeRole, setActiveModule, activeWorkspace } = useWorkspace();
  const [selectedItem, setSelectedItem] = useState(approvalsQueue[0] || null);
  const [comment, setComment] = useState('');

  const isClientPortal = activeRole === 'ClientReviewer';

  const handleApprove = (id) => {
    updateApprovalStatus(id, 'APPROVED', comment);
    setComment('');
  };

  const handleRequestRevision = (id) => {
    updateApprovalStatus(id, 'RED_FLAG_CITATION_NEEDED', comment || 'Revision requested by reviewer.');
    setComment('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Approvals Desk & Governance Review Queue</h1>
          </div>
          <p className="text-xs text-slate-400">
            Role-gated multi-tier approval workflow for <strong className="text-white">{activeWorkspace.brandName}</strong>. Current View Role: <span className="text-emerald-400 font-bold">{activeRole}</span>
          </p>
        </div>

        {isClientPortal && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Restricted Client Portal Mode
          </div>
        )}
      </div>

      {/* Review Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Items Column */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Pending Review Queue ({approvalsQueue.length})</h2>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {approvalsQueue.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  selectedItem?.id === item.id 
                    ? 'bg-brand-500/20 border-brand-500 shadow-glow' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-brand-300 uppercase">{item.type}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                    item.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/20 text-rose-400' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-white text-xs leading-snug">{item.title}</h3>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Author: {item.author}</span>
                  <span className="text-emerald-400 font-semibold">{item.factCheck?.passed ? '✓ Fact-Checked' : '⚠ Citation Needed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Item Detail View & Approval Actions */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-800 space-y-4">
          {selectedItem ? (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Item ID: {selectedItem.id}</span>
                  <h2 className="text-base font-extrabold text-white">{selectedItem.title}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  selectedItem.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  selectedItem.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {selectedItem.status}
                </span>
              </div>

              {/* Fact Check Gate Verification Card */}
              <div className={`p-4 rounded-2xl border space-y-1 ${
                selectedItem.factCheck?.passed 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {selectedItem.factCheck?.passed ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
                    Governance Decision Gate 1: {selectedItem.factCheck?.status}
                  </span>
                  <span className="font-extrabold">{selectedItem.factCheck?.score}%</span>
                </div>
                {!selectedItem.factCheck?.passed && selectedItem.factCheck?.flags?.map((f, i) => (
                  <p key={i} className="text-[11px] font-semibold text-rose-200 mt-1">• {f.message}</p>
                ))}
              </div>

              {/* Comment & Actions */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-300">Reviewer Notes & Feedback</label>
                <textarea 
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add approval comment or revision instructions..."
                  className="w-full glass-input text-xs"
                />

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleRequestRevision(selectedItem.id)}
                    className="w-full btn-secondary text-xs border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
                  >
                    <XCircle className="w-4 h-4" /> Request Revision (Return to Studio)
                  </button>

                  <button 
                    onClick={() => handleApprove(selectedItem.id)}
                    className="w-full btn-primary text-xs bg-emerald-600 hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Asset for Scheduling
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-xs">Select an item from the pending queue to inspect details and approve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
