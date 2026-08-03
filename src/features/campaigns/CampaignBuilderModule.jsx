import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { campaignAPI } from '../../services/api';
import {
  Layers, Sparkles, Calendar, CheckCircle2, ArrowRight, Plus, Trash2,
  ChevronDown, ChevronUp, Loader2, AlertCircle, RefreshCw, Target,
  Clock, Users, BarChart3, Eye, ThumbsUp, Edit3, X
} from 'lucide-react';

const PLATFORMS = ['Instagram', 'Facebook', 'LinkedIn', 'X/Twitter', 'YouTube', 'Threads'];
const FREQUENCIES = ['Daily', '2x per week', '3x per week', '4x per week', '5x per week', 'Weekly', 'Bi Weekly', 'Monthly'];
const STATUS_COLORS = {
  Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  Active: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Paused: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  Completed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  Archived: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};
const POST_STATUS_COLORS = {
  Draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Generated: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Published: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

// ─── Create Campaign Modal ─────────────────────────────────────────────────────
const CreateCampaignModal = ({ workspaceId, onClose, onCreated }) => {
  const [form, setForm] = useState({
    campaignName: '',
    campaignGoal: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    postingFrequency: 'Daily',
    platforms: ['Instagram'],
    budget: '',
    targetAudience: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePlatform = (p) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.campaignName.trim() || !form.campaignGoal.trim()) {
      setError('Campaign name and goal are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await campaignAPI.create({ ...form, workspaceId });
      onCreated(result.campaign);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Create Campaign</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI will generate a complete posting plan</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Campaign Name *</label>
              <input
                type="text"
                value={form.campaignName}
                onChange={(e) => setForm((p) => ({ ...p, campaignName: e.target.value }))}
                placeholder="e.g. Q3 Brand Awareness Drive"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Campaign Goal *</label>
              <input
                type="text"
                value={form.campaignGoal}
                onChange={(e) => setForm((p) => ({ ...p, campaignGoal: e.target.value }))}
                placeholder="e.g. Increase brand awareness and drive 20% more website traffic"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Posting Frequency</label>
              <select
                value={form.postingFrequency}
                onChange={(e) => setForm((p) => ({ ...p, postingFrequency: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                {FREQUENCIES.map((f) => (<option key={f}>{f}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Budget (optional)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))}
                placeholder="₹50,000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Target Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    form.platforms.includes(p)
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Target Audience (optional)</label>
            <input
              type="text"
              value={form.targetAudience}
              onChange={(e) => setForm((p) => ({ ...p, targetAudience: e.target.value }))}
              placeholder="e.g. Marketing managers at B2B SaaS companies"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Campaign Card ─────────────────────────────────────────────────────────────
const CampaignCard = ({ campaign, onSelect, onDelete }) => (
  <div
    onClick={() => onSelect(campaign)}
    className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 cursor-pointer transition-all hover:shadow-lg hover:shadow-brand-500/10 space-y-3"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{campaign.campaignName}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{campaign.campaignGoal}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${STATUS_COLORS[campaign.status] || STATUS_COLORS.Draft}`}>
        {campaign.status}
      </span>
    </div>
    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(campaign.startDate).toLocaleDateString()}</span>
      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{campaign.postingFrequency}</span>
      {campaign.totalPosts > 0 && <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" />{campaign.totalPosts} posts</span>}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-1">
        {(campaign.platforms || []).slice(0, 3).map((p) => (
          <span key={p} className="px-2 py-0.5 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold">{p}</span>
        ))}
        {campaign.platforms?.length > 3 && (
          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs">+{campaign.platforms.length - 3}</span>
        )}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(campaign._id); }}
        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ─── Campaign Detail View ──────────────────────────────────────────────────────
const CampaignDetail = ({ campaign, onBack }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatingPost, setGeneratingPost] = useState(null);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await campaignAPI.getPosts(campaign._id);
      setPosts(result.posts || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [campaign._id]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    setError('');
    try {
      const result = await campaignAPI.generatePlan(campaign._id);
      setPosts(result.posts || []);
    } catch (err) {
      setError(err.message || 'Failed to generate campaign plan');
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handleGeneratePostContent = async (postId) => {
    setGeneratingPost(postId);
    try {
      const result = await campaignAPI.generatePostContent(postId);
      setPosts((prev) => prev.map((p) => p._id === postId ? result.post : p));
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingPost(null);
    }
  };

  const handleUpdateStatus = async (postId, status) => {
    try {
      const result = await campaignAPI.updatePostStatus(postId, { status, approvalStatus: status === 'Approved' ? 'Approved' : undefined });
      setPosts((prev) => prev.map((p) => p._id === postId ? result.post : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const groupedPosts = posts.reduce((acc, post) => {
    const dateKey = new Date(post.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400">
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{campaign.campaignName}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{campaign.campaignGoal}</p>
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={generatingPlan}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          {generatingPlan ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {generatingPlan ? 'Generating Plan...' : posts.length > 0 ? 'Regenerate Plan' : 'Generate AI Plan'}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: posts.length, icon: BarChart3, color: 'text-blue-500' },
          { label: 'Generated', value: posts.filter((p) => p.status === 'Generated' || p.status === 'Approved').length, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Platforms', value: campaign.platforms?.length || 0, icon: Layers, color: 'text-brand-500' },
          { label: 'Pending', value: posts.filter((p) => p.status === 'Draft').length, icon: Clock, color: 'text-amber-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* Posts grouped by date */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="p-12 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <Sparkles className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No posts yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Click "Generate AI Plan" to create a complete content calendar with AI-crafted posts for each day and platform.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedPosts).map(([date, datePosts]) => (
            <div key={date}>
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{date}</h3>
              <div className="space-y-2">
                {datePosts.map((post) => (
                  <div key={post._id} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 text-xs font-bold capitalize">{post.platform}</span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">{post.contentType}</span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">{post.campaignStage}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5">{post.postObjective}</p>
                        {post.caption && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">"{post.caption}"</p>
                        )}
                        {post.hashtags?.length > 0 && (
                          <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">{post.hashtags.slice(0, 4).join(' ')}</p>
                        )}
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${POST_STATUS_COLORS[post.status] || POST_STATUS_COLORS.Draft}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.status === 'Draft' && (
                        <button
                          onClick={() => handleGeneratePostContent(post._id)}
                          disabled={generatingPost === post._id}
                          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-60"
                        >
                          {generatingPost === post._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          {generatingPost === post._id ? 'Generating...' : 'Generate Content'}
                        </button>
                      )}
                      {post.status === 'Generated' && (
                        <button
                          onClick={() => handleUpdateStatus(post._id, 'Approved')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {(post.status === 'Generated' || post.status === 'Approved') && (
                        <button
                          onClick={() => handleUpdateStatus(post._id, 'Scheduled')}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <Calendar className="w-3 h-3" /> Schedule
                        </button>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500">{post.postType} · {post.bestPostingTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Campaign Builder Module ──────────────────────────────────────────────
export const CampaignBuilderModule = () => {
  const { activeWorkspace } = useWorkspace();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [error, setError] = useState('');

  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await campaignAPI.list(workspaceId ? { workspaceId } : {});
      setCampaigns(result.campaigns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this campaign and all its posts?')) return;
    try {
      await campaignAPI.delete(id);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      if (selectedCampaign?._id === id) setSelectedCampaign(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (selectedCampaign) {
    return (
      <div className="space-y-5 animate-in fade-in">
        <CampaignDetail
          campaign={selectedCampaign}
          onBack={() => setSelectedCampaign(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {showCreate && (
        <CreateCampaignModal
          workspaceId={workspaceId}
          onClose={() => setShowCreate(false)}
          onCreated={(c) => { setCampaigns((prev) => [c, ...prev]); setSelectedCampaign(c); }}
        />
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Campaign Builder</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            AI-powered campaign planning with auto-generated post schedules for{' '}
            <strong className="text-slate-900 dark:text-white">{activeWorkspace?.brandName || 'your brand'}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadCampaigns} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* Campaign Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8 text-brand-500" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">No Campaigns Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Create your first campaign and let AI generate a complete posting schedule with captions, hashtags, and visual prompts.
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Create First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onSelect={setSelectedCampaign}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
