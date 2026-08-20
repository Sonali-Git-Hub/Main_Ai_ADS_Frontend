import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, CreditCard, Layers, Zap, Search, ChevronDown, ChevronUp,
  ArrowLeft, RefreshCw, Crown, Shield, Eye, Package, TrendingUp,
  Activity, BarChart3, Clock, CheckCircle2, XCircle, User as UserIcon,
  Sparkles, Globe, Image as ImageIcon, Video, FileText, Hash
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useWorkspace } from '../../context/WorkspaceContext';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, gradient, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-[#0d0f1a]/80 backdrop-blur-xl p-5 group hover:border-slate-700/80 transition-all duration-300"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${gradient}10 0%, transparent 60%)` }} />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `linear-gradient(135deg, ${gradient}30, ${gradient}10)` }}>
          <Icon className="w-5 h-5" style={{ color: gradient }} />
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-400 opacity-60" />
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </motion.div>
);

// ─── Plan Badge ────────────────────────────────────────────────────────────────
const PlanBadge = ({ plan }) => {
  const config = {
    free: { bg: 'bg-slate-800/60', text: 'text-slate-300', border: 'border-slate-700/50' },
    starter: { bg: 'bg-blue-950/40', text: 'text-blue-300', border: 'border-blue-800/40' },
    pro: { bg: 'bg-purple-950/40', text: 'text-purple-300', border: 'border-purple-800/40' },
    enterprise: { bg: 'bg-amber-950/40', text: 'text-amber-300', border: 'border-amber-800/40' },
  };
  const c = config[plan] || config.free;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
      {plan === 'enterprise' && <Crown className="w-3 h-3" />}
      {plan === 'pro' && <Sparkles className="w-3 h-3" />}
      {plan}
    </span>
  );
};

// ─── Post Type Icon ────────────────────────────────────────────────────────────
const PostTypeIcon = ({ type }) => {
  const icons = {
    image: ImageIcon,
    carousel: Layers,
    video: Video,
    reel: Video,
    story: Zap,
    static: FileText,
  };
  const Icon = icons[type] || FileText;
  return <Icon className="w-3.5 h-3.5 text-slate-400" />;
};

// ─── User Detail Drawer ────────────────────────────────────────────────────────
const UserDetailDrawer = ({ userId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    adminAPI.getUserDetail(userId)
      .then(res => setDetail(res.data))
      .catch(err => console.error('User detail error:', err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative ml-auto w-full max-w-2xl h-full bg-[#0a0c15] border-l border-slate-800/60 overflow-y-auto"
      >
        {/* Close / Back */}
        <div className="sticky top-0 z-10 bg-[#0a0c15]/95 backdrop-blur-xl border-b border-slate-800/60 px-6 py-4 flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-bold text-white">User Details</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : detail ? (
          <div className="p-6 space-y-6">
            {/* User Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-brand-500/20">
                {(detail.user.name || detail.user.email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-base truncate">{detail.user.name || detail.user.email.split('@')[0]}</h3>
                <p className="text-xs text-slate-400 truncate">{detail.user.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <PlanBadge plan={detail.user.plan} />
                  <span className="text-[10px] text-slate-500">Joined {new Date(detail.user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 text-center">
                <p className="text-xl font-bold text-white">{detail.user.credits ?? 0}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Credits Left</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 text-center">
                <p className="text-xl font-bold text-white">{detail.brands?.length || 0}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Active Brands</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 text-center">
                <p className="text-xl font-bold text-white">{detail.generations?.length || 0}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Generations</p>
              </div>
            </div>

            {/* Brands List */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-400" />
                Active Brands ({detail.brands?.length || 0})
              </h4>
              {detail.brands?.length > 0 ? (
                <div className="space-y-2">
                  {detail.brands.map((brand, i) => (
                    <div key={brand._id || i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/30 hover:border-slate-700/50 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600/30 to-purple-600/20 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
                        {(brand.brandName || brand.companyName || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">{brand.brandName || brand.companyName || 'Unnamed Brand'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{brand.domainUrl || brand.website || '—'}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(brand.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-3 bg-slate-900/20 rounded-xl text-center">No brands created yet</p>
              )}
            </div>

            {/* Generation History */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Generation History ({detail.generations?.length || 0})
              </h4>
              {detail.generations?.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {detail.generations.map((gen, i) => (
                    <div key={gen._id || i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/30 border border-slate-800/30">
                      <PostTypeIcon type={gen.type} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-white truncate">{gen.hook || gen.captionShort || gen.type}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 capitalize">{gen.platform}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-[10px] text-slate-500">{gen.status}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap">
                        {new Date(gen.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-3 bg-slate-900/20 rounded-xl text-center">No content generated yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-sm text-slate-500">User not found</div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export const AdminDashboardModule = () => {
  const { user } = useWorkspace();
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [summaryRes, usersRes] = await Promise.all([
        adminAPI.getDashboardSummary(),
        adminAPI.getAllUserStats(),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Filter & Sort
  const filteredUsers = useMemo(() => {
    let list = [...users];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(u =>
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.plan && u.plan.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'createdAt') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [users, searchQuery, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-slate-600" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-brand-400" />
      : <ChevronDown className="w-3 h-3 text-brand-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 animate-pulse">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 ml-[52px]">Real-time overview of all users, subscriptions, and generations</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-sm text-slate-300 font-medium transition-all hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={summary?.totalUsers ?? 0} gradient="#6366F1" delay={0.05} />
        <StatCard icon={Layers} label="Total Brands" value={summary?.totalBrands ?? 0} gradient="#8B5CF6" delay={0.1} />
        <StatCard icon={Zap} label="Total Generations" value={summary?.totalGenerations ?? 0} gradient="#06B6D4" delay={0.15} />
        <StatCard
          icon={Crown}
          label="Plan Breakdown"
          value={Object.entries(summary?.planDistribution || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || '—'}
          gradient="#F59E0B"
          delay={0.2}
        />
      </div>

      {/* User Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-slate-800/60 bg-[#0d0f1a]/80 backdrop-blur-xl overflow-hidden"
      >
        {/* Table Header / Search */}
        <div className="p-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            All Users
            <span className="ml-1 text-xs font-normal text-slate-500">({filteredUsers.length})</span>
          </h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search users by email, name, or plan..."
              className="w-full bg-slate-900/40 border border-slate-800/60 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/40">
                {[
                  { key: 'email', label: 'User' },
                  { key: 'plan', label: 'Plan' },
                  { key: 'credits', label: 'Credits' },
                  { key: 'brandCount', label: 'Brands' },
                  { key: 'generationCount', label: 'Generations' },
                  { key: 'createdAt', label: 'Joined' },
                ].map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.key} />
                    </span>
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-sm text-slate-500">
                      {searchQuery ? 'No users match your search' : 'No users found'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, idx) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-slate-800/20 hover:bg-slate-800/20 transition-colors group cursor-pointer"
                      onClick={() => setSelectedUserId(u.id)}
                    >
                      {/* User */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600/30 to-purple-600/20 flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
                            {(u.name || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate max-w-[200px]">
                              {u.name || u.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-4 py-3.5">
                        <PlanBadge plan={u.plan} />
                      </td>

                      {/* Credits */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                          <span className={`text-sm font-semibold ${u.credits > 100 ? 'text-emerald-400' : u.credits > 20 ? 'text-amber-400' : 'text-red-400'}`}>
                            {u.credits ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Brands */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-slate-300 font-medium">{u.brandCount ?? 0}</span>
                      </td>

                      {/* Generations */}
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-slate-300 font-medium">{u.generationCount ?? 0}</span>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-600" />
                          <span className="text-xs text-slate-400">
                            {u.createdAt
                              ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '—'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedUserId(u.id); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 text-xs font-semibold border border-brand-600/20 hover:border-brand-500/40 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* User Detail Drawer */}
      <AnimatePresence>
        {selectedUserId && (
          <UserDetailDrawer userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};
