import React, { useState, useEffect } from "react";
import { Sparkles, Loader2, Copy, Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";

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

const HeaderRow = ({ platform, topic, formatLabel, isSocial, onPlatformChange }) => (
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

    <span className="text-[10px] text-slate-500 font-medium hidden md:block">Topic: <strong className="text-slate-800 dark:text-slate-200">"{topic}"</strong></span>
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

  const [visualUrl,   setVisualUrl]   = useState(generatedContent?.imageUrl || "https://picsum.photos/seed/aisavisual/800/800");
  const [generating,  setGenerating]  = useState(false);
  const [visualStyle, setVisualStyle] = useState("Glassmorphic Modern 3D");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (generatedContent?.imageUrl) setVisualUrl(generatedContent.imageUrl);
    if (generatedContent?.platform) setPlatform(generatedContent.platform.toLowerCase());
    setActiveSlide(0);
  }, [generatedContent]);

  const brand    = workspace?.brandName || "AISA Brand";
  const handle   = "@" + brand.toLowerCase().replace(/\s+/g, "");
  const topic    = generatedContent?.topic    || generatedContent?.title    || generatedContent?.subject || "Campaign Objective";
  const hook     = generatedContent?.hook     || generatedContent?.headline || generatedContent?.title  || "Upgrade Your Brand Strategy!";
  const story    = generatedContent?.storytelling || generatedContent?.storytellingAngle || "";
  const shortCap = generatedContent?.shortCaption || "";
  const longCap  = generatedContent?.longCaption  || generatedContent?.caption || "";
  const caption  = shortCap || longCap || generatedContent?.leadParagraph || generatedContent?.metaDescription || "";
  const cta      = generatedContent?.cta || generatedContent?.callToAction || "Click the link in bio to learn more!";
  const hashArr  = generatedContent?.hashtags?.length > 0 ? generatedContent.hashtags : ["#AIMarketing","#ContentVelocity","#BrandDNA"];
  const hashtags = hashArr.join(" ");
  const variations = generatedContent?.creativeVariations || [];

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
    try {
      const res  = await fetch("http://localhost:5000/api/creative/visual/generate", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ prompt: topic+" - "+hook, style: visualStyle, platform }) });
      const data = await res.json();
      if (data.success && data.asset?.imageUrl) setVisualUrl(data.asset.imageUrl); else throw new Error("fallback");
    } catch { setVisualUrl("https://picsum.photos/seed/"+Date.now()+"/800/800"); }
    finally  { setGenerating(false); }
  };

  const isCarousel  = rawPostType.includes("carousel");
  const isEmail     = rawType==="EMAIL"     || platform==="email";
  const isNewspaper = rawType==="NEWSPAPER" || platform==="newspaper" || platform==="press_release";
  const isBlog      = rawType==="BLOG"      || platform==="blog"      || platform==="seo";
  const formatLabel = isCarousel?"Carousel":isEmail?"Email Template":isNewspaper?"Newspaper / Press":isBlog?"SEO Blog Article":"Single Image Post";
  // ── A. CAROUSEL ──
  if (isCarousel) {
    const slide = carouselSlides[activeSlide]||carouselSlides[0];
    const isLast = activeSlide===carouselSlides.length-1;
    return (
      <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} />
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
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags} extras={[{label:"Email Subject",value:emailSubject,color:"amber"},{label:"Preheader",value:emailPre,color:"slate"}]} />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl font-sans">
              <div className="bg-slate-100 dark:bg-slate-800 px-5 py-3 border-b border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center gap-1.5 mb-2"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-emerald-400"/></div>
                <div className="grid grid-cols-[40px_1fr] gap-1 text-[10px] text-slate-600 dark:text-slate-300">
                  <span className="font-black uppercase text-slate-400">From:</span><span className="font-semibold">{brand} (noreply@{domain})</span>
                  <span className="font-black uppercase text-slate-400">To:</span><span className="font-semibold">Subscribers and Audience List</span>
                  <span className="font-black uppercase text-slate-400">Sub:</span><span className="font-bold text-slate-900 dark:text-white">{emailSubject}</span>
                  {emailPre && <><span className="font-black uppercase text-slate-400">Pre:</span><span className="italic text-slate-500">{emailPre}</span></>}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 space-y-5">
                <div className="w-full rounded-2xl overflow-hidden aspect-video relative bg-slate-100 dark:bg-slate-800">
                  <img src={visualUrl} alt={topic} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-5"><h2 className="text-white font-extrabold text-lg leading-tight">{hook}</h2></div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Dear Valued Customer,</p>
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border-l-4 border-brand-500/30 pl-4">{emailBody||caption}</div>
                {story && (<div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20"><span className="text-[8px] font-black uppercase tracking-widest text-brand-500 block mb-1">Storytelling Angle</span><p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">{story}</p></div>)}
                {shortCap && (<div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"><span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-0.5">P.S.</span><p className="text-xs text-slate-600 dark:text-slate-400 italic">{shortCap}</p></div>)}
                <div className="text-center py-2"><button className="py-3 px-8 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold text-xs shadow-lg">{cta}</button></div>
                <div className="flex flex-wrap gap-1.5 pt-1">{hashArr.map((h,i)=><span key={i} className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold">{h}</span>)}</div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800"><p className="text-xs text-slate-400 whitespace-pre-wrap">{"Warm regards,\n"+brand+" Marketing Team"}</p></div>
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
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} />
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
        <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} />
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
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800"><button className="py-2.5 px-6 rounded-xl bg-brand-600 text-white font-bold text-xs">{cta}</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ── E. SINGLE IMAGE SOCIAL ──
  return (
    <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6">
      <HeaderRow platform={platform} topic={topic} formatLabel={formatLabel} isSocial={true} onPlatformChange={setPlatform} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-4">
          <VisualControls visualStyle={visualStyle} setVisualStyle={setVisualStyle} generating={generating} onGenerate={handleGenerateVisual} />
          <CopySidebar hook={hook} story={story} shortCap={shortCap} longCap={longCap} cta={cta} hashtags={hashtags} />
        </div>
        <div className="lg:col-span-8 flex items-start justify-center">

          {platform==="instagram" && (
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden font-sans">
              <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-[9px]">{brand.substring(0,2).toUpperCase()}</div>
                  </div>
                  <div><p className="text-xs font-bold text-slate-900 dark:text-white">{brand.toLowerCase().replace(/\s+/g,"")}</p><p className="text-[9px] text-slate-400">Instagram - Sponsored</p></div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>
              <div className="aspect-square relative bg-slate-900 overflow-hidden">
                <img src={visualUrl} alt={topic} className="w-full h-full object-cover opacity-85" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-4">
                  <p className="text-white font-extrabold text-sm leading-snug">{hook}</p>
                  {story && <p className="text-white/60 text-[10px] mt-0.5 italic line-clamp-1">{story}</p>}
                </div>
              </div>
              <div className="p-4 space-y-2.5 bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4"><Heart className="w-5 h-5 text-rose-500 fill-rose-500" /><MessageSquare className="w-5 h-5" /><Share2 className="w-5 h-5" /></div>
                  <Bookmark className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">1,482 likes</p>
                <div className="text-xs space-y-1">
                  <p className="text-slate-800 dark:text-slate-200"><strong className="font-extrabold mr-1.5">{brand.toLowerCase().replace(/\s+/g,"")}</strong>{shortCap||caption}</p>
                  {longCap && longCap!==caption && <p className="text-slate-500 line-clamp-2 text-[11px]">{longCap}</p>}
                  <p className="text-brand-600 dark:text-brand-400 font-bold">{cta}</p>
                  <p className="text-indigo-500 font-medium text-[10px]">{hashtags}</p>
                </div>
              </div>
            </div>
          )}

          {platform==="linkedin" && (
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">{brand.substring(0,2).toUpperCase()}</div>
                  <div><h4 className="text-xs font-bold text-slate-900 dark:text-white">{brand}</h4><p className="text-[10px] text-slate-400">14,200 followers - Promoted</p></div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-extrabold uppercase">LinkedIn</span>
              </div>
              <div className="text-xs space-y-2 leading-relaxed">
                <p className="font-extrabold text-slate-900 dark:text-white text-sm">{hook}</p>
                {story && <p className="text-slate-500 italic text-[11px]">{story}</p>}
                <p className="text-slate-800 dark:text-slate-200">{shortCap||caption}</p>
                {longCap && longCap!==caption && <p className="text-slate-500 line-clamp-3 text-[11px]">{longCap}</p>}
                <p className="text-blue-600 dark:text-blue-400 font-bold">{cta}</p>
                <p className="text-blue-500 text-[11px] font-medium">{hashtags}</p>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"><img src={visualUrl} alt={topic} className="w-full h-full object-cover" /></div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500 font-bold">
                <span>Like</span><span>Comment</span><span>Repost</span><span>Send</span>
              </div>
            </div>
          )}

          {platform==="twitter" && (
            <div className="w-full max-w-lg rounded-3xl bg-black border border-slate-800 shadow-2xl p-5 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">{brand.substring(0,2).toUpperCase()}</div>
                  <div><div className="flex items-center gap-1"><span className="text-xs font-bold text-white">{brand}</span><span className="text-sky-400 text-xs">checkmark</span></div><span className="text-[10px] text-slate-400">{handle}</span></div>
                </div>
                <span className="text-xs text-slate-500 font-bold">X Post</span>
              </div>
              <div className="text-xs space-y-2 leading-relaxed">
                <p className="font-bold text-sm text-white">{hook}</p>
                {story && <p className="text-slate-400 italic text-[11px]">{story}</p>}
                <p className="text-slate-300">{shortCap||caption}</p>
                {longCap && longCap!==caption && <p className="text-slate-500 line-clamp-2 text-[11px]">{longCap}</p>}
                <p className="text-sky-400 font-bold">{cta}</p>
                <p className="text-sky-500 text-[11px] font-medium">{hashtags}</p>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800"><img src={visualUrl} alt={topic} className="w-full h-full object-cover" /></div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                <span>42 replies</span><span>128 reposts</span><span>954 likes</span><span>14.2K views</span>
              </div>
            </div>
          )}

          {(platform==="facebook"||platform==="youtube"||platform==="tiktok") && (
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-xs">{brand.substring(0,2).toUpperCase()}</div>
                  <div><h4 className="text-xs font-bold text-slate-900 dark:text-white">{brand}</h4><p className="text-[10px] text-slate-400">Sponsored</p></div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase">{platform}</span>
              </div>
              <div className="text-xs space-y-1.5 text-slate-800 dark:text-slate-200">
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{hook}</p>
                {story && <p className="text-slate-500 italic text-[11px]">{story}</p>}
                <p>{shortCap||caption}</p>
                {longCap && longCap!==caption && <p className="text-slate-500 line-clamp-2 text-[11px]">{longCap}</p>}
                <p className="text-blue-600 dark:text-blue-400 font-bold">{cta}</p>
                <p className="text-blue-500 text-[11px]">{hashtags}</p>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"><img src={visualUrl} alt={topic} className="w-full h-full object-cover" /></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};