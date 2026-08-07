import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { campaignAPI } from '../../services/api';
import {
  Calendar as CalendarIcon, Plus, Settings, BarChart3, ChevronUp, ChevronDown,
  Sparkles, CheckCircle2, Clock, Layers, FileText, Trash2, X, Loader2
} from 'lucide-react';

export const CalendarModule = () => {
  const { activeWorkspace, setActiveModule } = useWorkspace();
  const workspaceId = activeWorkspace?._id || activeWorkspace?.id;

  // Campaigns & History
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [campaignPosts, setCampaignPosts] = useState([]);
  const [isCampaignLoading, setIsCampaignLoading] = useState(false);

  // Form State
  const [campaignConfig, setCampaignConfig] = useState({
    campaignName: '',
    postingFrequency: 'Daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // default 7 days ahead
  });

  // Calendar UI states
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load Campaign list (History)
  const loadCampaignHistory = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const res = await campaignAPI.list({ workspaceId });
      if (res.success && res.campaigns) {
        setCampaigns(res.campaigns);
        // Automatically select the first campaign if available
        if (res.campaigns.length > 0 && !currentCampaign) {
          handleSelectCampaign(res.campaigns[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    }
  }, [workspaceId]);

  useEffect(() => {
    loadCampaignHistory();
  }, [loadCampaignHistory]);

  // Load specific campaign details
  const handleSelectCampaign = async (campaign) => {
    setIsCampaignLoading(true);
    try {
      setCurrentCampaign(campaign);
      setCampaignConfig({
        campaignName: campaign.campaignName || '',
        postingFrequency: campaign.postingFrequency || 'Daily',
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
      });

      // Get posts
      const res = await campaignAPI.getPosts(campaign._id);
      if (res.success && res.posts) {
        setCampaignPosts(res.posts);
        if (res.posts.length > 0) {
          // Set calendar month/year view to first post's date
          const firstDate = new Date(res.posts[0].date);
          setCalendarMonth(firstDate.getMonth());
          setCalendarYear(firstDate.getFullYear());
          setSelectedDate(firstDate);
        }
      }
    } catch (err) {
      console.error("Failed to load campaign details:", err);
    } finally {
      setIsCampaignLoading(false);
    }
  };

  // Generate / Create Calendar Campaign
  const handleCreateCampaign = async () => {
    if (!campaignConfig.startDate || !campaignConfig.endDate) {
      alert("Please select Campaign Start and End dates.");
      return;
    }
    if (new Date(campaignConfig.startDate) > new Date(campaignConfig.endDate)) {
      alert("Start Date cannot be greater than End Date.");
      return;
    }
    if (!campaignConfig.campaignName) {
      alert("Please enter a Campaign Name.");
      return;
    }

    setIsCampaignLoading(true);
    try {
      // 1. Create campaign
      const payload = {
        workspaceId,
        campaignName: campaignConfig.campaignName,
        campaignGoal: 'Automated AI content planning',
        startDate: campaignConfig.startDate,
        endDate: campaignConfig.endDate,
        postingFrequency: campaignConfig.postingFrequency,
        platforms: ['Instagram', 'LinkedIn', 'YouTube'], // Default platforms
      };

      const res = await campaignAPI.create(payload);
      if (res.success && res.campaign) {
        // 2. Generate plan
        const genRes = await campaignAPI.generatePlan(res.campaign._id);
        if (genRes.success) {
          setCurrentCampaign(res.campaign);
          setCampaignPosts(genRes.posts || []);
          await loadCampaignHistory();
          
          if (genRes.posts && genRes.posts.length > 0) {
            const firstDate = new Date(genRes.posts[0].date);
            setCalendarMonth(firstDate.getMonth());
            setCalendarYear(firstDate.getFullYear());
            setSelectedDate(firstDate);
          }
        }
      }
    } catch (err) {
      console.error("Failed to generate campaign calendar:", err);
      alert(err.message || "Failed to generate campaign");
    } finally {
      setIsCampaignLoading(false);
    }
  };

  // Derived counts for Stats
  const totalCount = campaignPosts.length;
  const generatedCount = campaignPosts.filter(p => ['Generated', 'Approved', 'Scheduled', 'Published'].includes(p.status)).length;
  const approvedCount = campaignPosts.filter(p => p.approvalStatus === 'Approved').length;
  const scheduledCount = campaignPosts.filter(p => p.status === 'Scheduled').length;
  const publishedCount = campaignPosts.filter(p => p.status === 'Published').length;
  const remainingCount = totalCount - generatedCount;
  const progressPercent = totalCount > 0 ? Math.round((generatedCount / totalCount) * 100) : 0;

  // Date helper
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calendar cells generation
  const getCalendarCells = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        day: daysInPrevMonth - i,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }

    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }

    return cells;
  };

  const calendarCells = getCalendarCells(calendarYear, calendarMonth);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const activePost = campaignPosts.find(p => isSameDay(p.date, selectedDate));

  // Render Campaign Info Card Component
  const campaignInfoCard = (
    <div className="bg-white dark:bg-[#0d131f] p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">Campaign Info</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {campaigns.length > 0 && (
              <select
                value={currentCampaign?._id || ''}
                onChange={(e) => {
                  const selected = campaigns.find(c => c._id === e.target.value);
                  if (selected) handleSelectCampaign(selected);
                }}
                className="text-[9px] font-black uppercase tracking-wider px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 outline-none max-w-[120px] truncate"
              >
                <option value="" disabled>Campaign History</option>
                {campaigns.map(c => (
                  <option key={c._id} value={c._id}>{c.campaignName || 'Unnamed'}</option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => {
                setCurrentCampaign(null);
                setCampaignPosts([]);
                setCampaignConfig({
                  campaignName: '',
                  postingFrequency: 'Daily',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                });
              }}
              className="p-1 text-brand-600 hover:text-brand-700 bg-brand-500/10 hover:bg-brand-500/20 rounded-lg border border-brand-500/20 transition-all flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-1"
              title="Create New Campaign"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Campaign Name</label>
            <input
              type="text"
              value={campaignConfig.campaignName}
              onChange={e => setCampaignConfig(prev => ({ ...prev, campaignName: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500/50"
              placeholder="e.g. Q1 Product Launch"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Posting Frequency</label>
            <select
              value={campaignConfig.postingFrequency}
              onChange={e => setCampaignConfig(prev => ({ ...prev, postingFrequency: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500/50"
            >
              {['Daily', '2x per week', '3x per week', '4x per week', '5x per week', 'Weekly', 'Bi Weekly', 'Monthly'].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Start Date</label>
            <input
              type="date"
              value={campaignConfig.startDate}
              onChange={e => setCampaignConfig(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">End Date</label>
            <input
              type="date"
              value={campaignConfig.endDate}
              onChange={e => setCampaignConfig(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500/50"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {campaignConfig.startDate && campaignConfig.endDate && (
          <div className="flex items-center justify-between p-2.5 bg-brand-500/5 rounded-xl border border-brand-500/10">
            <span className="text-[9px] font-black uppercase text-brand-600/70 dark:text-brand-400/70 tracking-widest">Active Schedule Span</span>
            <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">
              {campaignConfig.startDate} → {campaignConfig.endDate}
            </span>
          </div>
        )}

        <button
          onClick={handleCreateCampaign}
          disabled={isCampaignLoading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-500/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isCampaignLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating Plan...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Calendar</>
          )}
        </button>
      </div>
    </div>
  );

  // Render Campaign Progress Card Component
  const campaignProgressCard = (
    <div className="bg-white dark:bg-[#0d131f] p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <h3 className="text-[10px] font-black text-slate-850 dark:text-white uppercase tracking-widest">Campaign Progress: {currentCampaign?.campaignName || 'NEW LAUNCH'}</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{totalCount} Scheduled Publication Days</p>
          </div>
          <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">{progressPercent}% Completed</span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
          <div className="bg-brand-600 h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Total Posts", val: totalCount },
            { label: "Generated", val: generatedCount },
            { label: "Approved", val: approvedCount },
            { label: "Scheduled", val: scheduledCount },
            { label: "Published", val: publishedCount },
            { label: "Remaining", val: remainingCount }
          ].map((c, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{c.label}</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{c.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-300">
      {/* ─── Campaign Info & Progress Cards ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {campaignInfoCard}
        {campaignProgressCard}
      </div>

      {/* ─── Calendar view panel ─── */}
      {isCampaignLoading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white dark:bg-[#0d131f] rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px] animate-pulse">Orchestrating Campaign Calendar & Posts...</p>
        </div>
      ) : currentCampaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar monthly cells widget */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0d131f] p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            
            {/* Header / Month selectors */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                {monthNames[calendarMonth]}, {calendarYear}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 transition-all"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(dayName => (
                <div key={dayName} className="py-2">{dayName}</div>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-bold">
              {calendarCells.map((cell, cellIdx) => {
                if (!cell.isCurrentMonth) {
                  return <div key={cellIdx} className="aspect-square" />;
                }

                const cellDate = new Date(cell.year, cell.month, cell.day);
                const hasPost = campaignPosts.some(p => isSameDay(p.date, cellDate));
                const isSelected = isSameDay(cellDate, selectedDate);

                return (
                  <div key={cellIdx} className="flex justify-center items-center relative aspect-square">
                    <button
                      onClick={() => setSelectedDate(cellDate)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-[11px] ${
                        hasPost
                          ? 'bg-brand-600 text-white font-black shadow-md shadow-brand-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105'
                      } ${
                        isSelected
                          ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-[#0d131f] scale-110'
                          : ''
                      }`}
                    >
                      {cell.day}
                    </button>
                    {hasPost && !isSelected && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 bg-brand-300 rounded-full animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active selected day details card */}
          <div className="lg:col-span-7">
            {activePost ? (
              <div className="bg-white dark:bg-[#0d131f] border border-slate-200 dark:border-slate-800 rounded-[28px] p-6 space-y-4 hover:shadow-lg transition-all flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">
                        {new Date(activePost.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activePost.platform} Plan</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                      activePost.status === 'Draft' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    }`}>
                      {activePost.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Platform</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300 capitalize">{activePost.platform}</p>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Post Type</span>
                      <p className="font-bold text-slate-700 dark:text-slate-300 capitalize">{activePost.postType || 'Image'}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Topic / Description</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      {activePost.postObjective || activePost.title}
                    </p>
                  </div>

                  {activePost.caption && (
                    <div className="space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">AI Generated Copy</span>
                      <p className="text-xs text-slate-650 dark:text-slate-300 italic">"{activePost.caption}"</p>
                    </div>
                  )}

                  {activePost.hashtags && activePost.hashtags.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Hashtags</span>
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{activePost.hashtags.join(' ')}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                  <button
                    onClick={async () => {
                      setIsCampaignLoading(true);
                      try {
                        await campaignAPI.generatePostContent(activePost._id);
                        // Reload posts
                        const res = await campaignAPI.getPosts(currentCampaign._id);
                        if (res.success && res.posts) setCampaignPosts(res.posts);
                      } catch (err) {
                        alert("Generation failed: " + err.message);
                      } finally {
                        setIsCampaignLoading(false);
                      }
                    }}
                    className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate with AI
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0d131f] border border-dashed border-slate-200 dark:border-slate-800 rounded-[28px] p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <CalendarIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">No Post Scheduled</h5>
                <p className="text-[9px] text-slate-400 font-medium mt-1 leading-normal max-w-xs">
                  There is no post generated for {selectedDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-16 bg-white dark:bg-[#0d131f] rounded-[28px] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-350 mb-4">
            <Layers className="w-6 h-6 opacity-30" />
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[4px]">No Campaigns Active</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Configure campaign name, posting frequency, and click Generate Calendar above.</p>
        </div>
      )}
    </div>
  );
};
