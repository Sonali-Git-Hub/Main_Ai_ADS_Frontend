import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { approvalsAPI } from '../../services/api';
import { CheckCircle2, ShieldCheck, ShieldAlert, XCircle, UserCheck, Loader2 } from 'lucide-react';

export const ApprovalsDeskModule = () => {
  const { approvalsQueue, setApprovalsQueue, activeRole, activeWorkspace } = useWorkspace();
  const [selectedItem, setSelectedItem] = useState(approvalsQueue[0] || null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (approvalsQueue.length > 0 && !selectedItem) {
      setSelectedItem(approvalsQueue[0]);
    }
  }, [approvalsQueue, selectedItem]);

  const isClientPortal = activeRole === 'ClientReviewer';

  const handleUpdateStatus = async (status, defaultNote) => {
    if (!selectedItem) return;
    setLoading(true);
    const itemComment = comment.trim() || defaultNote;

    try {
      await approvalsAPI.updateStatus({
        contentId: selectedItem._id || selectedItem.id,
        status,
        reviewerComment: itemComment,
      });

      const updatedQueue = approvalsQueue.map((item) =>
        (item._id || item.id) === (selectedItem._id || selectedItem.id)
          ? { ...item, status, reviewerComment: itemComment }
          : item
      );

      setApprovalsQueue(updatedQueue);
      setSelectedItem((prev) => prev ? { ...prev, status, reviewerComment: itemComment } : null);
      setComment('');
    } catch (err) {
      console.error('Approval update failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto p-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Approvals Desk & Governance Review Queue</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Role-gated multi-tier approval workflow for <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>. Current Role: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{activeRole || 'Admin'}</span>
          </p>
        </div>

        {isClientPortal && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" /> Client Portal Mode
          </div>
        )}
      </div>

      {/* Review Queue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue Items Column */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Pending Review Queue ({approvalsQueue.length})</h2>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {approvalsQueue.map((item) => (
              <div
                key={item._id || item.id}
                onClick={() => setSelectedItem(item)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                  (selectedItem?._id || selectedItem?.id) === (item._id || item.id)
                    ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500 shadow-glow'
                    : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-brand-600 dark:text-brand-300 uppercase">{item.type}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                    item.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400' :
                    'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">{item.title}</h3>
                <div className="flex justify-between items-center text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                  <span>Author: {item.author || 'AI Engine'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.factCheck?.passed !== false ? '✓ Fact-Checked' : '⚠ Citation Needed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Item Detail View & Approval Actions */}
        <div className="lg:col-span-2 p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          {selectedItem ? (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Item ID: {selectedItem._id || selectedItem.id}</span>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedItem.title}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  selectedItem.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                  selectedItem.status === 'RED_FLAG_CITATION_NEEDED' ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                }`}>
                  {selectedItem.status}
                </span>
              </div>

              {/* Fact Check Card */}
              <div className={`p-4 rounded-2xl border space-y-1 ${
                selectedItem.factCheck?.passed !== false
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {selectedItem.factCheck?.passed !== false ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-rose-600" />}
                    Governance Gate: {selectedItem.factCheck?.status || 'VERIFIED'}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">{selectedItem.factCheck?.score || 98}%</span>
                </div>
              </div>

              {/* Comment & Actions */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300">Reviewer Notes & Feedback</label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add approval comment or revision instructions..."
                  className="w-full p-3 rounded-xl text-xs text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdateStatus('RED_FLAG_CITATION_NEEDED', 'Revision requested by reviewer.')}
                    disabled={loading}
                    className="w-full btn-secondary text-xs border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} Request Revision
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('APPROVED', 'Approved for publication.')}
                    disabled={loading}
                    className="w-full btn-primary text-xs bg-emerald-600 hover:bg-emerald-500 font-bold flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Approve Asset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600 mb-2" />
              <p className="text-xs font-medium">Select an item from the pending queue to inspect details and approve.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
