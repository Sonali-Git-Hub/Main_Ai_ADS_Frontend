import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Settings, CreditCard, Key, Sparkles, Check, ShieldCheck, Globe, Zap, User, Mail, Phone, Lock, Camera, LogOut, Save, Image, Trash2, ChevronDown, Eye, EyeOff } from 'lucide-react';

export const SettingsBillingModule = () => {
  const { 
    credits, 
    setIsCreditModalOpen, 
    userAvatar, 
    setUserAvatar, 
    setActiveModule, 
    user,
    appearance,
    setAppearance,
    accentColor,
    setAccentColor,
    region,
    setRegion,
    language,
    setLanguage,
    multiScheduleReminder,
    setMultiScheduleReminder,
    setIsSettingsModalOpen
  } = useWorkspace();
  const [activeTier, setActiveTier] = useState(credits.tier || 'Agency');
  const [apiKey, setApiKey] = useState('aisa_live_pk_9948271038571029481');
  const [copiedKey, setCopiedKey] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSavedPopupOpen, setIsSavedPopupOpen] = useState(false);

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      // Note: We'll set the srcObject inside a useEffect or directly after render if videoRef is attached,
      // but since videoRef is in the modal which mounts conditionally, we can set it in a slight timeout 
      // or rely on a callback ref. We'll use a short timeout for simplicity in this flow.
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing the camera", err);
      alert("Unable to access camera. Please check your permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      // Handle mirroring
      context.translate(canvasRef.current.width, 0);
      context.scale(-1, 1);
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setUserAvatar(dataUrl);
      stopCamera();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required fields!");
      return;
    }
    if (passwords.new || passwords.confirm) {
      if (passwords.new !== passwords.confirm) {
        alert("New passwords do not match!");
        return;
      }
    }
    setIsSavedPopupOpen(true);
  };

  // Profile states
  const getUserName = (u) => {
    if (!u?.email) return 'Agency User';
    const prefix = u.email.split('@')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  };

  const [profile, setProfile] = useState({
    name: getUserName(user),
    email: user?.email || '',
    region: '+91',
    phoneOnly: '9876543210',
  });

  useEffect(() => {
    if (user?.email) {
      setProfile(prev => ({
        ...prev,
        email: user.email,
        name: prev.name === 'Agency User' || prev.name === 'Jane Doe' ? getUserName(user) : prev.name
      }));
    }
  }, [user]);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const tiers = [
    { name: 'Base', price: '$99/mo', desc: 'Text intelligence, calendar & captions, basic SEO, limited blogs. No visual credits.', credits: '0 Visual Credits' },
    { name: 'Professional', price: '$299/mo', desc: 'More brands, SEO clusters, approval workflows, repurposing engine.', credits: '50 Credits/mo' },
    { name: 'Agency', price: '$799/mo', desc: 'Multi-client workspace, team roles, client portal, high text usage.', credits: '250 Credits/mo', current: true },
    { name: 'Enterprise', price: 'Custom', desc: 'Multiple departments, advanced permissions, governance API & custom SLAs.', credits: 'Custom Credits' }
  ];

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Platform Settings, Monetization & API Keys</h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Subscription tier controls, Razorpay payment verification, and AISA Connect™ API integrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsSettingsModalOpen(true)} className="btn-secondary text-xs">
            <Settings className="w-4 h-4" /> Open Settings Popup
          </button>
          <button onClick={() => setIsCreditModalOpen(true)} className="btn-primary text-xs">
            <Sparkles className="w-4 h-4" /> Top Up Visual Credits
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          User Profile
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center gap-3 relative">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <div className="relative group cursor-pointer" onClick={() => setShowPhotoMenu(!showPhotoMenu)}>
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                {userAvatar ? (
                  <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <button onClick={() => setShowPhotoMenu(!showPhotoMenu)} className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Change Photo</button>
            
            {/* Photo Menu Dropdown */}
            {showPhotoMenu && (
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-2 w-48 glass-card bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => {
                    setShowPhotoMenu(false);
                    startCamera();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Camera className="w-4 h-4 text-brand-500" />
                  Take Photo (Camera)
                </button>
                <button 
                  onClick={() => {
                    setShowPhotoMenu(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                >
                  <Image className="w-4 h-4 text-brand-500" />
                  Upload from Gallery
                </button>
                {userAvatar && (
                  <button 
                    onClick={() => {
                      setShowPhotoMenu(false);
                      setUserAvatar(null);
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-left mt-1 border-t border-slate-100 dark:border-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Photo
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Details Form */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full glass-input !pl-10 text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full glass-input !pl-10 text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select 
                      value={profile.region} 
                      onChange={e => setProfile({...profile, region: e.target.value})}
                      className="glass-input text-xs !pr-8 py-2.5 appearance-none cursor-pointer bg-slate-900/60 dark:bg-slate-900"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+65">🇸🇬 +65</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={profile.phoneOnly} 
                      onChange={e => setProfile({...profile, phoneOnly: e.target.value})} 
                      placeholder="98765 43210"
                      className="w-full glass-input !pl-10 text-xs" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Password */}
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    placeholder="Current Password" 
                    value={passwords.current} 
                    onChange={e => setPasswords({...passwords, current: e.target.value})} 
                    className="glass-input text-xs w-full pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* New Password */}
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    placeholder="New Password" 
                    value={passwords.new} 
                    onChange={e => setPasswords({...passwords, new: e.target.value})} 
                    className="glass-input text-xs w-full pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm Password" 
                    value={passwords.confirm} 
                    onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
                    className="glass-input text-xs w-full pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleSave} className="btn-primary text-xs"><Save className="w-4 h-4" /> Save Profile</button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Tiers Grid */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Subscription Tiers & Monetization Logic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(t => (
            <div 
              key={t.name}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative ${
                activeTier === t.name 
                  ? 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500 shadow-glow' 
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              {activeTier === t.name && (
                <span className="absolute -top-2.5 right-3 bg-brand-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Active Tier
                </span>
              )}
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{t.name} Plan</h3>
                <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 my-1">{t.price}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{t.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">{t.credits}</span>
                <button 
                  onClick={() => setActiveTier(t.name)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTier === t.name 
                      ? 'bg-brand-500 text-white shadow-glow' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {activeTier === t.name ? 'Active Plan' : 'Switch Tier'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys & Integrations Card */}
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          AISA Connect™ API Keys & Webhooks
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-300 mb-1">Production Secret Key</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={apiKey} 
                className="flex-1 glass-input text-xs font-mono text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900" 
              />
              <button onClick={copyKey} className="btn-secondary text-xs px-4">
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : 'Copy Key'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">WordPress / Webflow Webhook Integration</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Directly push approved articles to CMS endpoints.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20 font-bold text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          Logout from AISA™
        </button>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-500" /> Take Photo
            </h3>
            
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-800">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover transform -scale-x-100" 
              ></video>
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button 
                onClick={stopCamera}
                className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-glow transition-colors"
              >
                Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Save Success Modal */}
      {isSavedPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/25">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-900 dark:text-white font-extrabold text-lg">Profile Updated!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your profile details and settings have been saved successfully.</p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button 
                onClick={() => {
                  setIsSavedPopupOpen(false);
                  setActiveModule('dashboard');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => setIsSavedPopupOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-glow transition-all"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
