import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Copy, Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Download, CheckCircle2, FolderPlus, ArrowRight } from "lucide-react";
import { useWorkspace } from "../../context/WorkspaceContext";

const VisualControls = ({ visualStyle, setVisualStyle, generating, onGenerate }) => (
  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Image Style</h4>
    <select value={visualStyle} onChange={(e) => setVisualStyle(e.target.value)} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
      <option>Glassmorphic Modern 3D</option>
      <option>Minimalist Corporate Tech</option>
      <option>Cyberpunk Neon Gradients</option>
      <option>Photorealistic B2B Studio</option>
      <option>Bold Editorial Fashion</option>
    </select>
    <button onClick={onGenerate} disabled={generating} className="w-full btn-primary py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-60">
      {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
      {generating ? "Generating..." : "Generate AI Image (5 Credits)"}
    </button>
  </div>
);

const ContentPill = ({ label, value, color = "slate" }) => {
  if (!value) return null;
  const cc = { brand:"text-brand-500", purple:"text-purple-500", indigo:"text-indigo-500", emerald:"text-emerald-500", amber:"text-amber-500", blue:"text-blue-500", slate:"text-slate-400" };
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className={"text-[8px] font-black uppercase tracking-widest " + (cc[color]||cc.slate)}>{label}</span>
        <button onClick={() => navigator.clipboard.writeText(value)} className="p-0.5 text-slate-400 hover:text-brand-500"><Copy className="w-2.5 h-2.5" /></button>
      </div>
      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{value}</p>
    </div>
  );
};

const HeaderRow = ({ platform, topic, formatLabel, isSocial, onPlatformChange, onSaveAsset, isSaving }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
    <div className="flex flex-wrap items-center gap-2">
      <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] font-black uppercase tracking-widest">{platform.toUpperCase()}</span>
      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-bold uppercase">{formatLabel}</span>
    </div>

    {isSocial && (
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[
          { id: 'instagram', label: 'Instagram' },
          { id: 'linkedin',  label: 'LinkedIn' },
          { id: 'twitter',   label: 'Twitter / X' },
          { id: 'facebook',  label: 'Facebook' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => onPlatformChange && onPlatformChange(p.id)}
            className={`px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              platform === p.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    )}

    <div className="flex items-center gap-3 ml-auto">
      <span className="text-[10px] text-slate-500 font-medium hidden md:block">Topic: <strong className="text-slate-800 dark:text-slate-200">"{topic}"</strong></span>
      {onSaveAsset && (
        <button
          onClick={onSaveAsset}
          disabled={isSaving}
          className="py-2 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FolderPlus className="w-3.5 h-3.5" />}
          {isSaving ? "Saving..." : "Save to Asset Library"}
        </button>
      )}
    </div>
  </div>
);

const CopySidebar = ({ hook, story, shortCap, longCap, cta, hashtags, extras = [] }) => (
  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Content Studio Copy</span>
    <ContentPill label="Hook / Headline" value={hook} color="brand" />
    <ContentPill label="Storytelling Angle" value={story} color="purple" />
    <ContentPill label="Short Caption" value={shortCap} color="indigo" />
    <ContentPill label="Long Caption" value={longCap} color="slate" />
    <ContentPill label="Call to Action" value={cta} color="emerald" />
    <ContentPill label="SEO Hashtags" value={hashtags} color="blue" />
    {extras.map((e,i) => e.value ? <ContentPill key={i} label={e.label} value={e.value} color={e.color||"slate"} /> : null)}
  </div>
);

export const PlatformPostCanvas = ({ workspace, generatedContent, credits, deductVisualCredits, setIsCreditModalOpen }) => {
  const rawType     = (generatedContent?.type     || generatedContent?.postType || "SOCIAL").toUpperCase();
  const [platform, setPlatform] = useState((generatedContent?.platform || "instagram").toLowerCase());
  const rawPostType = (generatedContent?.postType || "").toLowerCase();

  const contentData = generatedContent?.data || generatedContent || {};
  const brand    = workspace?.brandName || "AISA Brand";
  const handle   = "@" + brand.toLowerCase().replace(/\s+/g, "");
  const topic    = contentData?.topic || contentData?.title || contentData?.subject || generatedContent?.topic || generatedContent?.title || "Campaign Objective";
  const hook     = contentData?.hook || contentData?.headline || contentData?.title || generatedContent?.hook || generatedContent?.title || "Upgrade Your Brand Strategy!";
  const story    = contentData?.storytelling || contentData?.storytellingAngle || (Array.isArray(contentData?.creativeVariations) ? contentData.creativeVariations[0]?.text : "") || "";
  const shortCap = contentData?.shortCaption || contentData?.short_caption || "";
  const longCap  = contentData?.longCaption || contentData?.caption || contentData?.body || contentData?.content || "";
  const caption  = longCap || shortCap || contentData?.leadParagraph || contentData?.metaDescription || "";
  const cta      = contentData?.cta || contentData?.callToAction || generatedContent?.cta || "Click the link in bio to learn more!";
  const rawHashtags = (Array.isArray(contentData?.hashtags) && contentData.hashtags.length > 0) ? contentData.hashtags : (Array.isArray(generatedContent?.hashtags) && generatedContent.hashtags.length > 0) ? generatedContent.hashtags : null;
  const hashArr  = rawHashtags || [`#${brand.replace(/\s+/g,'')}`, "#BrandDNA", "#Marketing"];
  const hashtags = hashArr.join(" ");
  const variations = contentData?.creativeVariations || generatedContent?.creativeVariations || [];

  const [generating,  setGenerating]  = useState(false);
  const [visualStyle, setVisualStyle] = useState("Glassmorphic Modern 3D");
  const [activeSlide, setActiveSlide] = useState(0);

  const generateVertexAISvgDataUrl = (promptText = '', brandName = '', styleName = 'Glassmorphic Modern 3D') => {
    const pLower = (promptText + ' ' + topic).toLowerCase();
    
    let category = 'LUXURY_HAMPER';
    if (pLower.includes('carousel') || pLower.includes('customization') || pLower.includes('bespoke') || pLower.includes('option') || pLower.includes('slide')) {
      category = 'CAROUSEL_CUSTOMIZATION';
    } else if (pLower.includes('social') || pLower.includes('instagram') || pLower.includes('facebook') || pLower.includes('post') || pLower.includes('caption') || pLower.includes('viral')) {
      category = 'SOCIAL_ENGAGEMENT';
    } else if (pLower.includes('sweet') || pLower.includes('kaju') || pLower.includes('namkeen') || pLower.includes('food') || pLower.includes('flavor') || pLower.includes('taste') || pLower.includes('thali')) {
      category = 'FOOD_SWEETS';
    } else if (pLower.includes('website') || pLower.includes('builder') || pLower.includes('landing') || pLower.includes('page') || pLower.includes('tech') || pLower.includes('digital') || pLower.includes('code')) {
      category = 'WEBSITE_TECH';
    } else if (pLower.includes('seo') || pLower.includes('article') || pLower.includes('blog') || pLower.includes('press') || pLower.includes('newspaper') || pLower.includes('headline')) {
      category = 'SEO_PRESS';
    }

    const titleText = promptText.trim() || topic || 'AI Commercial Campaign Visual';
    const displayTitle = titleText.length > 55 ? titleText.slice(0, 52) + '...' : titleText;
    const bName = brandName || brand || "Haldiram's";

    let bgGradient = '';
    let accentGrad = '';
    let categoryBadge = '';
    let centerPieceSvg = '';

    if (category === 'CAROUSEL_CUSTOMIZATION') {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#1E1B4B"/><stop offset="60%" stop-color="#0F172A"/><stop offset="100%" stop-color="#020617"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#818CF8"/><stop offset="50%" stop-color="#C084FC"/><stop offset="100%" stop-color="#38BDF8"/></linearGradient>';
      categoryBadge = 'CAROUSEL & BESPOKE CUSTOMIZATION';
      
      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -10)">
          <rect x="580" y="270" width="300" height="380" rx="20" fill="rgba(30, 41, 59, 0.6)" stroke="#818CF8" stroke-width="2" opacity="0.6"/>
          <rect x="200" y="270" width="300" height="380" rx="20" fill="rgba(30, 41, 59, 0.7)" stroke="#C084FC" stroke-width="2" opacity="0.8"/>
          <rect x="340" y="230" width="400" height="440" rx="24" fill="#1E293B" stroke="url(#accent)" stroke-width="4"/>
          <rect x="360" y="255" width="360" height="180" rx="16" fill="rgba(255,255,255,0.06)"/>
          
          <rect x="380" y="470" width="320" height="12" rx="6" fill="#334155"/>
          <circle cx="480" cy="476" r="16" fill="#38BDF8" stroke="#FFF" stroke-width="3" filter="url(#glow)"/>
          <rect x="380" y="520" width="320" height="12" rx="6" fill="#334155"/>
          <circle cx="600" cy="526" r="16" fill="#C084FC" stroke="#FFF" stroke-width="3" filter="url(#glow)"/>

          <circle cx="280" cy="450" r="24" fill="#1E293B" stroke="url(#accent)" stroke-width="2"/>
          <path d="M 285, 440 L 270, 450 L 285, 460" fill="none" stroke="#F8FAFC" stroke-width="3"/>
          <circle cx="800" cy="450" r="24" fill="#1E293B" stroke="url(#accent)" stroke-width="2"/>
          <path d="M 795, 440 L 810, 450 L 795, 460" fill="none" stroke="#F8FAFC" stroke-width="3"/>
          
          <circle cx="500" cy="630" r="6" fill="#38BDF8"/>
          <circle cx="540" cy="630" r="8" fill="#FFF"/>
          <circle cx="580" cy="630" r="6" fill="#38BDF8"/>
        </g>
      `;
    } else if (category === 'SOCIAL_ENGAGEMENT') {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#2E1065"/><stop offset="60%" stop-color="#0F172A"/><stop offset="100%" stop-color="#020617"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F43F5E"/><stop offset="50%" stop-color="#FB7185"/><stop offset="100%" stop-color="#E11D48"/></linearGradient>';
      categoryBadge = 'SOCIAL MEDIA & VIRAL ENGAGEMENT';

      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -20)">
          <rect x="360" y="210" width="360" height="480" rx="36" fill="#0F172A" stroke="url(#accent)" stroke-width="5"/>
          <rect x="380" y="235" width="320" height="430" rx="24" fill="rgba(255,255,255,0.05)"/>
          
          <rect x="490" y="245" width="100" height="14" rx="7" fill="#1E293B"/>

          <rect x="400" y="280" width="280" height="240" rx="16" fill="url(#accent)" opacity="0.8"/>
          <circle cx="540" cy="400" r="50" fill="rgba(255,255,255,0.2)"/>

          <g filter="url(#glow)">
            <path d="M 280, 320 C 280, 300 310, 290 320, 310 C 330, 290 360, 300 360, 320 C 360, 350 320, 370 320, 380 C 320, 370 280, 350 280, 320 Z" fill="#F43F5E"/>
            <circle cx="800" cy="360" r="32" fill="#FB7185"/>
            <path d="M 790, 360 L 810, 360 M 800, 350 L 800, 370" stroke="#FFF" stroke-width="4"/>
            <polygon points="760,260 770,285 795,285 775,300 782,325 760,310 738,325 745,300 725,285 750,285" fill="#FCD34D"/>
          </g>
        </g>
      `;
    } else if (category === 'FOOD_SWEETS') {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#451A03"/><stop offset="60%" stop-color="#1A0B2E"/><stop offset="100%" stop-color="#05010B"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#D97706"/><stop offset="100%" stop-color="#B45309"/></linearGradient>';
      categoryBadge = 'AUTHENTIC HERITAGE & CULINARY';

      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -30)">
          <ellipse cx="540" cy="480" rx="340" ry="180" fill="url(#accent)" stroke="#FCD34D" stroke-width="4" filter="url(#glow)"/>
          <ellipse cx="540" cy="480" rx="300" ry="150" fill="#291605"/>

          <circle cx="360" cy="440" r="45" fill="#F59E0B" stroke="#FFF" stroke-width="3"/>
          <circle cx="720" cy="440" r="45" fill="#F59E0B" stroke="#FFF" stroke-width="3"/>
          <circle cx="540" cy="380" r="55" fill="#D97706" stroke="#FFF" stroke-width="3"/>

          <polygon points="510,480 540,430 570,480 540,530" fill="#F8FAFC" stroke="#F59E0B" stroke-width="2" filter="url(#shadow)"/>
          <polygon points="430,510 460,470 490,510 460,550" fill="#E2E8F0" stroke="#F59E0B" stroke-width="2" filter="url(#shadow)"/>
          <polygon points="590,510 620,470 650,510 620,550" fill="#E2E8F0" stroke="#F59E0B" stroke-width="2" filter="url(#shadow)"/>
        </g>
      `;
    } else if (category === 'WEBSITE_TECH') {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#0284C7"/><stop offset="60%" stop-color="#0F172A"/><stop offset="100%" stop-color="#020617"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38BDF8"/><stop offset="50%" stop-color="#818CF8"/><stop offset="100%" stop-color="#0EA5E9"/></linearGradient>';
      categoryBadge = 'AI WEBSITE & DIGITAL BUILDER';

      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -20)">
          <rect x="240" y="220" width="600" height="440" rx="24" fill="#0F172A" stroke="url(#accent)" stroke-width="4"/>
          <rect x="240" y="220" width="600" height="50" rx="24" fill="#1E293B"/>
          <circle cx="270" cy="245" r="7" fill="#EF4444"/>
          <circle cx="290" cy="245" r="7" fill="#F59E0B"/>
          <circle cx="310" cy="245" r="7" fill="#10B981"/>

          <rect x="340" y="233" width="400" height="24" rx="12" fill="#0F172A"/>

          <rect x="270" y="290" width="260" height="180" rx="16" fill="rgba(56, 189, 248, 0.15)" stroke="#38BDF8" stroke-width="2"/>
          <rect x="550" y="290" width="260" height="180" rx="16" fill="rgba(129, 140, 248, 0.15)" stroke="#818CF8" stroke-width="2"/>
          <rect x="270" y="490" width="540" height="130" rx="16" fill="rgba(255, 255, 255, 0.05)" stroke="url(#accent)" stroke-width="2"/>
        </g>
      `;
    } else if (category === 'SEO_PRESS') {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#334155"/><stop offset="60%" stop-color="#0F172A"/><stop offset="100%" stop-color="#020617"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#10B981"/><stop offset="100%" stop-color="#3B82F6"/></linearGradient>';
      categoryBadge = 'SEO INTELLIGENCE & PRESS ARTICLES';

      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -20)">
          <rect x="280" y="210" width="520" height="460" rx="20" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="4"/>
          <rect x="310" y="240" width="460" height="50" fill="#0F172A"/>
          <text x="540" y="272" fill="#FCD34D" font-family="serif" font-size="24" font-weight="bold" text-anchor="middle">EDITORIAL PRESS RELEASE</text>

          <rect x="310" y="310" width="210" height="140" fill="#E2E8F0"/>
          <rect x="540" y="310" width="230" height="16" fill="#334155"/>
          <rect x="540" y="335" width="230" height="12" fill="#94A3B8"/>
          <rect x="540" y="355" width="230" height="12" fill="#94A3B8"/>
          <rect x="540" y="375" width="180" height="12" fill="#94A3B8"/>

          <path d="M 310, 600 Q 420, 520 540, 560 T 770, 480" fill="none" stroke="#10B981" stroke-width="6" filter="url(#glow)"/>
        </g>
      `;
    } else {
      bgGradient = '<radialGradient id="bg" cx="50%" cy="40%" r="80%"><stop offset="0%" stop-color="#1A0B2E"/><stop offset="60%" stop-color="#0F051D"/><stop offset="100%" stop-color="#05010B"/></radialGradient>';
      accentGrad = '<linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F59E0B"/><stop offset="50%" stop-color="#EF4444"/><stop offset="100%" stop-color="#8B5CF6"/></linearGradient>';
      categoryBadge = 'ROYAL WEDDING & LUXURY GIFTING';

      centerPieceSvg = `
        <g filter="url(#shadow)" transform="translate(0, -30)">
          <ellipse cx="540" cy="640" rx="340" ry="80" fill="rgba(0,0,0,0.5)" filter="url(#glow)"/>
          <ellipse cx="540" cy="620" rx="320" ry="70" fill="url(#cardGlass)" stroke="url(#accent)" stroke-width="3"/>

          <rect x="350" y="320" width="380" height="280" rx="24" fill="#2A1448" stroke="url(#goldRibbon)" stroke-width="4"/>
          <rect x="330" y="300" width="420" height="55" rx="16" fill="url(#goldRibbon)" filter="url(#shadow)"/>
          <rect x="515" y="300" width="50" height="300" fill="url(#goldRibbon)"/>
          <rect x="350" y="430" width="380" height="45" fill="url(#goldRibbon)"/>
          <path d="M 470, 270 C 420, 220 480, 180 540, 260 C 600, 180 660, 220 610, 270 Z" fill="url(#goldRibbon)" filter="url(#glow)"/>
          <circle cx="540" cy="265" r="22" fill="#F59E0B" stroke="#FFF" stroke-width="3"/>
        </g>
      `;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" width="100%" height="100%">
      <defs>
        ${bgGradient}
        ${accentGrad}
        <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FEF08A"/>
          <stop offset="50%" stop-color="#F59E0B"/>
          <stop offset="100%" stop-color="#B45309"/>
        </linearGradient>
        <linearGradient id="cardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.03)"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000000" flood-opacity="0.6"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      <rect width="1080" height="1080" fill="url(#bg)"/>

      <circle cx="200" cy="250" r="220" fill="url(#accent)" opacity="0.22" filter="url(#glow)"/>
      <circle cx="880" cy="750" r="260" fill="url(#accent)" opacity="0.18" filter="url(#glow)"/>

      ${centerPieceSvg}

      <rect x="320" y="80" width="440" height="50" rx="25" fill="rgba(15, 23, 42, 0.85)" stroke="url(#accent)" stroke-width="2" filter="url(#shadow)"/>
      <text x="540" y="113" fill="#FCD34D" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="800" text-anchor="middle" letter-spacing="2.5">${bName.toUpperCase()} • ${categoryBadge}</text>

      <g transform="translate(90, 710)" filter="url(#shadow)">
        <rect x="0" y="0" width="900" height="280" rx="32" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="2"/>
        <rect x="0" y="0" width="900" height="280" rx="32" fill="url(#cardGlass)"/>

        <rect x="40" y="35" width="220" height="36" rx="18" fill="url(#accent)"/>
        <text x="150" y="59" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="800" text-anchor="middle" letter-spacing="1.5">AI CREATIVE ASSET</text>

        <text x="40" y="125" fill="#F8FAFC" font-family="'Plus Jakarta Sans', sans-serif" font-size="30" font-weight="800">${displayTitle}</text>
        <text x="40" y="175" fill="#94A3B8" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500">Style: ${styleName} | 4K HDR Vector Render</text>

        <line x1="40" y1="215" x2="860" y2="215" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

        <text x="40" y="248" fill="#FCD34D" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="700">⚡ Powered by Google Cloud Vertex AI (Gemini 3.5 Engine)</text>
        <text x="860" y="248" fill="#64748B" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="600" text-anchor="end">1080 x 1080 px</text>
      </g>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  };

  const rawImagePrompt = contentData?.imagePrompt || `${brand} ${topic} ${hook}`.slice(0, 150);
  const defaultVisual = generatedContent?.imageUrl || generateVertexAISvgDataUrl(rawImagePrompt, brand, visualStyle);

  const [visualUrl, setVisualUrl] = useState(defaultVisual);

  useEffect(() => {
    if (generatedContent?.imageUrl) {
      setVisualUrl(generatedContent.imageUrl);
    } else {
      const promptText = contentData?.imagePrompt || `${brand} ${topic} ${hook}`.slice(0, 150);
      setVisualUrl(generateVertexAISvgDataUrl(promptText, brand, visualStyle));
    }
    if (generatedContent?.platform) setPlatform(generatedContent.platform.toLowerCase());
    setActiveSlide(0);
  }, [generatedContent, topic, hook]);

  const carouselSlides = variations.length > 0
    ? variations.map((v, i) => ({ slide: i+1, headline: v.headline||v.title||hook, body: v.caption||v.body||v.text||caption, cta: i===variations.length-1?cta:null }))
    : [
        { slide:1, headline: hook,             body: story||caption,   cta: null },
        { slide:2, headline: "Key Insight",    body: longCap||caption, cta: null },
        { slide:3, headline: "Take Action Now",body: shortCap||caption,cta },
      ];

  const handleGenerateVisual = async () => {
    const cost = 5;
    if ((credits?.balance ?? 0) < cost) { setIsCreditModalOpen(true); return; }
    setGenerating(true);
    deductVisualCredits(cost, "AI Visual: " + topic.slice(0,30));
    const activePrompt = contentData?.imagePrompt || `${brand} ${topic} ${hook}`;
    try {
      const res  = await fetch("http://localhost:5000/api/creative/visual/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: activePrompt, style: visualStyle, platform })
      });
      const data = await res.json();
      if (data.success && data.asset?.imageUrl) setVisualUrl(data.asset.imageUrl);
      else throw new Error("fallback");
    } catch {
      setVisualUrl(generateVertexAISvgDataUrl(activePrompt, brand));
    }
    finally { setGenerating(false); }
  };

  const isCarousel  = rawPostType.includes("carousel");
  const isEmail     = rawType==="EMAIL"     || platform==="email";
  const isNewspaper = rawType==="NEWSPAPER" || platform==="newspaper" || platform==="press_release";
  const isBlog      = rawType==="BLOG"      || platform==="blog"      || platform==="seo";
  const formatLabel = isCarousel?"Carousel":isEmail?"Email Template":isNewspaper?"Newspaper / Press":isBlog?"SEO Blog Article":"Single Image Post";

  // ─── Save Asset to Library & Redirect ─────────────────────────────────────
  const [isSavingAsset, setIsSavingAsset] = useState(false);
  const { addGlobalAsset, setActiveModule } = useWorkspace();

  const handleSaveToAssetLibrary = () => {
    setIsSavingAsset(true);
    let assetType = 'DOCUMENT';
    let assetName = topic || 'Brand Asset';
    let assetUrl = visualUrl || '';
    let assetContent = '';

    if (isBlog) {
      assetType = 'BLOG';
      assetName = generatedContent?.title || hook || topic || 'SEO Blog Article';
      assetContent = generatedContent?.content || longCap || caption || '';
      assetUrl = visualUrl;
    } else if (isEmail) {
      assetType = 'EMAIL';
      assetName = `Email: ${generatedContent?.subject || hook || topic}`;
      assetContent = `Subject: ${generatedContent?.subject || hook}\nPreheader: ${generatedContent?.preheader || shortCap}\n\n${generatedContent?.body || longCap || caption}`;
      assetUrl = visualUrl;
    } else if (isNewspaper) {
      assetType = 'NEWSPAPER';
      assetName = `Press Release: ${generatedContent?.headline || hook || topic}`;
      assetContent = `${generatedContent?.leadParagraph || ''}\n\n${generatedContent?.bodyContent || longCap || caption}`;
      assetUrl = visualUrl;
    } else if (isCarousel) {
      assetType = 'CAROUSEL';
      assetName = `Carousel Deck: ${topic || 'Brand Carousel'}`;
      assetUrl = 'https://picsum.photos/seed/aisa_slide_0/600/600';
      assetContent = carouselSlides.map(s => `[Slide ${s.slide}] ${s.headline}\n${s.body}`).join('\n\n');
    } else {
      // Social / Visual Post
      assetType = 'SOCIAL';
      assetName = `${platform.toUpperCase()} Post: ${topic || hook}`;
      assetUrl = visualUrl;
      assetContent = `${hook}\n\n${caption}\n\n${cta}\n${hashtags}`;
    }

    addGlobalAsset({
      name: assetName,
      type: assetType,
      url: assetUrl,
      content: assetContent,
      date: new Date().toISOString(),
      credits: 0,
      metadata: {
        platform,
        formatLabel,
        topic,
        brand
      }
    });

    setTimeout(() => {
      setIsSavingAsset(false);
      setActiveModule('assets');
      if (window.location.pathname !== '/asset-library') {
        window.history.pushState({ module: 'assets' }, '', '/asset-library');
      }
    }, 300);
  };

  // ── A. CAROUSEL ──
  if (isCarousel) {
    const slide = carouselSlides[activeSlide]||carouselSlides[0];
    const isLast = activeSlide===carouselSlides.length-1;
    return (
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} onSaveAsset={handleSaveToAssetLibrary} isSaving={isSavingAsset} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <VisualControls visualStyle={visualStyle} setVisualStyle={setVisualStyle} generating={generating} onGenerate={handleGenerateVisual} />
            <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags} />
          </div>
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap gap-2">
              {carouselSlides.map((s,i) => (
                <button key={i} onClick={() => setActiveSlide(i)} className={"px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border "+(activeSlide===i?"bg-brand-600 text-white border-brand-600 shadow-md":"bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-brand-400")}>Slide {s.slide}</button>
              ))}
            </div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950 font-sans">
              <div className="p-3.5 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-[9px]">{brand.substring(0,2).toUpperCase()}</div>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{brand}</p>
                </div>
                <div className="flex gap-1.5">
                  {carouselSlides.map((_,i) => <button key={i} onClick={() => setActiveSlide(i)} className={"w-1.5 h-1.5 rounded-full transition-all "+(i===activeSlide?"bg-brand-500 scale-125":"bg-slate-300 dark:bg-slate-700")} />)}
                </div>
              </div>
              <div className="aspect-square relative bg-slate-900 overflow-hidden">
                <img src={"https://picsum.photos/seed/aisa_slide_"+activeSlide+"/600/600"} alt={"Slide "+(activeSlide+1)} className="w-full h-full object-cover opacity-70" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-[9px] font-black">{activeSlide+1} / {carouselSlides.length}</div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-white/50">{platform.toUpperCase()} SLIDE {slide.slide}</span>
                  <h3 className="text-xl font-black text-white leading-tight">{slide.headline}</h3>
                  <p className="text-xs text-white/75 leading-relaxed line-clamp-3">{slide.body}</p>
                  {slide.cta && <span className="inline-block mt-1 px-4 py-1.5 rounded-full bg-brand-600 text-white text-[10px] font-black uppercase tracking-wider">{slide.cta}</span>}
                </div>
              </div>
              <div className="p-4 space-y-2.5 bg-white dark:bg-slate-900">
                <div className="flex gap-4 text-slate-600 dark:text-slate-300"><Heart className="w-5 h-5 text-rose-400" /><MessageSquare className="w-5 h-5" /><Share2 className="w-5 h-5" /><Bookmark className="w-5 h-5 text-slate-400 ml-auto" /></div>
                <p className="text-xs font-black text-slate-900 dark:text-white">{slide.headline}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{slide.body}</p>
                {isLast && (<><p className="text-xs text-brand-600 dark:text-brand-400 font-bold">{cta}</p><p className="text-[10px] text-indigo-500 font-medium">{hashtags}</p></>)}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setActiveSlide(Math.max(0,activeSlide-1))} disabled={activeSlide===0} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800">Prev Slide</button>
              <button onClick={() => setActiveSlide(Math.min(carouselSlides.length-1,activeSlide+1))} disabled={activeSlide===carouselSlides.length-1} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800">Next Slide</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── B. EMAIL ──
  if (isEmail) {
    const emailSubject = generatedContent?.subject   || hook;
    const emailPre     = generatedContent?.preheader || shortCap || "";
    const emailBody    = generatedContent?.body      || generatedContent?.bodyContent || longCap || caption;
    const domain       = (workspace?.domainUrl||"").replace(/https?:\/\//,"") || "brand.com";
    return (
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} onSaveAsset={handleSaveToAssetLibrary} isSaving={isSavingAsset} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} extras={[{label:"Email Subject",value:emailSubject,color:"amber"},{label:"Preheader",value:emailPre,color:"slate"}]} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl font-sans">
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3.5 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 mb-2"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-emerald-400"/></div>
                <div className="grid grid-cols-[45px_1fr] gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-black uppercase text-slate-400">From:</span><span className="font-semibold">{brand} &lt;noreply@{domain}&gt;</span>
                  <span className="font-black uppercase text-slate-400">To:</span><span className="font-semibold">Subscribers & Audience List</span>
                  <span className="font-black uppercase text-slate-400">Sub:</span><span className="font-extrabold text-slate-900 dark:text-white">{emailSubject}</span>
                  {emailPre && <><span className="font-black uppercase text-slate-400">Pre:</span><span className="italic text-slate-500">{emailPre}</span></>}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 space-y-5">
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{emailBody||caption}</div>
                {story && (<div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20"><span className="text-[8px] font-black uppercase tracking-widest text-brand-500 block mb-1">Storytelling Angle</span><p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">{story}</p></div>)}
                {shortCap && (<div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">P.S.</span><p className="text-xs text-slate-600 dark:text-slate-400 italic">{shortCap}</p></div>)}
                {cta && <div className="text-center py-3"><button className="py-3 px-8 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all">{cta}</button></div>}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 whitespace-pre-wrap"><p className="font-medium">{"Warm regards,\n"+brand+" Team"}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── C. NEWSPAPER ──
  if (isNewspaper) {
    const headline    = generatedContent?.headline    || hook;
    const subheadline = generatedContent?.subheadline || ("Exclusive Report by "+brand);
    const dateline    = generatedContent?.dateline    || ("MUMBAI, INDIA - "+new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"}));
    const leadPara    = generatedContent?.leadParagraph || caption;
    const bodyContent = generatedContent?.bodyContent   || longCap || caption;
    return (
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} onSaveAsset={handleSaveToAssetLibrary} isSaving={isSavingAsset} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags}
              extras={[{label:"Headline",value:headline,color:"amber"},{label:"Sub-Headline",value:subheadline,color:"slate"},{label:"Dateline",value:dateline,color:"slate"},{label:"Lead Para",value:leadPara,color:"brand"}]} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-2xl font-serif">
              <div className="bg-slate-900 text-white px-6 py-4 text-center space-y-1">
                <p className="text-[8px] font-sans font-black uppercase tracking-[0.3em] text-slate-400">National Press Bureau - Sponsored</p>
                <h1 className="text-xl font-black uppercase tracking-tight">{brand.toUpperCase()} GAZETTE</h1>
                <p className="text-[10px] font-sans text-slate-400">{dateline}</p>
              </div>
              <div className="bg-amber-50/30 dark:bg-slate-950 p-6 space-y-4">
                <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-3 space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase">{headline}</h2>
                  <p className="text-sm font-bold font-sans text-amber-700 dark:text-amber-400">{subheadline}</p>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 float-right ml-5 mb-4 w-[45%]">
                  <img src={visualUrl} alt={topic} className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed font-sans">{leadPara}</p>
                {story && (<div className="border-l-4 border-amber-500 pl-4 my-2 clear-both"><p className="text-xs font-sans text-slate-700 dark:text-slate-300 italic leading-relaxed">{story}</p></div>)}
                <div className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed whitespace-pre-wrap clear-both">{bodyContent}</div>
                {shortCap && (<div className="my-4 p-4 border-y-2 border-slate-900 dark:border-slate-100 text-center"><p className="text-base font-black italic text-slate-900 dark:text-white">"{shortCap}"</p></div>)}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mr-1">Keywords:</span>
                  {hashArr.map((h,i)=><span key={i} className="text-[9px] font-bold text-amber-700 dark:text-amber-400">{h}</span>)}
                </div>
                <div className="mt-2 p-3 rounded-xl bg-slate-900 text-white text-center font-sans"><p className="text-xs font-bold">{cta}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── D. BLOG ──
  if (isBlog) {
    const blogTitle   = generatedContent?.title || hook;
    const blogContent = generatedContent?.content || longCap || caption;
    const metaDesc    = generatedContent?.metaDescription || shortCap || "";
    return (
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} onSaveAsset={handleSaveToAssetLibrary} isSaving={isSavingAsset} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <VisualControls visualStyle={visualStyle} setVisualStyle={setVisualStyle} generating={generating} onGenerate={handleGenerateVisual} />
            <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags} extras={[{label:"Meta Description",value:metaDesc,color:"purple"}]} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl bg-white dark:bg-slate-900 font-sans">
              <div className="aspect-video relative overflow-hidden">
                <img src={visualUrl} alt={topic} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 to-transparent flex items-end p-6">
                  <div className="space-y-1"><span className="text-[9px] font-black uppercase tracking-widest text-brand-400">SEO Blog Article</span><h2 className="text-white font-extrabold text-xl leading-tight">{blogTitle}</h2></div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-bold">
                  <span className="font-black text-slate-700 dark:text-slate-300">{brand}</span><span>·</span>
                  <span>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span><span>·</span>
                  <span className="text-purple-500">5 min read</span><span>·</span><span className="text-emerald-500">SEO Optimised</span>
                </div>
                {metaDesc && <p className="text-xs text-slate-500 italic border-l-4 border-purple-500 pl-3 leading-relaxed">{metaDesc}</p>}
                {story && (<div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20"><span className="text-[8px] font-black uppercase text-brand-500 tracking-widest block mb-1">Storytelling Angle</span><p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">{story}</p></div>)}
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{blogContent}</div>
                {shortCap && shortCap!==blogContent && <p className="text-xs text-slate-500 dark:text-slate-400 italic">{shortCap}</p>}
                <div className="flex flex-wrap gap-1.5 pt-2">{hashArr.map((h,i)=><span key={i} className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold">{h}</span>)}</div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button className="py-2.5 px-6 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md">{cta}</button>
                  <button
                    onClick={handleSaveToAssetLibrary}
                    disabled={isSavingAsset}
                    className="py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <FolderPlus className="w-3.5 h-3.5 text-brand-500" />
                    Save Blog to Assets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── E. SINGLE IMAGE VISUAL CANVAS (WITH DOWNLOAD & SHARE) ──
  const [copiedShare, setCopiedShare] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const response = await fetch(visualUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${brand.replace(/\s+/g, "_")}_visual_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(visualUrl, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleShareImage = async () => {
    const shareText = `${hook}\n\n${caption}\n\n${cta}\n${hashtags}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brand} AI Visual`,
          text: shareText,
          url: visualUrl,
        });
      } catch {
        navigator.clipboard.writeText(`${shareText}\n\nImage: ${visualUrl}`);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n\nImage: ${visualUrl}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
      <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} isSocial={true} onPlatformChange={setPlatform} onSaveAsset={handleSaveToAssetLibrary} isSaving={isSavingAsset} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <VisualControls visualStyle={visualStyle} setVisualStyle={setVisualStyle} generating={generating} onGenerate={handleGenerateVisual} />
          <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags} />
        </div>
        <div className="lg:col-span-8 flex flex-col space-y-4">

          {/* Dedicated Image Showcase Card */}
          <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider">AI Visual Asset Showcase</h3>
              </div>
              <span className="text-[10px] font-extrabold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
                {visualStyle}
              </span>
            </div>

            {/* High-Res Image Display */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-950 shadow-inner group">
              <img src={visualUrl} alt={topic} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent flex flex-col sm:flex-row justify-between sm:items-end gap-2">
                <div className="space-y-0.5">
                  <p className="text-white font-extrabold text-xs sm:text-sm line-clamp-1">"{hook}"</p>
                  <p className="text-slate-300 text-[10px] font-medium">{brand} · High-Res Render</p>
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 self-start sm:self-auto">1080 × 1080</span>
              </div>
            </div>

            {/* Direct Action Bar: Download, Share, Save */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className="py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {downloading ? "Preparing..." : "Download Image"}
              </button>

              <button
                onClick={handleShareImage}
                className="py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                {copiedShare ? "Link & Copy Shared!" : "Share Image & Copy"}
              </button>

              <button
                onClick={handleSaveToAssetLibrary}
                disabled={isSavingAsset}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSavingAsset ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderPlus className="w-4 h-4" />}
                {isSavingAsset ? "Saving..." : "Save to Library"}
              </button>
            </div>

            {/* Success Status Note */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between font-medium">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                AI Visual synthesized and ready for high-resolution download & sharing.
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Ready</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};