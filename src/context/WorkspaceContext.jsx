import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

const MODULE_TO_PATH = {
  dashboard: '/dashboard',
  brands: '/brand-dna',
  strategy: '/strategy',
  seo: '/seo-intelligence',
  calendar: '/calendar',
  studio: '/content-studio',
  websiteBuilder: '/website-builder',
  builder: '/website-builder',
  campaigns: '/campaigns',
  creative: '/creative-studio',
  repurpose: '/repurpose',
  assets: '/asset-library',
  approvals: '/approvals-desk',
  analytics: '/analytics',
  team: '/team-rbac',
  settings: '/settings-billing',
  adminDashboard: '/admin-dashboard',
};

const PATH_TO_MODULE = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/brand-dna': 'brands',
  '/brands': 'brands',
  '/strategy': 'strategy',
  '/seo': 'seo',
  '/seo-intelligence': 'seo',
  '/calendar': 'calendar',
  '/content-studio': 'studio',
  '/studio': 'studio',
  '/website-builder': 'websiteBuilder',
  '/websitebuilder': 'websiteBuilder',
  '/builder': 'websiteBuilder',
  '/campaigns': 'campaigns',
  '/creative-studio': 'creative',
  '/creative': 'creative',
  '/repurpose': 'repurpose',
  '/asset-library': 'assets',
  '/assets': 'assets',
  '/approvals': 'approvals',
  '/approvals-desk': 'approvals',
  '/analytics': 'analytics',
  '/team-rbac': 'team',
  '/team': 'team',
  '/settings-billing': 'settings',
  '/settings': 'settings',
  '/admin-dashboard': 'adminDashboard',
  '/admin': 'adminDashboard',
};

function getModuleFromLocation() {
  if (typeof window === 'undefined') return 'dashboard';
  const cleanPath = window.location.pathname.split('?')[0].split('#')[0].toLowerCase().replace(/\/$/, '') || '/';
  return PATH_TO_MODULE[cleanPath] || 'dashboard';
}

export const TRANSLATIONS = {
  "English": {
    "dashboard": "1. Dashboard",
    "brands": "2. Brand DNA",
    "seo": "3. SEO Intelligence",
    "strategy": "4. Strategy",
    "calendar": "5. Calendar",
    "studio": "6. Content Studio",
    "websiteBuilder": "7. AI Website Builder",
    "campaigns": "8. Campaigns",
    "creative": "9. Creative Studio",
    "repurpose": "10. Repurpose",
    "assets": "11. Asset Library",
    "approvals": "12. Approvals Desk",
    "analytics": "13. Analytics",
    "team": "14. Team & RBAC",
    "settings": "13. Settings & Billing",
    "settingsBtn": "Settings & Billing",
    "quickSocialPost": "Quick Social Post",
    "engineActive": "AISA™ Engine Active",
    "planCreateOptimize": "Plan. Create. Optimize. Approve.",
    "backToAiAds": "Back to AI Ads™",
    "canonicalOperations": "Canonical Operations",
    "operationsHub": "AI Ads™ Operations Hub",
    "brandDnaBadge": "Brand DNA",
    "topUp": "+Top Up",
    "visualCredits": "Visual Credits",
    "role": "Role",
    "signedInAs": "Signed In As",
    "accountSettings": "Account Settings",
    "signOut": "Sign Out",
    "saveAndDone": "Save & Done",
    "appearanceStyle": "Appearance & Style",
    "alertsDigest": "Alerts & Digest",
    "dataControlsBackup": "Data Controls & Backup",
    "profileSessions": "Profile & Sessions",
    "billingVisualCredits": "Billing & Visual Credits",
    "helpCenterFaq": "Help Center & FAQ",
    "sendProductFeedback": "Send Product Feedback",
    "termsOfService": "Terms of Service",
    "privacyPolicy": "Privacy Policy",
    "themeMode": "Theme Mode",
    "darkMode": "Dark Mode",
    "lightMode": "Light Mode",
    "systemMode": "System",
    "accentColorTheme": "Accent Color Theme",
    "targetRegion": "Target Region",
    "dashboardLanguage": "Dashboard Language",
    "multiScheduleReminder": "Multi Schedule Reminder",
    "describeItWeBuildIt": "Describe it. We'll build it.",
    "newApplication": "New Application",
    "allProjects": "All Projects",
    "browseTemplates": "Browse All 12+ Templates",
    "viewApprovalsQueue": "View Approvals Queue",
    "platformPreferences": "PLATFORM PREFERENCES",
    "accountSecurity": "ACCOUNT & SECURITY",
    "monetizationApi": "MONETIZATION & API",
    "helpResources": "HELP & RESOURCES",
    "darkDesc": "High contrast dark theme",
    "lightDesc": "Clean white background",
    "systemDesc": "Auto sync with OS",
    "targetRegionDesc": "Adjust target market standards and audience metrics.",
    "languageDesc": "Interface and prompt default language.",
    "reminderDesc": "Automated post publishing alarms and push notifications.",
    "logOut": "LOG OUT",
    "canonicalOps": "Canonical Operations",
    "opsFlow": "Brand → Strategy → SEO → Create → Approve → Publish",
    "opsHubTitle": "AI Ads™ Operations Hub",
    "currentlyGoverning": "Currently governing",
    "anchoredToDna": "All output is anchored to immutable Brand DNA.",
    "quickPost": "Quick Post",
    "brandDna": "Enter Your Brand",
    "verifiedDnaMemory": "Verified Brand DNA Memory",
    "immutablePositioning": "Immutable positioning locked",
    "totalCampaigns": "Total Campaigns",
    "currentlyActive": "currently active",
    "factCheckRate": "Fact-Check Verification Rate",
    "itemsUnverified": "items unverified",
    "noItemsGenerated": "No items generated yet",
    "endToEndPipeline": "End-to-End Content Pipeline",
    "dnaStepTitle": "1. Brand DNA",
    "dnaStepSub": "Positioning & Claims",
    "seoStepTitle": "2. SEO Briefs",
    "seoStepSub": "Topic Clusters & Intent",
    "studioStepTitle": "3. Editorial Studio",
    "studioStepSub": "Multi-Channel Generation",
    "approvalsStepTitle": "4. Approvals Desk",
    "approvalsStepSub": "Governance & Verification",
    "repurposeStepTitle": "5. Repurposing",
    "repurposeStepSub": "1 Asset to 5 Formats",
    "recentProductionItems": "Recent Production Items & Governance Status",
    "noProductionItemsYet": "No production items yet",
    "noProductionDesc": "You haven't generated any drafts or campaigns for this brand yet. Get started by scraping the Brand DNA or writing a new post.",
    "tableContent": "Content",
    "tableType": "Type",
    "tableVerified": "Verified",
    "tableStatus": "Status",
    "tableView": "View"
    ,
    "brandDnaTitle": "Brand Intelligence & Brand DNA",
    "brandDnaDesc": "Immutable brand memory governing voice, positioning, and content rules for",
    "runDeepAiAnalysis": "Run Deep AI Analysis",
    "saveProfile": "Save Profile",
    "runSeoResearchFromDna": "Run SEO Research from Brand DNA →",
    "brandIdentity": "BRAND IDENTITY",
    "confidence": "Confidence",
    "colorPalette": "Color Palette",
    "industry": "Industry",
    "toneOfVoice": "Tone of Voice",
    "targetGoal": "Target Goal",
    "targetAudience": "TARGET AUDIENCE",
    "contentPillarsAngles": "CONTENT PILLARS & ANGLES",
    "pillar": "PILLAR",
    "productsServices": "PRODUCTS & SERVICES",
    "brandValuesTitle": "BRAND VALUES",
    "commRules": "COMMUNICATION RULES (DOS & DON'TS)",
    "dos": "DO'S",
    "donts": "DON'TS",
    "seoTitle": "SEO Intelligence & Brief Builder",
    "seoDesc": "Keyword clustering, topic mapping & 8-step brief generation for",
    "generateStrategyFromSeo": "Generate Campaign Strategy from SEO →",
    "keywordIntentInput": "KEYWORD & INTENT INPUT",
    "seedKeyword": "SEED KEYWORD",
    "searchIntent": "SEARCH INTENT",
    "generateSeoBrief": "Generate SEO Brief",
    "clusteredKeywords": "CLUSTERED KEYWORDS",
    "structuredSeoBriefOutput": "STRUCTURED 8-STEP SEO BRIEF OUTPUT",
    "marketingStrategyTitle": "Marketing Strategy & Roadmap",
    "marketingStrategyDesc": "AI-generated 30-day growth blueprint for",
    "overview": "Overview",
    "thirtyDayPlan": "30-Day Plan",
    "save": "Save",
    "generateMasterStrategy": "Generate Master Strategy",
    "objectivesConversionPath": "OBJECTIVES & CONVERSION PATH",
    "primaryBusinessGoal": "PRIMARY BUSINESS GOAL",
    "leadMagnetOffer": "LEAD MAGNET / OFFER",
    "primaryCta": "PRIMARY CTA",
    "channelMix": "CHANNEL MIX",
    "calendarTitle": "Content Calendar & Schedule",
    "calendarDesc": "Automated campaign scheduling and multi-platform publishing calendar for",
    "campaignInfo": "CAMPAIGN INFO",
    "campaignName": "CAMPAIGN NAME",
    "postingFrequency": "POSTING FREQUENCY",
    "startDate": "START DATE",
    "endDate": "END DATE",
    "generateFromStrategyPlan": "GENERATE FROM STRATEGY PLAN",
    "campaignProgress": "CAMPAIGN PROGRESS",
    "totalPosts": "TOTAL POSTS",
    "generated": "GENERATED",
    "approved": "APPROVED",
    "scheduled": "SCHEDULED",
    "published": "PUBLISHED",
    "remaining": "REMAINING",
    "unifiedContentStudio": "Unified Content Studio",
    "contentStudioDesc": "AI-powered drafting engine for blogs, social posts, emails, and ads anchored to",
    "blog": "Blog",
    "socialMedia": "Social Media",
    "emailLetter": "Email / Letter",
    "newspaper": "Newspaper",
    "openStudio": "Open Studio",
    "openPage": "Open Page →",
    "selectChannelStudio": "Select a Channel Studio to Begin",
    "selectChannelDesc": "Click on any channel card above (Blog, Social Media, Email, or Newspaper) to open its dedicated studio drafting page.",
    "aiWebsiteBuilderTitle": "AI Website Builder & Web App Creator",
    "websiteBuilderDesc": "Generate high-converting landing pages, e-commerce stores, and web apps for",
    "createNewWebsite": "Create New Website",
    "campaignBuilderTitle": "Campaign Builder & Launch Console",
    "campaignBuilderDesc": "Launch multi-platform ad campaigns with target audience and budgets for",
    "createNewCampaign": "Create New Campaign",
    "creativeStudioTitle": "Creative Studio & Visual Synthesis",
    "creativeStudioDesc": "Generate AI visuals, graphics, and ad banners for",
    "generateVisualAsset": "Generate Visual Asset",
    "repurposeTitle": "Content Repurposer",
    "repurposeDesc": "Turn 1 long-form blog post or asset into 5 multi-channel formats for",
    "assetLibraryTitle": "Asset Library & Brand Vault",
    "assetLibraryDesc": "Store and organize approved brand media and copy drafts for",
    "approvalsDeskTitle": "Approvals Desk & Governance",
    "approvalsDeskDesc": "Fact-check and approve generated posts before automated publishing for",
    "analyticsTitle": "Platform Performance Analytics",
    "analyticsDesc": "Track campaign reach, engagement rates, and ROI metrics for",
    "teamRbacTitle": "Team & Role-Based Access Control",
    "teamRbacDesc": "Manage team workspace members, roles, and security permissions for"
  },
  "Hindi": {
    "dashboard": "1. डैशबोर्ड (Dashboard)",
    "brands": "2. ब्रांड डीएनए (Brand DNA)",
    "seo": "3. एसईओ इंटेलिजेंस (SEO)",
    "strategy": "4. रणनीति (Strategy)",
    "calendar": "5. कैलेंडर (Calendar)",
    "studio": "6. कंटेंट स्टूडियो",
    "websiteBuilder": "7. एआई वेबसाइट बिल्डर",
    "campaigns": "8. अभियान (Campaigns)",
    "creative": "9. क्रिएटिव स्टूडियो",
    "repurpose": "10. रीपर्पस (Repurpose)",
    "assets": "11. एसेट लाइब्रेरी",
    "approvals": "12. स्वीकृति डेस्क",
    "analytics": "13. एनालिटिक्स",
    "team": "14. टीम और एक्सेस (Team)",
    "settings": "13. सेटिंग्स और बिलिंग",
    "settingsBtn": "सेटिंग्स और बिलिंग",
    "quickSocialPost": "त्वरित सोशल पोस्ट",
    "engineActive": "AISA™ इंजन सक्रिय है",
    "planCreateOptimize": "योजना। निर्माण। अनुकूलन। स्वीकृति।",
    "backToAiAds": "AI Ads™ पर वापस जाएँ",
    "canonicalOperations": "सत्यापित संचालन",
    "operationsHub": "AI Ads™ संचालन हब",
    "brandDnaBadge": "ब्रांड डीएनए",
    "topUp": "+टॉप अप",
    "visualCredits": "विजुअल क्रेडिट",
    "role": "भूमिका (Role)",
    "signedInAs": "साइन इन किया गया:",
    "accountSettings": "खाता सेटिंग्स",
    "signOut": "साइन आउट करें",
    "saveAndDone": "सहेजें और संपन्न",
    "appearanceStyle": "उपस्थिति और शैली (Appearance)",
    "alertsDigest": "अलर्ट और डाइजेस्ट",
    "dataControlsBackup": "डेटा नियंत्रण और बैकअप",
    "profileSessions": "प्रोफ़ाइल और सत्र",
    "billingVisualCredits": "बिलिंग और विजुअल क्रेडिट",
    "helpCenterFaq": "सहायता केंद्र और प्रश्नोत्तर",
    "sendProductFeedback": "उत्पाद प्रतिक्रिया भेजें",
    "termsOfService": "सेवा की शर्तें",
    "privacyPolicy": "गोपनीयता नीति",
    "themeMode": "थीम मोड",
    "darkMode": "डार्क मोड",
    "lightMode": "लाइट मोड",
    "systemMode": "सिस्टम मोड",
    "accentColorTheme": "ऐक्सेंट रंग थीम",
    "targetRegion": "लक्षित क्षेत्र (Target Region)",
    "dashboardLanguage": "डैशबोर्ड भाषा",
    "multiScheduleReminder": "मल्टी शेड्यूल रिमाइंडर",
    "describeItWeBuildIt": "वर्णन करें। हम इसे बनाएंगे।",
    "newApplication": "नया आवेदन",
    "allProjects": "सभी प्रोजेक्ट्स",
    "browseTemplates": "सभी 12+ टेम्प्लेट ब्राउज़ करें",
    "viewApprovalsQueue": "स्वीकृति कतार देखें",
    "platformPreferences": "प्लेटफॉर्म प्राथमिकताएं",
    "accountSecurity": "खाता एवं सुरक्षा",
    "monetizationApi": "मुद्रीकरण एवं एपीआई",
    "helpResources": "सहायता एवं संसाधन",
    "darkDesc": "उच्च कंट्रास्ट डार्क थीम",
    "lightDesc": "स्वच्छ सफेद पृष्ठभूमि",
    "systemDesc": "ओएस के साथ स्वचालित सिंक",
    "targetRegionDesc": "लक्षित बाजार मानकों और दर्शकों के मेट्रिक्स को समायोजित करें।",
    "languageDesc": "इंटरफ़ेस और प्रॉम्प्ट की डिफ़ॉल्ट भाषा।",
    "reminderDesc": "स्वचालित पोस्ट प्रकाशन अलार्म और पुश सूचनाएं।",
    "logOut": "लॉग आउट",
    "canonicalOps": "सत्यापित संचालन",
    "opsFlow": "ब्रांड → रणनीति → एसईओ → निर्माण → स्वीकृति → प्रकाशन",
    "opsHubTitle": "AI Ads™ संचालन हब",
    "currentlyGoverning": "वर्तमान में नियंत्रित:",
    "anchoredToDna": "सभी आउटपुट अपरिवर्तनीय ब्रांड डीएनए से जुड़े हैं।",
    "quickPost": "त्वरित पोस्ट",
    "brandDna": "ब्रांड डीएनए",
    "verifiedDnaMemory": "सत्यापित ब्रांड डीएनए मेमोरी",
    "immutablePositioning": "अपरिवर्तनीय पोजीशनिंग लॉक है",
    "totalCampaigns": "कुल अभियान",
    "currentlyActive": "वर्तमान में सक्रिय",
    "factCheckRate": "तथ्य-जांच सत्यापन दर",
    "itemsUnverified": "आइटम असत्यापित हैं",
    "noItemsGenerated": "अभी तक कोई आइटम जनरेट नहीं हुआ",
    "endToEndPipeline": "एंड-टू-एंड कंटेंट पाइपलाइन",
    "dnaStepTitle": "1. ब्रांड डीएनए",
    "dnaStepSub": "पोजीशनिंग एवं दावे",
    "seoStepTitle": "2. एसईओ ब्रीफ",
    "seoStepSub": "विषय क्लस्टर एवं इरादा",
    "studioStepTitle": "3. संपादकीय स्टूडियो",
    "studioStepSub": "मल्टी-चैनल जनरेशन",
    "approvalsStepTitle": "4. स्वीकृति डेस्क",
    "approvalsStepSub": "शासन एवं सत्यापन",
    "repurposeStepTitle": "5. रीपर्पसिंग",
    "repurposeStepSub": "1 एसेट से 5 प्रारूप",
    "recentProductionItems": "हाल के उत्पादन आइटम एवं शासन स्थिति",
    "noProductionItemsYet": "अभी तक कोई उत्पादन आइटम नहीं",
    "noProductionDesc": "आपने अभी तक इस ब्रांड के लिए कोई ड्राफ्ट या अभियान जनरेट नहीं किया है। ब्रांड डीएनए स्क्रैप करके या नया पोस्ट लिखकर शुरुआत करें।",
    "tableContent": "कंटेंट",
    "tableType": "प्रकार",
    "tableVerified": "सत्यापित",
    "tableStatus": "स्थिति",
    "tableView": "देखें"
    ,
    "brandDnaTitle": "ब्रांड इंटेलिजेंस एवं ब्रांड डीएनए",
    "brandDnaDesc": "आवाज, पोजीशनिंग और कंटेंट नियमों को नियंत्रित करने वाली अपरिवर्तनीय ब्रांड मेमोरी:",
    "runDeepAiAnalysis": "गहन एआई विश्लेषण चलाएं",
    "saveProfile": "प्रोफ़ाइल सहेजें",
    "runSeoResearchFromDna": "ब्रांड डीएनए से एसईओ अनुसंधान चलाएं →",
    "brandIdentity": "ब्रांड पहचान (BRAND IDENTITY)",
    "confidence": "विश्वसनीयता (Confidence)",
    "colorPalette": "रंग पैलेट (Color Palette)",
    "industry": "उद्योग (Industry)",
    "toneOfVoice": "आवाज का लहजा (Tone of Voice)",
    "targetGoal": "लक्ष्य (Target Goal)",
    "targetAudience": "लक्षित दर्शक (TARGET AUDIENCE)",
    "contentPillarsAngles": "कंटेंट पिलर एवं कोण (CONTENT PILLARS & ANGLES)",
    "pillar": "पिलर",
    "productsServices": "उत्पाद एवं सेवाएं (PRODUCTS & SERVICES)",
    "brandValuesTitle": "ब्रांड मूल्य (BRAND VALUES)",
    "commRules": "संचार नियम (COMMUNICATION RULES - DOS & DON'TS)",
    "dos": "क्या करें (DO'S)",
    "donts": "क्या न करें (DON'TS)",
    "seoTitle": "एसईओ इंटेलिजेंस एवं ब्रीफ बिल्डर",
    "seoDesc": "कीवर्ड क्लस्टरिंग, विषय मैपिंग एवं 8-चरणीय ब्रीफ जनरेशन:",
    "generateStrategyFromSeo": "एसईओ से अभियान रणनीति जनरेट करें →",
    "keywordIntentInput": "कीवर्ड एवं इरादा इनपुट (KEYWORD & INTENT INPUT)",
    "seedKeyword": "सीड कीवर्ड (SEED KEYWORD)",
    "searchIntent": "खोज का इरादा (SEARCH INTENT)",
    "generateSeoBrief": "एसईओ ब्रीफ जनरेट करें",
    "clusteredKeywords": "क्लस्टर्ड कीवर्ड (CLUSTERED KEYWORDS)",
    "structuredSeoBriefOutput": "संरचित 8-चरणीय एसईओ ब्रीफ आउटपुट",
    "marketingStrategyTitle": "मार्केटिंग रणनीति एवं रोडमैप",
    "marketingStrategyDesc": "एआई-जनरेटेड 30-दिवसीय विकास खाका:",
    "overview": "अवलोकन (Overview)",
    "thirtyDayPlan": "30-दिवसीय योजना (30-Day Plan)",
    "save": "सहेजें (Save)",
    "generateMasterStrategy": "मास्टर रणनीति जनरेट करें",
    "objectivesConversionPath": "उद्देश्य एवं रूपांतरण पथ (OBJECTIVES & CONVERSION PATH)",
    "primaryBusinessGoal": "प्राथमिक व्यावसायिक लक्ष्य (PRIMARY BUSINESS GOAL)",
    "leadMagnetOffer": "लीड मैग्नेट / ऑफर (LEAD MAGNET / OFFER)",
    "primaryCta": "प्राथमिक कॉल-टू-एक्शन (PRIMARY CTA)",
    "channelMix": "चैनल मिश्रण (CHANNEL MIX)",
    "calendarTitle": "कंटेंट कैलेंडर एवं शेड्यूल",
    "calendarDesc": "स्वचालित अभियान शेड्यूलिंग एवं बहु-प्लेटफ़ॉर्म प्रकाशन कैलेंडर:",
    "campaignInfo": "अभियान जानकारी (CAMPAIGN INFO)",
    "campaignName": "अभियान का नाम (CAMPAIGN NAME)",
    "postingFrequency": "पोस्टिंग आवृत्ति (POSTING FREQUENCY)",
    "startDate": "प्रारंभ तिथि (START DATE)",
    "endDate": "अंतिम तिथि (END DATE)",
    "generateFromStrategyPlan": "रणनीति योजना से जनरेट करें",
    "campaignProgress": "अभियान की प्रगति (CAMPAIGN PROGRESS)",
    "totalPosts": "कुल पोस्ट (TOTAL POSTS)",
    "generated": "जनरेट किए गए (GENERATED)",
    "approved": "स्वीकृत (APPROVED)",
    "scheduled": "शेड्यूल किए गए (SCHEDULED)",
    "published": "प्रकाशित (PUBLISHED)",
    "remaining": "शेष (REMAINING)",
    "unifiedContentStudio": "एकीकृत कंटेंट स्टूडियो (Unified Content Studio)",
    "contentStudioDesc": "ब्लॉग, सोशल पोस्ट, ईमेल और विज्ञापनों के लिए एआई-संचालित ड्राफ्टिंग इंजन:",
    "blog": "ब्लॉग (Blog)",
    "socialMedia": "सोशल मीडिया (Social Media)",
    "emailLetter": "ईमेल / पत्र (Email / Letter)",
    "newspaper": "समाचार पत्र (Newspaper)",
    "openStudio": "स्टूडियो खोलें (Open Studio)",
    "openPage": "पेज खोलें →",
    "selectChannelStudio": "आरंभ करने के लिए एक चैनल स्टूडियो चुनें",
    "selectChannelDesc": "इसकी समर्पित ड्राफ्टिंग पेज खोलने के लिए ऊपर दिए गए किसी भी चैनल कार्ड पर क्लिक करें।",
    "aiWebsiteBuilderTitle": "एआई वेबसाइट बिल्डर एवं वेब ऐप निर्माता",
    "websiteBuilderDesc": "उच्च-रूपांतरण लैंडिंग पेज, ई-कॉमर्स स्टोर और वेब ऐप बनाएं:",
    "createNewWebsite": "नई वेबसाइट बनाएं",
    "campaignBuilderTitle": "अभियान निर्माता एवं लॉन्च कंसोल",
    "campaignBuilderDesc": "लक्षित दर्शकों और बजट के साथ बहु-प्लेटफ़ॉर्म विज्ञापन अभियान शुरू करें:",
    "createNewCampaign": "नया अभियान बनाएं",
    "creativeStudioTitle": "क्रिएटिव स्टूडियो एवं विजुअल निर्माण",
    "creativeStudioDesc": "एआई विजुअल, ग्राफिक्स और विज्ञापन बैनर जनरेट करें:",
    "generateVisualAsset": "विजुअल एसेट जनरेट करें",
    "repurposeTitle": "कंटेंट पुनरुपयोग (Content Repurposer)",
    "repurposeDesc": "1 लंबे ब्लॉग पोस्ट को 5 बहु-चैनल प्रारूपों में बदलें:",
    "assetLibraryTitle": "एसेट लाइब्रेरी एवं ब्रांड तिजोरी",
    "assetLibraryDesc": "स्वीकृत ब्रांड मीडिया और ड्राफ्ट को सुरक्षित रूप से स्टोर करें:",
    "approvalsDeskTitle": "स्वीकृति डेस्क एवं शासन",
    "approvalsDeskDesc": "स्वचालित प्रकाशन से पहले जनरेट की गई पोस्ट की जांच और स्वीकृति करें:",
    "analyticsTitle": "प्लेटफॉर्म प्रदर्शन एनालिटिक्स",
    "analyticsDesc": "अभियान पहुंच, सहभागिता दर और आरओआई मेट्रिक्स को ट्रैक करें:",
    "teamRbacTitle": "टीम और भूमिका-आधारित पहुंच नियंत्रण",
    "teamRbacDesc": "टीम वर्कस्पेस सदस्यों, भूमिकाओं और सुरक्षा अनुमतियों को प्रबंधित करें:"
  },
  "Bengali": {
    "dashboard": "1. ড্যাশবোর্ড (Dashboard)",
    "brands": "2. ব্র্যান্ড ডিএনএ (Brand DNA)",
    "seo": "3.এসইও বুদ্ধিমত্তা (SEO)",
    "strategy": "4. কৌশল (Strategy)",
    "calendar": "5. ক্যালেন্ডার (Calendar)",
    "studio": "6. কনটেন্ট স্টুডিও",
    "websiteBuilder": "7. এআই ওয়েবসাইট বিল্ডার",
    "campaigns": "8. ক্যাম্পেইন (Campaigns)",
    "creative": "9. ক্রিয়েটিভ স্টুডিও",
    "repurpose": "10. পুনব্যবহার (Repurpose)",
    "assets": "11. সম্পদ লাইব্রেরি",
    "approvals": "12. অনুমোদন ডেস্ক",
    "analytics": "13. অ্যানালিটিক্স",
    "team": "14. টিম ও অ্যাক্সেস",
    "settings": "13. সেটিংসে ও বিলিং",
    "settingsBtn": "সেটিংস ও বিলিং",
    "quickSocialPost": "দ্রুত সোশ্যাল পোস্ট",
    "engineActive": "AISA™ ইঞ্জিন সক্রিয়",
    "planCreateOptimize": "পরিকল্পনা। সৃষ্টি। অপ্টিমাইজ। অনুমোদন।",
    "backToAiAds": "AI Ads™-এ ফিরে যান",
    "canonicalOperations": "যাচাইকৃত অপারেশন",
    "operationsHub": "AI Ads™ অপারেশনস হাব",
    "brandDnaBadge": "ব্র্যান্ড ডিএনএ",
    "topUp": "+টপ আপ",
    "visualCredits": "ভিজ্যুয়াল ক্রেডিট",
    "role": "ভূমিকা",
    "signedInAs": "সাইন ইন করেছেন:",
    "accountSettings": "একাউন্ট সেটিংস",
    "signOut": "সাইন আউট",
    "saveAndDone": "সংরক্ষণ করুন",
    "appearanceStyle": "চেহারা ও শৈলী",
    "alertsDigest": "সতর্কতা ও ডাইজেস্ট",
    "dataControlsBackup": "ডেটা নিয়ন্ত্রণ ও ব্যাকআপ",
    "profileSessions": "প্রোফাইল ও সেশন",
    "billingVisualCredits": "বিলিং ও ভিজ্যুয়াল ক্রেডিট",
    "helpCenterFaq": "সহায়তা কেন্দ্র ও প্রশ্নাবলী",
    "sendProductFeedback": "মতামত পাঠান",
    "termsOfService": "পরিষেবার শর্তাবলী",
    "privacyPolicy": "গোপনীয়তা নীতি",
    "themeMode": "থিম মোড",
    "darkMode": "ডার্ক মোড",
    "lightMode": "লাইট মোড",
    "systemMode": "সিস্টেম মোড",
    "accentColorTheme": "রঙের থিম",
    "targetRegion": "টার্গেট অঞ্চল",
    "dashboardLanguage": "ড্যাশবোর্ড ভাষা",
    "multiScheduleReminder": "মাল্টি সিডিউল রিমাইন্ডার",
    "describeItWeBuildIt": "বর্ণনা করুন। আমরা তৈরি করব।",
    "newApplication": "নতুন অ্যাপ্লিকেশন",
    "allProjects": "সমস্ত প্রজেক্ট",
    "browseTemplates": "১২+ টেমপ্লেট দেখুন",
    "viewApprovalsQueue": "অনুমোদন তালিকা দেখুন",
    "platformPreferences": "প্ল্যাটফর্ম পছন্দসমূহ",
    "accountSecurity": "অ্যাকাউন্ট ও নিরাপত্তা",
    "monetizationApi": "মনিটাইজেশন ও এপিআই",
    "helpResources": "সহায়তা ও সম্পদ",
    "darkDesc": "উচ্চ কনট্রাস্ট ডার্ক থিম",
    "lightDesc": "পরিষ্কার সাদা ব্যাকগ্রাউন্ড",
    "systemDesc": "ওএস-এর সাথে স্বয়ংক্রিয় সিঙ্ক",
    "targetRegionDesc": "টার্গেট মার্কেট স্ট্যান্ডার্ড এবং অডিয়েন্স মেট্রিক্স সামঞ্জস্য করুন।",
    "languageDesc": "ইন্টারফেস এবং প্রম্পটের ডিফল্ট ভাষা।",
    "reminderDesc": "স্বয়ংক্রিয় পোস্ট প্রকাশনার অ্যালার্ম এবং পুশ বিজ্ঞপ্তি।",
    "logOut": "লগ আউট",
    "canonicalOps": "যাচাইকৃত অপারেশন",
    "opsFlow": "ব্র্যান্ড → কৌশল → এসইও → সৃষ্টি → অনুমোদন → প্রকাশনা",
    "opsHubTitle": "AI Ads™ অপারেশনস হাব",
    "currentlyGoverning": "বর্তমানে পরিচালিত:",
    "anchoredToDna": "সমস্ত আউটপুট অপরিবর্তনীয় ব্র্যান্ড ডিএনএ-এর সাথে যুক্ত।",
    "quickPost": "দ্রুত পোস্ট",
    "brandDna": "ব্র্যান্ড ডিএনএ",
    "verifiedDnaMemory": "যাচাইকৃত ব্র্যান্ড ডিএনএ মেমরি",
    "immutablePositioning": "অপরিবর্তনীয় পজিশনিং লক করা হয়েছে",
    "totalCampaigns": "মোট ক্যাম্পেইন",
    "currentlyActive": "বর্তমানে সক্রিয়",
    "factCheckRate": "তথ্য-যাচাইকরণের হার",
    "itemsUnverified": "আইটেম অযাচাইকৃত",
    "noItemsGenerated": "এখনও কোনও আইটেম তৈরি হয়নি",
    "endToEndPipeline": "এন্ড-টু-এন্ড কনটেন্ট পাইপলাইন",
    "dnaStepTitle": "১. ব্র্যান্ড ডিএনএ",
    "dnaStepSub": "পজিশনিং ও দাবি",
    "seoStepTitle": "২. এসইও ব্রিফ",
    "seoStepSub": "টপিক ক্লাস্টার ও উদ্দেশ্য",
    "studioStepTitle": "৩. সম্পাদকীয় স্টুডিও",
    "studioStepSub": "মাল্টি-চ্যানেল জেনারেশন",
    "approvalsStepTitle": "৪. অনুমোদন ডেস্ক",
    "approvalsStepSub": "শাসন ও যাচাইকরণ",
    "repurposeStepTitle": "৫. পুনব্যবহার",
    "repurposeStepSub": "১টি অ্যাসেট থেকে ৫টি ফরম্যাট",
    "recentProductionItems": "সাম্প্রতিক প্রোডাকশন আইটেম ও শাসনের স্থিতি",
    "noProductionItemsYet": "এখনও কোনও প্রোডাকশন আইটেম নেই",
    "noProductionDesc": "আপনি এখনও এই ব্র্যান্ডের জন্য কোনও ড্রাফট বা ক্যাম্পেইন তৈরি করেননি। ব্র্যান্ড ডিএনএ স্ক্র্যাপ করে বা নতুন পোস্ট লিখে শুরু করুন।",
    "tableContent": "কনটেন্ট",
    "tableType": "প্রকার",
    "tableVerified": "যাচাইকৃত",
    "tableStatus": "স্থিতি",
    "tableView": "দেখুন"
    ,
    "brandDnaTitle": "ব্র্যান্ড ইন্টেলিজেন্স ও ব্র্যান্ড ডিএনএ",
    "brandDnaDesc": "ভয়েস, পজিশনিং এবং কনটেন্ট নিয়ম নিয়ন্ত্রণকারী অপরিবর্তনীয় ব্র্যান্ড মেমরি:",
    "runDeepAiAnalysis": "গভীর এআই বিশ্লেষণ চালান",
    "saveProfile": "প্রোফাইল সংরক্ষণ করুন",
    "runSeoResearchFromDna": "ব্র্যান্ড ডিএনএ থেকে এসইও গবেষণা চালান →",
    "brandIdentity": "ব্র্যান্ড পরিচয় (BRAND IDENTITY)",
    "confidence": "আত্মবিশ্বাস (Confidence)",
    "colorPalette": "রঙ প্যালেট (Color Palette)",
    "industry": "শিল্প (Industry)",
    "toneOfVoice": "ভয়েস টোন (Tone of Voice)",
    "targetGoal": "লক্ষ্য (Target Goal)",
    "targetAudience": "লক্ষ্য দর্শক (TARGET AUDIENCE)",
    "contentPillarsAngles": "কনটেন্ট পিলার ও কোণ",
    "pillar": "পিলার",
    "productsServices": "পণ্য ও সেবা (PRODUCTS & SERVICES)",
    "brandValuesTitle": "ব্র্যান্ড মূল্যবোধ (BRAND VALUES)",
    "commRules": "যোগাযোগের নিয়ম (DOS & DON'TS)",
    "dos": "করনীয় (DO'S)",
    "donts": "বর্জনীয় (DON'TS)",
    "seoTitle": "এসইও ইন্টেলিজেন্স ও ব্রিফ বিল্ডার",
    "seoDesc": "কিওয়ার্ড ক্লাস্টারিং এবং ৮-ধাপের ব্রিফ জেনারেশন:",
    "generateStrategyFromSeo": "এসইও থেকে ক্যাম্পেইন কৌশল তৈরি করুন →",
    "keywordIntentInput": "কিওয়ার্ড ও ইনটেন্ট ইনপুট",
    "seedKeyword": "সিড কিওয়ার্ড",
    "searchIntent": "অনুসন্ধানের ইনটেন্ট",
    "generateSeoBrief": "এসইও ব্রিফ তৈরি করুন",
    "clusteredKeywords": "ক্লাস্টার্ড কিওয়ার্ড",
    "structuredSeoBriefOutput": "৮-ধাপের এসইও ব্রিফ আউটপুট",
    "marketingStrategyTitle": "মার্কেটিং কৌশল ও রোডম্যাপ",
    "marketingStrategyDesc": "এআই-চালিত ৩০ দিনের গ্রোথ প্ল্যান:",
    "overview": "সংক্ষিপ্ত বিবরণ",
    "thirtyDayPlan": "৩০ দিনের পরিকল্পনা",
    "save": "সংরক্ষণ করুন",
    "generateMasterStrategy": "মাস্টার কৌশল তৈরি করুন",
    "objectivesConversionPath": "উদ্দেশ্য ও রূপান্তর পথ",
    "primaryBusinessGoal": "প্রাথমিক ব্যবসায়িক লক্ষ্য",
    "leadMagnetOffer": "লিড ম্যাগনেট / অফার",
    "primaryCta": "প্রাথমিক সিটিএ",
    "channelMix": "চ্যানেল মিক্স",
    "calendarTitle": "কনটেন্ট ক্যালেন্ডার ও শিডিউল",
    "calendarDesc": "স্বয়ংক্রিয় ক্যাম্পেইন শিডিউলিং ক্যালেন্ডার:",
    "campaignInfo": "ক্যাম্পেইন তথ্য",
    "campaignName": "ক্যাম্পেইনের নাম",
    "postingFrequency": "পোস্টিং ফ্রিকোয়েন্সি",
    "startDate": "শুরুর তারিখ",
    "endDate": "শেষের তারিখ",
    "generateFromStrategyPlan": "কৌশল পরিকল্পনা থেকে তৈরি করুন",
    "campaignProgress": "ক্যাম্পেইন অগ্রগতি",
    "totalPosts": "মোট পোস্ট",
    "generated": "তৈরি করা হয়েছে",
    "approved": "অনুমোদিত",
    "scheduled": "শিডিউল করা হয়েছে",
    "published": "প্রকাশিত",
    "remaining": "অবশিষ্ট",
    "unifiedContentStudio": "ইউনিফাইড কনটেন্ট স্টুডিও",
    "contentStudioDesc": "ব্লগ, সোশ্যাল পোস্ট এবং ইমেলের জন্য এআই ড্রাফটিং ইঞ্জিন:",
    "blog": "ব্লগ",
    "socialMedia": "সোশ্যাল মিডিয়া",
    "emailLetter": "ইমেল / চিঠি",
    "newspaper": "সংবাদপত্র",
    "openStudio": "স্টুডিও খুলুন",
    "openPage": "পেজ খুলুন →",
    "selectChannelStudio": "শুরু করতে একটি চ্যানেল স্টুডিও নির্বাচন করুন",
    "selectChannelDesc": "ডেডিকেটেড ড্রাফটিং পেজ খুলতে উপরের যেকোনো চ্যানেল কার্ডে ক্লিক করুন।"
  },
  "Marathi": {
    "dashboard": "1. डॅशबोर्ड (Dashboard)",
    "brands": "2. ब्रँड डीएनए (Brand DNA)",
    "seo": "3. एसईओ इंटेलिजन्स",
    "strategy": "4. रणनीती (Strategy)",
    "calendar": "5. कॅलेंडर (Calendar)",
    "studio": "6. कंटेंट स्टुडिओ",
    "websiteBuilder": "7. एआय वेबसाइट बिल्डर",
    "campaigns": "8. मोहिमा (Campaigns)",
    "creative": "9. क्रिएटिव्ह स्टुडिओ",
    "repurpose": "10. रीपर्पज (Repurpose)",
    "assets": "11. ॲसेट लायब्ररी",
    "approvals": "12. संमती डेस्क",
    "analytics": "13. ॲनालिटिक्स",
    "team": "14. टीम आणि ॲक्सेस",
    "settings": "13. सेटिंग्ज आणि बिलिंग",
    "settingsBtn": "सेटिंग्ज आणि बिलिंग",
    "quickSocialPost": "झटपट सोशल पोस्ट",
    "engineActive": "AISA™ इंजिन सक्रिय",
    "planCreateOptimize": "योजना। निर्मिती। संपादन। संमती।",
    "backToAiAds": "AI Ads™ वर परत जा",
    "canonicalOperations": "प्रमाणित ऑपरेशन्स",
    "operationsHub": "AI Ads™ ऑपरेशन्स हब",
    "brandDnaBadge": "ब्रँड डीएनए",
    "topUp": "+टॉप अप",
    "visualCredits": "व्हिज्युअल क्रेडिट्स",
    "role": "भूमिका",
    "signedInAs": "लॉग इन केले आहे:",
    "accountSettings": "खाते सेटिंग्ज",
    "signOut": "बाहेर पडा (Sign Out)",
    "saveAndDone": "जतन करा",
    "appearanceStyle": "दिसणे आणि शैली",
    "alertsDigest": "अलर्ट आणि डायजेस्ट",
    "dataControlsBackup": "डेटा नियंत्रण आणि बॅकअप",
    "profileSessions": "प्रोफाइल आणि सत्रे",
    "billingVisualCredits": "बिलिंग आणि क्रेडिट्स",
    "helpCenterFaq": "मदत केंद्र आणि प्रश्न",
    "sendProductFeedback": "अभिप्राय पाठवा",
    "termsOfService": "सेवा अटी",
    "privacyPolicy": "गोपनीयता धोरण",
    "themeMode": "थीम मोड",
    "darkMode": "डार्क मोड",
    "lightMode": "लाइट मोड",
    "systemMode": "सिस्टम",
    "accentColorTheme": "रंग थीम",
    "targetRegion": "लक्ष्य प्रदेश",
    "dashboardLanguage": "डॅशबोर्ड भाषा",
    "multiScheduleReminder": "शेड्यूल स्मरणपत्र",
    "describeItWeBuildIt": "वर्णन करा. आम्ही ते बनवू.",
    "newApplication": "नवीन ॲप्लिकेशन",
    "allProjects": "सर्व प्रोजेक्ट्स",
    "browseTemplates": "12+ टेम्पलेट्स पहा",
    "viewApprovalsQueue": "संमती रांग पहा",
    "platformPreferences": "प्लॅटफॉर्म प्राधान्ये",
    "accountSecurity": "खाते आणि सुरक्षा",
    "monetizationApi": "मुद्रीकरण आणि एपीआय",
    "helpResources": "मदत आणि संसाधने",
    "darkDesc": "हाय कॉन्ट्रास्ट डार्क थीम",
    "lightDesc": "स्वच्छ पांढरी पार्श्वभूमी",
    "systemDesc": "ओएस सह स्वयंचलित सिंक",
    "targetRegionDesc": "लक्ष्य बाजार मानके आणि प्रेक्षक मानके समायोजित करा.",
    "languageDesc": "इंटरफेस आणि प्रॉम्टची डीफॉल्ट भाषा.",
    "reminderDesc": "स्वयंचलित पोस्ट प्रकाशन स्मरणपत्रे आणि पुश सूचना.",
    "logOut": "लॉग आउट",
    "canonicalOps": "प्रमाणित ऑपरेशन्स",
    "opsFlow": "ब्रँड → रणनीती → एसईओ → निर्मिती → संमती → प्रकाशन",
    "opsHubTitle": "AI Ads™ ऑपरेशन्स हब",
    "currentlyGoverning": "सध्या नियंत्रित:",
    "anchoredToDna": "सर्व आउटपुट अपरिवर्तनीय ब्रँड डीएनए ला जोडलेले आहेत.",
    "quickPost": "झटपट पोस्ट",
    "brandDna": "ब्रँड डीएनए",
    "verifiedDnaMemory": "सत्यापित ब्रँड डीएनए मेमरी",
    "immutablePositioning": "अपरिवर्तनीय पोझिशनिंग लॉक केले आहे",
    "totalCampaigns": "एकूण मोहिमा",
    "currentlyActive": "सध्या सक्रिय",
    "factCheckRate": "तथ्य-तपासणी दर",
    "itemsUnverified": "घटक असत्यापित आहेत",
    "noItemsGenerated": "अद्याप कोणतेही घटक तयार केलेले नाहीत",
    "endToEndPipeline": "एंड-टू-एंड कंटेंट पाइपलाइन",
    "dnaStepTitle": "1. ब्रँड डीएनए",
    "dnaStepSub": "पोझिशनिंग आणि दावे",
    "seoStepTitle": "2. एसईओ ब्रीफ",
    "seoStepSub": "विषय क्लस्टर्स आणि हेतू",
    "studioStepTitle": "3. संपादन स्टुडिओ",
    "studioStepSub": "मल्टी-चॅनेल निर्मिती",
    "approvalsStepTitle": "4. संमती डेस्क",
    "approvalsStepSub": "शासन आणि पडताळणी",
    "repurposeStepTitle": "5. रीपर्पसिंग",
    "repurposeStepSub": "1 घटकातून 5 फॉरमॅट",
    "recentProductionItems": "नुकतेच उत्पादन घटक आणि शासन स्थिती",
    "noProductionItemsYet": "अद्याप कोणतेही उत्पादन घटक नाहीत",
    "noProductionDesc": "तुम्ही अद्याप या ब्रँडसाठी कोणतेही मसुदे किंवा मोहिमा तयार केलेल्या नाहीत. ब्रँड डीएनए स्क्रॅप करून किंवा नवीन पोस्ट लिहून सुरुवात करा.",
    "tableContent": "कंटेंट",
    "tableType": "प्रकार",
    "tableVerified": "सत्यापित",
    "tableStatus": "स्थिती",
    "tableView": "पहा"
    ,
    "brandDnaTitle": "ब्रँड इंटेलिजन्स आणि ब्रँड डीएनए",
    "brandDnaDesc": "व्हॉइस आणि पोझिशनिंग नियम नियंत्रित करणारी ब्रँड मेमरी:",
    "runDeepAiAnalysis": "सखोल एआय विश्लेषण चालवा",
    "saveProfile": "प्रोफाइल जतन करा",
    "runSeoResearchFromDna": "ब्रँड डीएनए वरून एसईओ संशोधन चालवा →",
    "brandIdentity": "ब्रँड ओळख (BRAND IDENTITY)",
    "confidence": "आत्मविश्वास (Confidence)",
    "colorPalette": "रंग पॅलेट (Color Palette)",
    "industry": "उद्योग (Industry)",
    "toneOfVoice": "टोनालिटी (Tone of Voice)",
    "targetGoal": "लक्ष्य (Target Goal)",
    "targetAudience": "लक्ष्यित दर्शक (TARGET AUDIENCE)",
    "contentPillarsAngles": "कंटेंट पिलर्स आणि अँगल",
    "pillar": "पिलर",
    "productsServices": "उत्पादने आणि सेवा",
    "brandValuesTitle": "ब्रँड मूल्ये (BRAND VALUES)",
    "commRules": "संवादाचे नियम (DOS & DON'TS)",
    "dos": "काय करावे (DO'S)",
    "donts": "काय करू नये (DON'TS)",
    "seoTitle": "एसईओ इंटेलिजन्स आणि ब्रीफ बिल्डर",
    "seoDesc": "कीवर्ड क्लस्टरिंग आणि 8-स्तरीय ब्रीफ निर्मिती:",
    "generateStrategyFromSeo": "एसईओ वरून मोहीम रणनीती तयार करा →",
    "keywordIntentInput": "कीवर्ड आणि हेतू इनपुट",
    "seedKeyword": "सीड कीवर्ड",
    "searchIntent": "शोध हेतू",
    "generateSeoBrief": "एसईओ ब्रीफ तयार करा",
    "clusteredKeywords": "क्लस्टर केलेले कीवर्ड",
    "structuredSeoBriefOutput": "संरचित 8-स्तरीय एसईओ ब्रीफ आउटपुट",
    "marketingStrategyTitle": "मार्केटिंग रणनीती आणि रोडमॅप",
    "marketingStrategyDesc": "एआय-निर्मित 30-दिवसांची वाढ योजना:",
    "overview": "आढावा",
    "thirtyDayPlan": "30-दिवसांची योजना",
    "save": "जतन करा",
    "generateMasterStrategy": "मास्टर रणनीती तयार करा",
    "objectivesConversionPath": "उद्दिष्टे आणि रूपांतरण मार्ग",
    "primaryBusinessGoal": "प्राथमिक व्यवसाय ध्येय",
    "leadMagnetOffer": "लीड मॅग्नेट / ऑफर",
    "primaryCta": "प्राथमिक कॉल-टू-ॲक्शन",
    "channelMix": "चॅनेल मिश्रण",
    "calendarTitle": "कंटेंट कॅलेंडर आणि वेळापत्रक",
    "calendarDesc": "स्वयंचलित मोहीम वेळापत्रक आणि प्रकाशन कॅलेंडर:",
    "campaignInfo": "मोहीम माहिती",
    "campaignName": "मोहिमेचे नाव",
    "postingFrequency": "पोस्टिंग वारंवारता",
    "startDate": "सुरुवातीची तारीख",
    "endDate": "शेवटची तारीख",
    "generateFromStrategyPlan": "रणनीती योजनेतून तयार करा",
    "campaignProgress": "मोहीम प्रगती",
    "totalPosts": "एकूण पोस्ट",
    "generated": "तयार केले",
    "approved": "मंजूर",
    "scheduled": "शेड्यूल केले",
    "published": "प्रकाशित",
    "remaining": "उरलेले",
    "unifiedContentStudio": "युनिफाइड कंटेंट स्टुडिओ",
    "contentStudioDesc": "ब्लॉग, सोशल पोस्ट आणि ईमेलसाठी एआय ड्राफ्टिंग इंजिन:",
    "blog": "ब्लॉग",
    "socialMedia": "सोशल मीडिया",
    "emailLetter": "ईमेल / पत्र",
    "newspaper": "वृत्तपत्र",
    "openStudio": "स्टुडिओ उघडा",
    "openPage": "पृष्ठ उघडा →",
    "selectChannelStudio": "सुरू करण्यासाठी चॅनेल स्टुडिओ निवडा",
    "selectChannelDesc": "ड्राफ्टिंग पृष्ठ उघडण्यासाठी वरील कोणत्याही चॅनेल कार्डवर क्लिक करा."
  },
  "Telugu": {
    "dashboard": "1. డాష్‌బోర్డ్ (Dashboard)",
    "brands": "2. బ్రాండ్ DNA",
    "seo": "3. SEO ఇంటెలిజెన్స్",
    "strategy": "4. వ్యూహం (Strategy)",
    "calendar": "5. క్యాలెండర్",
    "studio": "6. కంటెంట్ స్టూడియో",
    "websiteBuilder": "7. AI వెబ్‌సైట్ బిల్డర్",
    "campaigns": "8. ప్రచారాలు (Campaigns)",
    "creative": "9. క్రియేటివ్ స్టూడియో",
    "repurpose": "10. రీపర్సస్",
    "assets": "11. అసెట్ లైబ్రరీ",
    "approvals": "12. ఆమోదాల డెస్క్",
    "analytics": "13. అనలిటిక్స్",
    "team": "14. టీమ్ & యాక్సెస్",
    "settings": "13. సెట్టింగ్‌లు & బిల్లింగ్",
    "settingsBtn": "సెట్టింగ్‌లు & బిల్లింగ్",
    "quickSocialPost": "త్వరిత సోషల్ పోస్ట్",
    "engineActive": "AISA™ ఇంజిన్ క్రియాశీలంగా ఉంది",
    "planCreateOptimize": "ప్రణాళిక. సృష్టించండి. ఆప్టిమైజ్. ఆమోదించండి.",
    "backToAiAds": "AI Ads™ కి తిరిగి వెళ్లండి",
    "canonicalOperations": "నిరూపిత కార్యకలాపాలు",
    "operationsHub": "AI Ads™ ఆపరేషన్స్ హబ్",
    "brandDnaBadge": "బ్రాండ్ DNA",
    "topUp": "+టాప్ అప్",
    "visualCredits": "విజువల్ క్రెడిట్స్",
    "role": "పాత్ర (Role)",
    "signedInAs": "సైన్ ఇన్ చేసిన ఖాతా:",
    "accountSettings": "ఖాతా సెట్టింగ్‌లు",
    "signOut": "సైన్ అవుట్ చేయండి",
    "saveAndDone": "సేవ్ చేయండి",
    "appearanceStyle": "రూపము & శైలి",
    "alertsDigest": "అలర్ట్‌లు & డైజెస్ట్",
    "dataControlsBackup": "డేటా నియంత్రణ & బ్యాకప్",
    "profileSessions": "ప్రొఫైల్ & సెషన్లు",
    "billingVisualCredits": "బిల్లింగ్ & క్రెడిట్స్",
    "helpCenterFaq": "సహాయ కేంద్రం & తరచుగా అడిగే ప్రశ్నలు",
    "sendProductFeedback": "అభిప్రాయాన్ని పంపండి",
    "termsOfService": "సేవా నిబంధనలు",
    "privacyPolicy": "గోప్యతా విధానం",
    "themeMode": "థీమ్ మోడ్",
    "darkMode": "డార్క్ మోడ్",
    "lightMode": "లైట్ మోడ్",
    "systemMode": "సిస్టమ్ మోడ్",
    "accentColorTheme": "యాస రంగు థీమ్",
    "targetRegion": "లక్ష్య ప్రాంతం",
    "dashboardLanguage": "డాష్‌బోర్డ్ భాష",
    "multiScheduleReminder": "షెడ్యూల్ రిమైండర్",
    "describeItWeBuildIt": "వివరించండి. మేము నిర్మిస్తాము.",
    "newApplication": "కొత్త అప్లికేషన్",
    "allProjects": "అన్ని ప్రాజెక్ట్‌లు",
    "browseTemplates": "12+ టెంప్లేట్‌లను బ్రౌజ్ చేయండి",
    "viewApprovalsQueue": "ఆమోదాల క్యూ చూడండి",
    "platformPreferences": "ప్లాట్‌ఫారమ్ ప్రాధాన్యతలు",
    "accountSecurity": "ఖాతా & భద్రత",
    "monetizationApi": "మొనిటైజేషన్ & API",
    "helpResources": "సహాయం & వనరులు",
    "darkDesc": "అధిక కాంట్రాస్ట్ డార్క్ థీమ్",
    "lightDesc": "శుభ్రమైన తెలుపు నేపథ్యం",
    "systemDesc": "OS తో ఆటోమేటిక్ సింక్",
    "targetRegionDesc": "లక్ష్య మార్కెట్ ప్రమాణాలు మరియు ప్రేక్షకుల కొలతలను సర్దుబాటు చేయండి.",
    "languageDesc": "ఇంటర్‌ఫేస్ మరియు ప్రాంప్ట్ యొక్క డిఫాల్ట్ భాష.",
    "reminderDesc": "ఆటోమేటెడ్ పోస్ట్ పబ్లిషింగ్ అలారాలు మరియు పుష్ నోటిఫికేషన్‌లు.",
    "logOut": "లాగ్ అవుట్",
    "canonicalOps": "నిరూపిత కార్యకలాపాలు",
    "opsFlow": "బ్రాండ్ → వ్యూహం → SEO → సృష్టి → ఆమోదం → ప్రచురణ",
    "opsHubTitle": "AI Ads™ ఆపరేషన్స్ హబ్",
    "currentlyGoverning": "ప్రస్తుతం నియంత్రిస్తోంది:",
    "anchoredToDna": "అన్ని అవుట్‌పుట్‌లు మార్చలేని బ్రాండ్ DNA కి కట్టుబడి ఉంటాయి.",
    "quickPost": "త్వరిత పోస్ట్",
    "brandDna": "బ్రాండ్ DNA",
    "verifiedDnaMemory": "ధృవీకరించబడిన బ్రాండ్ DNA మెమరీ",
    "immutablePositioning": "మార్చలేని స్థానం లాక్ చేయబడింది",
    "totalCampaigns": "మొత్తం ప్రచారాలు",
    "currentlyActive": "ప్రస్తుతం సక్రియంగా ఉంది",
    "factCheckRate": "నిజ నిర్ధారణ రేటు",
    "itemsUnverified": "అంశాలు ధృవీకరించబడలేదు",
    "noItemsGenerated": "ఇంకా ఏ అంశాలు సృష్టించబడలేదు",
    "endToEndPipeline": "ఎండ్-టు-ఎండ్ కంటెంట్ పైప్‌లైన్",
    "dnaStepTitle": "1. బ్రాండ్ DNA",
    "dnaStepSub": "స్థానం & వాదనలు",
    "seoStepTitle": "2. SEO బ్రీఫ్‌లు",
    "seoStepSub": "విషయ సమూహాలు & ఉద్దేశం",
    "studioStepTitle": "3. ఎడిటోరియల్ స్టూడియో",
    "studioStepSub": "మల్టీ-ఛానల్ సృష్టి",
    "approvalsStepTitle": "4. ఆమోదాల డెస్క్",
    "approvalsStepSub": "పాలన & ధృవీకరణ",
    "repurposeStepTitle": "5. పునర్వినియోగం",
    "repurposeStepSub": "1 అసెట్ నుండి 5 ఫార్మాట్‌లు",
    "recentProductionItems": "ఇటీవలి ఉత్పత్తి అంశాలు & పాలన స్థితి",
    "noProductionItemsYet": "ఇంకా ఉత్పత్తి అంశాలు లేవు",
    "noProductionDesc": "మీరు ఇంకా ఈ బ్రాండ్ కోసం ఎటువంటి డ్రాఫ్ట్‌లు లేదా ప్రచారాలను సృష్టించలేదు.",
    "tableContent": "కంటెంట్",
    "tableType": "రకం",
    "tableVerified": "ధృవీకరించబడింది",
    "tableStatus": "స్థితి",
    "tableView": "చూడండి"
  },
  "Tamil": {
    "dashboard": "1. டாஷ்போர்டு (Dashboard)",
    "brands": "2. பிராண்ட் DNA",
    "seo": "3. SEO நுண்ணறிவு",
    "strategy": "4. உத்தி (Strategy)",
    "calendar": "5. காலண்டர்",
    "studio": "6. உள்ளடக்க ஸ்டுடியோ",
    "websiteBuilder": "7. AI வலைத்தள உருவாக்குநர்",
    "campaigns": "8. பிரச்சாரங்கள்",
    "creative": "9. கிரியேட்டிவ் ஸ்டுடியோ",
    "repurpose": "10. மறுபயன்பாடு",
    "assets": "11. சொத்து நூலகம்",
    "approvals": "12. ஒப்புதல் மேஜை",
    "analytics": "13. பகுப்பாய்வு",
    "team": "14. குழு & அணுகல்",
    "settings": "13. அமைப்புகள் & பில்லிங்",
    "settingsBtn": "அமைப்புகள் & பில்லிங்",
    "quickSocialPost": "விரைவு சமூக பதிவு",
    "engineActive": "AISA™ இயந்திரம் செயலில் உள்ளது",
    "planCreateOptimize": "திட்டமிடு. உருவாக்கு. மேம்படுத்து. ஒப்புக்கொள்.",
    "backToAiAds": "AI Ads™ க்கு திரும்பு",
    "canonicalOperations": "உறுதிப்படுத்தப்பட்ட செயல்பாடுகள்",
    "operationsHub": "AI Ads™ செயல்பாட்டு மையம்",
    "brandDnaBadge": "பிராண்ட் DNA",
    "topUp": "+டாப் அப்",
    "visualCredits": "காட்சி வரவுகள்",
    "role": "பங்கு (Role)",
    "signedInAs": "உள்நுழைந்துள்ள கணக்கு:",
    "accountSettings": "கணக்கு அமைப்புகள்",
    "signOut": "வெளியேறு",
    "saveAndDone": "சேமிக்க",
    "appearanceStyle": "தோற்றம் & பாணி",
    "alertsDigest": "எச்சரிக்கைகள்",
    "dataControlsBackup": "தரவு கட்டுப்பாடு",
    "profileSessions": "சுயவிவரம் & அமர்வுகள்",
    "billingVisualCredits": "பில்லிங் & வரவுகள்",
    "helpCenterFaq": "உதவி மையம் & கேள்விகள்",
    "sendProductFeedback": "கருத்து அனுப்பவும்",
    "termsOfService": "சேவை விதிமுறைகள்",
    "privacyPolicy": "தனியுரிமைக் கொள்கை",
    "themeMode": "தீம் முறை",
    "darkMode": "டார்க் மோட்",
    "lightMode": "லைட் மோட்",
    "systemMode": "சிஸ்டம் முறை",
    "accentColorTheme": "வண்ண தீம்",
    "targetRegion": "இலக்கு பகுதி",
    "dashboardLanguage": "டாஷ்போர்டு மொழி",
    "multiScheduleReminder": "நினைவூட்டல்",
    "describeItWeBuildIt": "விவரிக்கவும். நாங்கள் உருவாக்குவோம்.",
    "newApplication": "புதிய பயன்பாடு",
    "allProjects": "அனைத்து திட்டங்கள்",
    "browseTemplates": "12+ டெம்ப்ளேட்களை உலாவுங்கள்",
    "viewApprovalsQueue": "ஒப்புதல் வரிசையைப் பார்க்கவும்",
    "platformPreferences": "தள முன்னுரிமைகள்",
    "accountSecurity": "கணக்கு & பாதுகாப்பு",
    "monetizationApi": "பணமாக்கல் & API",
    "helpResources": "உதவி & வளங்கள்",
    "darkDesc": "அதிக கான்ட்ராஸ்ட் இருண்ட தீம்",
    "lightDesc": "தூய்மையான வெள்ளை பின்னணி",
    "systemDesc": "இயக்க முறைமையுடன் தானியங்கு ஒத்திசைவு",
    "targetRegionDesc": "இலக்கு சந்தை ધોરણங்கள் மற்றும் பார்வையாளர் அளவீடுகளை சரிசெய்யவும்.",
    "languageDesc": "இடைமுகம் மற்றும் தூண்டுதலின் இயல்புநிலை மொழி.",
    "reminderDesc": "தானியங்கு பதிவு வெளியீட்டு விழிப்பூட்டல்கள் மற்றும் அறிவிப்புகள்.",
    "logOut": "வெளியேறு",
    "canonicalOps": "உறுதிப்படுத்தப்பட்ட செயல்பாடுகள்",
    "opsFlow": "பிராண்ட் → உத்தி → SEO → உருவாக்கு → ஒப்புக்கொள் → வெளியிடு",
    "opsHubTitle": "AI Ads™ செயல்பாட்டு மையம்",
    "currentlyGoverning": "தற்போது நிர்வகிக்கிறது:",
    "anchoredToDna": "அனைத்து வெளியீடுகளும் மாற்ற முடியாத பிராண்ட் DNA உடன் இணைக்கப்பட்டுள்ளன.",
    "quickPost": "விரைவு பதிவு",
    "brandDna": "பிராண்ட் DNA",
    "verifiedDnaMemory": "சரிபார்க்கப்பட்ட பிராண்ட் DNA நினைவகம்",
    "immutablePositioning": "மாற்ற முடியாத நிலை பூட்டப்பட்டுள்ளது",
    "totalCampaigns": "மொத்த பிரச்சாரங்கள்",
    "currentlyActive": "தற்போது செயலில் உள்ளது",
    "factCheckRate": "உண்மை சரிபார்ப்பு விகிதம்",
    "itemsUnverified": "பொருட்கள் சரிபார்க்கப்படவில்லை",
    "noItemsGenerated": "இன்னும் பொருட்கள் எதுவும் உருவாக்கப்படவில்லை",
    "endToEndPipeline": "முழுமையான உள்ளடக்க குழாய்",
    "dnaStepTitle": "1. பிராண்ட் DNA",
    "dnaStepSub": "நிலைப்பாடு & கோரிக்கைகள்",
    "seoStepTitle": "2. SEO சுருக்கங்கள்",
    "seoStepSub": "தலைப்பு தொகுப்புகள் & நோக்கம்",
    "studioStepTitle": "3. பதிப்பக ஸ்டுடியோ",
    "studioStepSub": "பல சேனல் உருவாக்கம்",
    "approvalsStepTitle": "4. ஒப்புதல் மேஜை",
    "approvalsStepSub": "நிர்வாகம் & சரிபார்ப்பு",
    "repurposeStepTitle": "5. மறுபயன்பாடு",
    "repurposeStepSub": "1 வளத்திலிருந்து 5 வடிவங்கள்",
    "recentProductionItems": "சமீபத்திய உற்பத்தி பொருட்கள் & நிலை",
    "noProductionItemsYet": "இன்னும் உற்பத்தி பொருட்கள் எதுவும் இல்லை",
    "noProductionDesc": "இந்த பிராண்டிற்கு நீங்கள் இன்னும் எந்த வரைவுகளையும் உருவாக்கவில்லை.",
    "tableContent": "உள்ளடக்கம்",
    "tableType": "வகை",
    "tableVerified": "சரிபார்க்கப்பட்டது",
    "tableStatus": "நிலை",
    "tableView": "பார்"
  },
  "Kannada": {
    "dashboard": "1. ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Dashboard)",
    "brands": "2. ಬ್ರಾಂಡ್ DNA",
    "seo": "3. SEO ಇಂಟೆಲಿಜೆನ್ಸ್",
    "strategy": "4. ತಂತ್ರ (Strategy)",
    "calendar": "5. ಕ್ಯಾಲೆಂಡರ್",
    "studio": "6. ಕಂಟೆಂಟ್ ಸ್ಟುಡಿಯೋ",
    "websiteBuilder": "7. AI ವೆಬ್‌ಸೈಟ್ ಬಿಲ್ಡರ್",
    "campaigns": "8. ಪ್ರಚಾರಗಳು",
    "creative": "9. ಕ್ರಿಯೇಟಿವ್ ಸ್ಟುಡಿಯೋ",
    "repurpose": "10. ಮರುಬಳಕೆ",
    "assets": "11. ಅಸೆಟ್ ಲೈಬ್ರರಿ",
    "approvals": "12. ಅನುಮೋದನೆ ಡೆಸ್ಕ್",
    "analytics": "13. ಅನಾಲಿಟಿಕ್ಸ್",
    "team": "14. ತಂಡ & ಪ್ರವೇಶ",
    "settings": "13. ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಬಿಲ್ಲಿಂಗ್",
    "settingsBtn": "ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಬಿಲ್ಲಿಂಗ್",
    "quickSocialPost": "ತ್ವರಿತ ಸೋಶಿಯಲ್ ಪೋಸ್ಟ್",
    "engineActive": "AISA™ ಎಂಜಿನ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    "planCreateOptimize": "ಯೋಜನೆ. ರಚಿಸಿ. ಆಪ್ಟಿಮೈಸ್ ಮಾಡಿ. ಅನುಮೋದಿಸಿ.",
    "backToAiAds": "AI Ads™ ಗೆ ಹಿಂತಿರುಗಿ",
    "canonicalOperations": "ದೃಢೀಕರಿಸಿದ ಕಾರ್ಯಾಚರಣೆಗಳು",
    "operationsHub": "AI Ads™ ಕಾರ್ಯಾಚರಣೆಗಳ ಹಬ್",
    "brandDnaBadge": "ಬ್ರಾಂಡ್ DNA",
    "topUp": "+ಟಾಪ್ ಅಪ್",
    "visualCredits": "ವಿಶುವಲ್ ಕ್ರೆಡಿಟ್‌ಗಳು",
    "role": "ಪಾತ್ರ (Role)",
    "signedInAs": "ಸೈನ್ ಇನ್ ಮಾಡಲಾದ ಖಾತೆ:",
    "accountSettings": "ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "signOut": "ಸೈನ್ ಔಟ್ ಮಾಡಿ",
    "saveAndDone": "ಉಳಿಸಿ",
    "appearanceStyle": "ರೂಪ ಮತ್ತು ಶೈಲಿ",
    "alertsDigest": "ಎಚ್ಚರಿಕೆಗಳು & ಡೈಜೆಸ್ಟ್",
    "dataControlsBackup": "ಡೇಟಾ ನಿಯಂತ್ರಣ & ಬ್ಯಾಕಪ್",
    "profileSessions": "ಪ್ರೊಫೈಲ್ & ಸೆಷನ್‌ಗಳು",
    "billingVisualCredits": "ಬಿಲ್ಲಿಂಗ್ & ಕ್ರೆಡಿಟ್‌ಗಳು",
    "helpCenterFaq": "ಸಹಾಯ ಕೇಂದ್ರ & ಪ್ರಶ್ನೆಗಳು",
    "sendProductFeedback": "ಅಭಿಪ್ರಾಯ ಕಳುಹಿಸಿ",
    "termsOfService": "ಸೇವಾ ನಿಯಮಗಳು",
    "privacyPolicy": "ಗೌಪ್ಯತಾ ನೀತಿ",
    "themeMode": "ಥೀಮ್ ಮೋಡ್",
    "darkMode": "ಡಾರ್ಕ್ ಮೋಡ್",
    "lightMode": "ಲೈಟ್ ಮೋಡ್",
    "systemMode": "ಸಿಸ್ಟಮ್ ಮೋಡ್",
    "accentColorTheme": "ಬಣ್ಣದ ಥೀಮ್",
    "targetRegion": "ಗುರಿ ಪ್ರದೇಶ",
    "dashboardLanguage": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಭಾಷೆ",
    "multiScheduleReminder": "ಶೆಡ್ಯೂಲ್ ಜ್ಞಾಪನೆ",
    "describeItWeBuildIt": "ವಿವರಿಸಿ. ನಾವು ನಿರ್ಮಿಸುತ್ತೇವೆ.",
    "newApplication": "ಹೊಸ ಅಪ್ಲಿಕೇಶನ್",
    "allProjects": "ಎಲ್ಲಾ ಪ್ರಾಜೆಕ್ಟ್‌ಗಳು",
    "browseTemplates": "12+ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "viewApprovalsQueue": "ಅನುಮೋದನೆ ಸರತಿಯನ್ನು ವೀಕ್ಷಿಸಿ",
    "platformPreferences": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರಾಶಸ್ತ್ಯಗಳು",
    "accountSecurity": "ಖಾತೆ & ಭದ್ರತೆ",
    "monetizationApi": "ಮೊನಿಟೈಸೇಶನ್ & API",
    "helpResources": "ಸಹಾಯ & ಸಂಪನ್ಮೂಲಗಳು",
    "darkDesc": "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ಡಾರ್ಕ್ ಥೀಮ್",
    "lightDesc": "ನೈರ್ಮಲ್ಯದ ಬಿಳಿ ಹಿನ್ನೆಲೆ",
    "systemDesc": "OS ನೊಂದಿಗೆ ಸ್ವಯಂಚಾಲಿತ ಸಿಂಕ್",
    "targetRegionDesc": "ಗುರಿ ಮಾರುಕಟ್ಟೆ ಮಾನದಂಡಗಳು ಮತ್ತು ಪ್ರೇಕ್ಷಕರ ಮೆಟ್ರಿಕ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ.",
    "languageDesc": "ಇಂಟರ್ಫೇಸ್ ಮತ್ತು ಪ್ರಾಂಪ್ಟ್‌ನ ಡೀಫಾಲ್ಟ್ ಭಾಷೆ.",
    "reminderDesc": "ಸ್ವಯಂಚಾಲಿತ ಪೋಸ್ಟ್ ಪ್ರಕಟಣೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು.",
    "logOut": "ಲಾಗ್ ಔಟ್",
    "canonicalOps": "ದೃಢೀಕರಿಸಿದ ಕಾರ್ಯಾಚರಣೆಗಳು",
    "opsFlow": "ಬ್ರಾಂಡ್ → ತಂತ್ರ → SEO → ರಚಿಸಿ → ಅನುಮೋದಿಸಿ → ಪ್ರಕಟಿಸಿ",
    "opsHubTitle": "AI Ads™ ಕಾರ್ಯಾಚರಣೆಗಳ ಹಬ್",
    "currentlyGoverning": "ಪ್ರಸ್ತುತ ನಿಯಂತ್ರಿಸುತ್ತಿದೆ:",
    "anchoredToDna": "ಎಲ್ಲಾ ಔಟ್‌ಪುಟ್‌ಗಳು ಬದಲಾಯಿಸಲಾಗದ ಬ್ರಾಂಡ್ DNA ಗೆ ಬದ್ಧವಾಗಿವೆ.",
    "quickPost": "ತ್ವರಿತ ಪೋಸ್ಟ್",
    "brandDna": "ಬ್ರಾಂಡ್ DNA",
    "verifiedDnaMemory": "ದೃಢೀಕರಿಸಿದ ಬ್ರಾಂಡ್ DNA ಮೆಮೊರಿ",
    "immutablePositioning": "ಬದಲಾಯಿಸಲಾಗದ ಸ್ಥಾನ ಲಾಕ್ ಆಗಿದೆ",
    "totalCampaigns": "ಒಟ್ಟು ಪ್ರಚಾರಗಳು",
    "currentlyActive": "ಪ್ರಸ್ತುತ ಸಕ್ರಿಯವಾಗಿದೆ",
    "factCheckRate": "ಸತ್ಯ-ಪರಿಶೀಲನೆ ದರ",
    "itemsUnverified": "ಅಂಶಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ",
    "noItemsGenerated": "ಇನ್ನೂ ಯಾವುದೇ ಅಂಶಗಳನ್ನು ರಚಿಸಲಾಗಿಲ್ಲ",
    "endToEndPipeline": "ಎಂಡ್-ಟು-ಎಂಡ್ ಕಂಟೆಂಟ್ ಪೈಪ್‌ಲೈನ್",
    "dnaStepTitle": "1. ಬ್ರಾಂಡ್ DNA",
    "dnaStepSub": "ಸ್ಥಾನ ಮತ್ತು ಹಕ್ಕುಗಳು",
    "seoStepTitle": "2. SEO ಬ್ರೀಫ್‌ಗಳು",
    "seoStepSub": "ವಿಷಯ ಕ್ಲಸ್ಟರ್‌ಗಳು ಮತ್ತು ಉದ್ದೇಶ",
    "studioStepTitle": "3. ಎಡಿಟೋರಿಯಲ್ ಸ್ಟುಡಿಯೋ",
    "studioStepSub": "ಮಲ್ಟಿ-ಚಾನೆಲ್ ರಚನೆ",
    "approvalsStepTitle": "4. ಅನುಮೋದನೆ ಡೆಸ್ಕ್",
    "approvalsStepSub": "ಆಡಳಿತ ಮತ್ತು ಪರಿಶೀಲನೆ",
    "repurposeStepTitle": "5. ಮರುಬಳಕೆ",
    "repurposeStepSub": "1 ಅಸೆಟ್‌ನಿಂದ 5 ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು",
    "recentProductionItems": "ಇತ್ತೀಚಿನ ಉತ್ಪಾದನಾ ಅಂಶಗಳು ಮತ್ತು ಸ್ಥಿತಿ",
    "noProductionItemsYet": "ಇನ್ನೂ ಉತ್ಪಾದನಾ ಅಂಶಗಳಿಲ್ಲ",
    "noProductionDesc": "ನೀವು ಇನ್ನೂ ಈ ಬ್ರಾಂಡ್‌ಗಾಗಿ ಯಾವುದೇ ಕರಡುಗಳನ್ನು ರಚಿಸಿಲ್ಲ.",
    "tableContent": "ಕಂಟೆಂಟ್",
    "tableType": "ಪ್ರಕಾರ",
    "tableVerified": "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    "tableStatus": "ಸ್ಥಿತಿ",
    "tableView": "ವೀಕ್ಷಿಸಿ"
  },
  "Malayalam": {
    "dashboard": "1. ഡാഷ്‌ബോർഡ് (Dashboard)",
    "brands": "2. ബ്രാൻഡ് DNA",
    "seo": "3. SEO ഇന്റലിജൻസ്",
    "strategy": "4. തന്ത്രം (Strategy)",
    "calendar": "5. കലണ്ടർ",
    "studio": "6. കോൺടെന്റ് സ്റ്റുഡിയോ",
    "websiteBuilder": "7. AI വെബ്‌സൈറ്റ് ബിൽഡർ",
    "campaigns": "8. പ്രചാരണങ്ങൾ",
    "creative": "9. ക്രിയേറ്റീവ് സ്റ്റുഡിയോ",
    "repurpose": "10. പുനരുപയോഗം",
    "assets": "11. അസറ്റ് ലൈബ്രറി",
    "approvals": "12. അംഗീകാര ഡെസ്ക്",
    "analytics": "13. അനലിറ്റിക്സ്",
    "team": "14. ടീമും ആക്സസും",
    "settings": "13. ക്രമീകരണങ്ങൾ & ബില്ലിംഗ്",
    "settingsBtn": "ക്രമീകരണങ്ങൾ & ബില്ലിംഗ്",
    "quickSocialPost": "ദ്രുത സോഷ്യൽ പോസ്റ്റ്",
    "engineActive": "AISA™ എഞ്ചിൻ സജീവമാണ്",
    "planCreateOptimize": "ആസൂത്രണം. സൃഷ്ടിക്കുക. ഒപ്റ്റിമൈസ് ചെയ്യുക. അംഗീകരിക്കുക.",
    "backToAiAds": "AI Ads™ ലേക്ക് മടങ്ങുക",
    "canonicalOperations": "സ്ഥിരീകരിച്ച പ്രവർത്തനങ്ങൾ",
    "operationsHub": "AI Ads™ പ്രവർത്തന ഹബ്",
    "brandDnaBadge": "ബ്രാൻഡ് DNA",
    "topUp": "+ടോപ്പ് അപ്പ്",
    "visualCredits": "വിഷ്വൽ ക്രെഡിറ്റുകൾ",
    "role": "പങ്ക് (Role)",
    "signedInAs": "സൈൻ ഇൻ ചെയ്ത അക്കൗണ്ട്:",
    "accountSettings": "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ",
    "signOut": "സൈൻ ഔട്ട് ചെയ്യുക",
    "saveAndDone": "സേവ് ചെയ്യുക",
    "appearanceStyle": "രൂപവും ശൈലിയും",
    "alertsDigest": "അലേർട്ടുകളും ഡൈജസ്റ്റും",
    "dataControlsBackup": "ഡാറ്റ നിയന്ത്രണം & ബാക്കപ്പ്",
    "profileSessions": "പ്രൊഫൈലും സെഷനുകളും",
    "billingVisualCredits": "ബില്ലിംഗും ക്രെഡിറ്റുകളും",
    "helpCenterFaq": "സഹായ കേന്ദ്രവും ചോദ്യങ്ങളും",
    "sendProductFeedback": "അഭിപ്രായം അയക്കുക",
    "termsOfService": "സേവന നിബന്ധനകൾ",
    "privacyPolicy": "സ്വകാര്യതാ നയം",
    "themeMode": "തീം മോഡ്",
    "darkMode": "ഡാർക്ക് മോഡ്",
    "lightMode": "ലൈറ്റ് മോഡ്",
    "systemMode": "സിസ്റ്റം മോഡ്",
    "accentColorTheme": "വർണ്ണ തീം",
    "targetRegion": "ലക്ഷ്യ പ്രദേശം",
    "dashboardLanguage": "ഡാഷ്‌ബോർഡ് ഭാഷ",
    "multiScheduleReminder": "ഷെഡ്യൂൾ ഓർമ്മപ്പെടുത്തൽ",
    "describeItWeBuildIt": "വിവരിക്കുക. ഞങ്ങൾ നിർമ്മിക്കും.",
    "newApplication": "പുതിയ ആപ്ലിക്കേഷൻ",
    "allProjects": "എല്ലാ പ്രോജക്റ്റുകളും",
    "browseTemplates": "12+ ടെംപ്ലേറ്റുകൾ കാണുക",
    "viewApprovalsQueue": "അംഗീകാര നിര കാണുക",
    "platformPreferences": "പ്ലാറ്റ്‌ഫോം മുൻഗണനകൾ",
    "accountSecurity": "അക്കൗണ്ടും സുരക്ഷയും",
    "monetizationApi": "മോണിറ്റൈസേഷനും API യും",
    "helpResources": "സഹായവും വിഭവങ്ങളും",
    "darkDesc": "ഉയർന്ന കോൺട്രാസ്റ്റ് ഡാർക്ക് തീം",
    "lightDesc": "വ്യക്തമായ വെളുത്ത പശ്ചാത്തലം",
    "systemDesc": "OS മായി സ്വയമേവ സമന്വയിപ്പിക്കുക",
    "targetRegionDesc": "ലക്ഷ്യ വിപണി മാനദണ്ഡങ്ങളും പ്രേക്ഷക മാനദണ്ഡങ്ങളും ക്രമീകരിക്കുക.",
    "languageDesc": "ഇന്റർഫേസിന്റെയും പ്രോംപ്റ്റിന്റെയും ഡിഫോൾട്ട് ഭാഷ.",
    "reminderDesc": "സ്വയമേവയുള്ള പോസ്റ്റ് പ്രസിദ്ധീകരണ അലേർട്ടുകളും പുഷ് അറിയിപ്പുകളും.",
    "logOut": "ലോഗ് ഔട്ട്",
    "canonicalOps": "സ്ഥിരീകരിച്ച പ്രവർത്തനങ്ങൾ",
    "opsFlow": "ബ്രാൻഡ് → തന്ത്രം → SEO → സൃഷ്ടിക്കുക → അംഗീകരിക്കുക → പ്രസിദ്ധീകരിക്കുക",
    "opsHubTitle": "AI Ads™ പ്രവർത്തന ഹബ്",
    "currentlyGoverning": "നിലവിൽ നിയന്ത്രിക്കുന്നു:",
    "anchoredToDna": "എല്ലാ ഔട്ട്പുട്ടുകളും മാറ്റമില്ലാത്ത ബ്രാൻഡ് DNA യുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.",
    "quickPost": "ദ്രുത പോസ്റ്റ്",
    "brandDna": "ബ്രാൻഡ് DNA",
    "verifiedDnaMemory": "സ്ഥിരീകരിച്ച ബ്രാൻഡ് DNA മെമ്മറി",
    "immutablePositioning": "മാറ്റമില്ലാത്ത പൊസിഷനിംഗ് പൂട്ടിയിരിക്കുന്നു",
    "totalCampaigns": "ആകെ പ്രചാരണങ്ങൾ",
    "currentlyActive": "നിലവിൽ സജീവമാണ്",
    "factCheckRate": "വസ്തുതാ പരിശോധന നിരക്ക്",
    "itemsUnverified": "ഇനങ്ങൾ സ്ഥിരീകരിച്ചിട്ടില്ല",
    "noItemsGenerated": "ഇതുവരെ ഇനങ്ങളൊന്നും സൃഷ്ടിച്ചിട്ടില്ല",
    "endToEndPipeline": "എൻഡ്-ടു-എൻഡ് കോൺടെന്റ് പൈപ്പ്‌ലൈൻ",
    "dnaStepTitle": "1. ബ്രാൻഡ് DNA",
    "dnaStepSub": "പൊസിഷനിംഗും അവകാശവാദങ്ങളും",
    "seoStepTitle": "2. SEO ബ്രീഫുകൾ",
    "seoStepSub": "വിഷയ ക്ലസ്റ്ററുകളും ഉദ്ദേശ്യവും",
    "studioStepTitle": "3. എഡിറ്റോറിയൽ സ്റ്റുഡിയോ",
    "studioStepSub": "മൾട്ടി-ചാനൽ സൃഷ്ടി",
    "approvalsStepTitle": "4. അംഗീകാര ഡെസ്ക്",
    "approvalsStepSub": "ഭരണവും പരിശോധനയും",
    "repurposeStepTitle": "5. പുനരുപയോഗം",
    "repurposeStepSub": "1 അസറ്റിൽ നിന്ന് 5 ഫോർമാറ്റുകൾ",
    "recentProductionItems": "സമീപകാല ഉൽപ്പാദന ഇനങ്ങളും ഭരണ നിലയും",
    "noProductionItemsYet": "ഇതുവരെ ഉൽപ്പാദന ഇനങ്ങളൊന്നുമില്ല",
    "noProductionDesc": "ഈ ബ്രാൻഡിനായി നിങ്ങൾ ഇതുവരെ ഡ്രാഫ്റ്റുകളോ പ്രചാരണങ്ങളോ സൃഷ്ടിച്ചിട്ടില്ല.",
    "tableContent": "കോൺടെന്റ്",
    "tableStatus": "നില",
    "tableView": "കാണുക"
  },
  "Spanish": {
    "dashboard": "1. Panel Control",
    "brands": "2. ADN de Marca",
    "seo": "3. Inteligencia SEO",
    "strategy": "4. Estrategia",
    "calendar": "5. Calendario",
    "studio": "6. Estudio Contenido",
    "websiteBuilder": "7. Creador Web IA",
    "campaigns": "8. Campañas",
    "creative": "9. Estudio Creativo",
    "repurpose": "10. Reutilizar",
    "assets": "11. Biblioteca",
    "approvals": "12. Aprobaciones",
    "analytics": "13. Analítica",
    "team": "14. Equipo y Permisos",
    "settings": "13. Ajustes y Facturación",
    "settingsBtn": "Ajustes y Facturación",
    "quickSocialPost": "Publicación Rápida",
    "engineActive": "Motor AISA™ Activo",
    "planCreateOptimize": "Planifica. Crea. Optimiza. Aprueba.",
    "backToAiAds": "Volver a AI Ads™",
    "canonicalOperations": "Operaciones Canónicas",
    "operationsHub": "Centro de Operaciones AI Ads™",
    "brandDnaBadge": "ADN de Marca",
    "topUp": "+Recargar",
    "visualCredits": "Créditos Visuales",
    "role": "Rol",
    "signedInAs": "Conectado como:",
    "accountSettings": "Configuración de Cuenta",
    "signOut": "Cerrar Sesión",
    "saveAndDone": "Guardar y Listo",
    "appearanceStyle": "Apariencia y Estilo",
    "alertsDigest": "Alertas y Resumen",
    "dataControlsBackup": "Controles de Datos y Copias",
    "profileSessions": "Perfil y Sesiones",
    "billingVisualCredits": "Facturación y Créditos",
    "helpCenterFaq": "Centro de Ayuda y FAQ",
    "sendProductFeedback": "Enviar Comentarios",
    "termsOfService": "Términos del Servicio",
    "privacyPolicy": "Política de Privacidad",
    "themeMode": "Modo de Tema",
    "darkMode": "Modo Oscuro",
    "lightMode": "Modo Claro",
    "systemMode": "Sistema",
    "accentColorTheme": "Color de Acento",
    "targetRegion": "Región Objetivo",
    "dashboardLanguage": "Idioma del Panel",
    "multiScheduleReminder": "Recordatorio Programado",
    "describeItWeBuildIt": "Descríbelo. Lo construimos.",
    "newApplication": "Nueva Aplicación",
    "allProjects": "Todos los Proyectos",
    "browseTemplates": "Ver las 12+ Plantillas",
    "viewApprovalsQueue": "Ver Cola de Aprobación",
    "platformPreferences": "PREFERENCIAS DE PLATAFORMA",
    "accountSecurity": "CUENTA Y SEGURIDAD",
    "monetizationApi": "MONETIZACIÓN Y API",
    "helpResources": "AYUDA Y RECURSOS",
    "darkDesc": "Tema oscuro de alto contraste",
    "lightDesc": "Fondo blanco limpio",
    "systemDesc": "Sincronización automática con SO",
    "targetRegionDesc": "Ajusta estándares de mercado objetivo y métricas.",
    "languageDesc": "Idioma predeterminado de la interfaz y sugerencias.",
    "reminderDesc": "Alertas automatizadas de publicación y notificaciones push.",
    "logOut": "CERRAR SESIÓN",
    "canonicalOps": "Operaciones Canónicas",
    "opsFlow": "Marca → Estrategia → SEO → Crear → Aprobar → Publicar",
    "opsHubTitle": "Centro de Operaciones AI Ads™",
    "currentlyGoverning": "Gobernando actualmente:",
    "anchoredToDna": "Todo el contenido está vinculado al ADN de Marca inmutable.",
    "quickPost": "Publicación Rápida",
    "brandDna": "ADN de Marca",
    "verifiedDnaMemory": "Memoria de ADN de Marca Verificada",
    "immutablePositioning": "Posicionamiento inmutable bloqueado",
    "totalCampaigns": "Campañas Totales",
    "currentlyActive": "activas actualmente",
    "factCheckRate": "Tasa de Verificación de Datos",
    "itemsUnverified": "elementos no verificados",
    "noItemsGenerated": "No se han generado elementos aún",
    "endToEndPipeline": "Flujo de Trabajo de Contenido",
    "dnaStepTitle": "1. ADN de Marca",
    "dnaStepSub": "Posicionamiento y Afirmaciones",
    "seoStepTitle": "2. Informes SEO",
    "seoStepSub": "Grupos de Temas e Intención",
    "studioStepTitle": "3. Estudio Editorial",
    "studioStepSub": "Generación Multicanal",
    "approvalsStepTitle": "4. Mesa de Aprobación",
    "approvalsStepSub": "Gobernanza y Verificación",
    "repurposeStepTitle": "5. Reutilización",
    "repurposeStepSub": "1 Recurso a 5 Formatos",
    "recentProductionItems": "Elementos Recientes de Producción",
    "noProductionItemsYet": "Sin elementos de producción aún",
    "noProductionDesc": "Aún no has generado borradores ni campañas para esta marca. Comienza escaneando el ADN de Marca o creando una nueva publicación.",
    "tableContent": "Contenido",
    "tableType": "Tipo",
    "tableVerified": "Verificado",
    "tableStatus": "Estado",
    "tableView": "Ver"
    ,
    "brandDnaTitle": "Inteligencia de Marca y ADN de Marca",
    "brandDnaDesc": "Memoria de marca inmutable que rige la voz y posicionamiento para",
    "runDeepAiAnalysis": "Ejecutar Análisis Profundo de IA",
    "saveProfile": "Guardar Perfil",
    "runSeoResearchFromDna": "Ejecutar Investigación SEO desde ADN de Marca →",
    "brandIdentity": "IDENTIDAD DE MARCA",
    "confidence": "Confianza",
    "colorPalette": "Paleta de Colores",
    "industry": "Industria",
    "toneOfVoice": "Tono de Voz",
    "targetGoal": "Objetivo Principal",
    "targetAudience": "AUDIENCIA OBJETIVO",
    "contentPillarsAngles": "PILARES DE CONTENIDO Y ÁNGULOS",
    "pillar": "PILAR",
    "productsServices": "PRODUCTOS Y SERVICIOS",
    "brandValuesTitle": "VALORES DE MARCA",
    "commRules": "REGLAS DE COMUNICACIÓN (LO QUE SE DEBE Y NO DEBE HACER)",
    "dos": "LO QUE SE DEBE HACER",
    "donts": "LO QUE NO SE DEBE HACER",
    "seoTitle": "Inteligencia SEO y Generador de Informes",
    "seoDesc": "Agrupación de palabras clave y generación de informes de 8 pasos para",
    "generateStrategyFromSeo": "Generar Estrategia de Campaña desde SEO →",
    "keywordIntentInput": "ENTRADA DE PALABRA CLAVE E INTENCIÓN",
    "seedKeyword": "PALABRA CLAVE SEMILLA",
    "searchIntent": "INTENCIÓN DE BÚSQUEDA",
    "generateSeoBrief": "Generar Informe SEO",
    "clusteredKeywords": "PALABRAS CLAVE AGRUPADAS",
    "structuredSeoBriefOutput": "INFORME SEO ESTRUCTURADO DE 8 PASOS",
    "marketingStrategyTitle": "Estrategia de Marketing y Hoja de Ruta",
    "marketingStrategyDesc": "Plan de crecimiento de 30 días generado por IA para",
    "overview": "Visión General",
    "thirtyDayPlan": "Plan de 30 Días",
    "save": "Guardar",
    "generateMasterStrategy": "Generar Estrategia Maestra",
    "objectivesConversionPath": "OBJETIVOS Y RUTA DE CONVERSIÓN",
    "primaryBusinessGoal": "OBJETIVO COMERCIAL PRINCIPAL",
    "leadMagnetOffer": "IMÁN DE CLIENTES / OFERTA",
    "primaryCta": "LLAMADA A LA ACCIÓN PRINCIPAL",
    "channelMix": "MEZCLA DE CANALES",
    "calendarTitle": "Calendario de Contenido y Programación",
    "calendarDesc": "Calendario de programación automatizada y publicación para",
    "campaignInfo": "INFORMACIÓN DE CAMPAÑA",
    "campaignName": "NOMBRE DE CAMPAÑA",
    "postingFrequency": "FRECUENCIA DE PUBLICACIÓN",
    "startDate": "FECHA DE INICIO",
    "endDate": "FECHA DE FINALIZACIÓN",
    "generateFromStrategyPlan": "GENERAR DESDE PLAN ESTRATÉGICO",
    "campaignProgress": "PROGRESO DE CAMPAÑA",
    "totalPosts": "PUBLICACIONES TOTALES",
    "generated": "GENERADAS",
    "approved": "APROBADAS",
    "scheduled": "PROGRAMADAS",
    "published": "PUBLICADAS",
    "remaining": "RESTANTES",
    "unifiedContentStudio": "Estudio de Contenido Unificado",
    "contentStudioDesc": "Motor de redacción IA para blogs, redes sociales y correos para",
    "blog": "Blog",
    "socialMedia": "Redes Sociales",
    "emailLetter": "Correo / Carta",
    "newspaper": "Periódico",
    "openStudio": "Abrir Estudio",
    "openPage": "Abrir Página →",
    "selectChannelStudio": "Selecciona un Estudio de Canal para Comenzar",
    "selectChannelDesc": "Haz clic en cualquier tarjeta de canal arriba para abrir su página dedicada."
  },
  "French": {
    "dashboard": "1. Tableau de bord",
    "brands": "2. ADN de Marque",
    "seo": "3. Intelligence SEO",
    "strategy": "4. Stratégie",
    "calendar": "5. Calendrier",
    "studio": "6. Studio de Contenu",
    "websiteBuilder": "7. Créateur Web IA",
    "campaigns": "8. Campagnes",
    "creative": "9. Studio Créatif",
    "repurpose": "10. Reconditionner",
    "assets": "11. Médiathèque",
    "approvals": "12. Validations",
    "analytics": "13. Analytique",
    "team": "14. Équipe et Rôles",
    "settings": "13. Paramètres & Facturation",
    "settingsBtn": "Paramètres & Facturation",
    "quickSocialPost": "Publication Rapide",
    "engineActive": "Moteur AISA™ Actif",
    "planCreateOptimize": "Planifiez. Créez. Optimisez. Validez.",
    "backToAiAds": "Retour à AI Ads™",
    "canonicalOperations": "Opérations Canoniques",
    "operationsHub": "Centre d’Opérations AI Ads™",
    "brandDnaBadge": "ADN de Marque",
    "topUp": "+Recharger",
    "visualCredits": "Crédits Visuels",
    "role": "Rôle",
    "signedInAs": "Connecté en tant que :",
    "accountSettings": "Paramètres du Compte",
    "signOut": "Déconnexion",
    "saveAndDone": "Enregistrer & Quitter",
    "appearanceStyle": "Apparence & Style",
    "alertsDigest": "Alertes & Synthèse",
    "dataControlsBackup": "Données & Sauvegardes",
    "profileSessions": "Profil & Sessions",
    "billingVisualCredits": "Facturation & Crédits",
    "helpCenterFaq": "Centre d’Aide & FAQ",
    "sendProductFeedback": "Envoyer un Commentaire",
    "termsOfService": "Conditions d’Utilisation",
    "privacyPolicy": "Politique de Confidentialité",
    "themeMode": "Mode de Thème",
    "darkMode": "Mode Sombre",
    "lightMode": "Mode Clair",
    "systemMode": "Système",
    "accentColorTheme": "Couleur d’Accent",
    "targetRegion": "Région Cible",
    "dashboardLanguage": "Langue du Tableau de Bord",
    "multiScheduleReminder": "Rappel de Programmation",
    "describeItWeBuildIt": "Décrivez-le. Nous le créons.",
    "newApplication": "Nouvelle Application",
    "allProjects": "Tous les Projets",
    "browseTemplates": "Explorer les 12+ Modèles",
    "viewApprovalsQueue": "Voir la File de Validation",
    "platformPreferences": "PRÉFÉRENCES PLATEFORME",
    "accountSecurity": "COMPTE ET SÉCURITÉ",
    "monetizationApi": "MONÉTISATION ET API",
    "helpResources": "AIDE ET RESSOURCES",
    "darkDesc": "Thème sombre à haut contraste",
    "lightDesc": "Fond blanc épuré",
    "systemDesc": "Synchronisation auto avec le système",
    "targetRegionDesc": "Ajustez les standards de marché et métriques.",
    "languageDesc": "Langue par défaut de l’interface et des requêtes.",
    "reminderDesc": "Alertes automatiques de publication et notifications push.",
    "logOut": "SE DÉCONNECTER",
    "canonicalOps": "Opérations Canoniques",
    "opsFlow": "Marque → Stratégie → SEO → Créer → Valider → Publier",
    "opsHubTitle": "Centre d’Opérations AI Ads™",
    "currentlyGoverning": "Gouverne actuellement :",
    "anchoredToDna": "Tout le contenu est ancré à l’ADN de Marque immuable.",
    "quickPost": "Publication Rapide",
    "brandDna": "ADN de Marque",
    "verifiedDnaMemory": "Mémoire d’ADN de Marque Vérifiée",
    "immutablePositioning": "Positionnement immuable verrouillé",
    "totalCampaigns": "Total des Campagnes",
    "currentlyActive": "actuellement actives",
    "factCheckRate": "Taux de Vérification des Faits",
    "itemsUnverified": "éléments non vérifiés",
    "noItemsGenerated": "Aucun élément généré pour le moment",
    "endToEndPipeline": "Chaîne de Production de Contenu",
    "dnaStepTitle": "1. ADN de Marque",
    "dnaStepSub": "Positionnement et Affirmations",
    "seoStepTitle": "2. Briefs SEO",
    "seoStepSub": "Groupes de Sujets et Intention",
    "studioStepTitle": "3. Studio Éditorial",
    "studioStepSub": "Génération Multicanale",
    "approvalsStepTitle": "4. Bureau de Validation",
    "approvalsStepSub": "Gouvernance et Vérification",
    "repurposeStepTitle": "5. Reconditionnement",
    "repurposeStepSub": "1 Ressource vers 5 Formats",
    "recentProductionItems": "Éléments Récents de Production",
    "noProductionItemsYet": "Aucun élément de production pour l’instant",
    "noProductionDesc": "Vous n’avez encore généré aucun brouillon ni aucune campagne pour cette marque. Commencez par scanner l’ADN de Marque ou créez une publication.",
    "tableContent": "Contenu",
    "tableType": "Type",
    "tableVerified": "Vérifié",
    "tableStatus": "Statut",
    "tableView": "Voir"
  },
  "German": {
    "dashboard": "1. Dashboard",
    "brands": "2. Marken-DNA",
    "seo": "3. SEO-Intelligenz",
    "strategy": "4. Strategie",
    "calendar": "5. Kalender",
    "studio": "6. Content-Studio",
    "websiteBuilder": "7. KI-Website-Builder",
    "campaigns": "8. Kampagnen",
    "creative": "9. Kreativ-Studio",
    "repurpose": "10. Wiederverwenden",
    "assets": "11. Asset-Bibliothek",
    "approvals": "12. Freigaben",
    "analytics": "13. Analytik",
    "team": "14. Team & Rechte",
    "settings": "13. Einstellungen & Abrechnung",
    "settingsBtn": "Einstellungen & Abrechnung",
    "quickSocialPost": "Schneller Social-Post",
    "engineActive": "AISA™ Engine Aktiv",
    "planCreateOptimize": "Planen. Erstellen. Optimieren. Freigeben.",
    "backToAiAds": "Zurück zu AI Ads™",
    "canonicalOperations": "Kanonische Operationen",
    "operationsHub": "AI Ads™ Operations-Hub",
    "brandDnaBadge": "Marken-DNA",
    "topUp": "+Guthaben Laden",
    "visualCredits": "Visuelle Credits",
    "role": "Rolle",
    "signedInAs": "Angemeldet als:",
    "accountSettings": "Kontoeinstellungen",
    "signOut": "Abmelden",
    "saveAndDone": "Speichern & Fertig",
    "appearanceStyle": "Erscheinungsbild & Stil",
    "alertsDigest": "Benachrichtigungen & Digest",
    "dataControlsBackup": "Datenkontrolle & Backup",
    "profileSessions": "Profil & Sitzungen",
    "billingVisualCredits": "Abrechnung & Credits",
    "helpCenterFaq": "Hilfe-Center & FAQ",
    "sendProductFeedback": "Feedback Senden",
    "termsOfService": "Nutzungsbedingungen",
    "privacyPolicy": "Datenschutz-Bestimmungen",
    "themeMode": "Design-Modus",
    "darkMode": "Dunkler Modus",
    "lightMode": "Heller Modus",
    "systemMode": "System",
    "accentColorTheme": "Akzentfarbe",
    "targetRegion": "Zielregion",
    "dashboardLanguage": "Dashboard-Sprache",
    "multiScheduleReminder": "Termin-Erinnerung",
    "describeItWeBuildIt": "Beschreiben Sie es. Wir bauen es.",
    "newApplication": "Neue Anwendung",
    "allProjects": "Alle Projekte",
    "browseTemplates": "Alle 12+ Vorlagen durchsuchen",
    "viewApprovalsQueue": "Freigabewarteschlange anzeigen",
    "platformPreferences": "PLATTFORM-EINSTELLUNGEN",
    "accountSecurity": "KONTO & SICHERHEIT",
    "monetizationApi": "MONETARISIERUNG & API",
    "helpResources": "HILFE & RESSOURCEN",
    "darkDesc": "Kontrastreiches dunkles Design",
    "lightDesc": "Sauberer weißer Hintergrund",
    "systemDesc": "Automatisch mit Betriebssystem synchronisieren",
    "targetRegionDesc": "Passen Sie Zielmarkt-Standards und Zielgruppen-Metriken an.",
    "languageDesc": "Standardsprache für Benutzeroberfläche und Prompts.",
    "reminderDesc": "Automatisierte Veröffentlichungsalarme und Push-Benachrichtigungen.",
    "logOut": "ABMELDEN",
    "canonicalOps": "Kanonische Operationen",
    "opsFlow": "Marke → Strategie → SEO → Erstellen → Freigeben → Veröffentlichen",
    "opsHubTitle": "AI Ads™ Operations-Hub",
    "currentlyGoverning": "Verwaltet derzeit:",
    "anchoredToDna": "Alle Ausgaben sind an die unveränderliche Marken-DNA gebunden.",
    "quickPost": "Schneller Post",
    "brandDna": "Marken-DNA",
    "verifiedDnaMemory": "Verifizierter Marken-DNA-Speicher",
    "immutablePositioning": "Unveränderliche Positionierung sperrt",
    "totalCampaigns": "Gesamte Kampagnen",
    "currentlyActive": "derzeit aktiv",
    "factCheckRate": "Faktenprüfungs-Quote",
    "itemsUnverified": "Elemente unbestätigt",
    "noItemsGenerated": "Noch keine Elemente generiert",
    "endToEndPipeline": "End-to-End Content-Pipeline",
    "dnaStepTitle": "1. Marken-DNA",
    "dnaStepSub": "Positionierung & Aussagen",
    "seoStepTitle": "2. SEO-Briefings",
    "seoStepSub": "Themen-Cluster & Intent",
    "studioStepTitle": "3. Redaktions-Studio",
    "studioStepSub": "Multi-Kanal-Generierung",
    "approvalsStepTitle": "4. Freigabedesk",
    "approvalsStepSub": "Governance & Verifizierung",
    "repurposeStepTitle": "5. Wiederverwendung",
    "repurposeStepSub": "1 Asset in 5 Formate",
    "recentProductionItems": "Neueste Produktions-Elemente",
    "noProductionItemsYet": "Noch keine Produktions-Elemente",
    "noProductionDesc": "Sie haben für diese Marke noch keine Entwürfe oder Kampagnen generiert. Beginnen Sie mit dem Einlesen der Marken-DNA oder erstellen Sie einen neuen Beitrag.",
    "tableContent": "Inhalt",
    "tableType": "Typ",
    "tableVerified": "Verifiziert",
    "tableStatus": "Status",
    "tableView": "Anzeigen"
  },
  "Arabic": {
    "dashboard": "1. لوحة التحكم",
    "brands": "2. DNA العلامة التجارية",
    "seo": "3. ذكاء SEO",
    "strategy": "4. الاستراتيجية",
    "calendar": "5. التقويم",
    "studio": "6. استوديو المحتوى",
    "websiteBuilder": "7. منشئ المواقع الذكي",
    "campaigns": "8. الحملات الإعلانية",
    "creative": "9. الاستوديو الإبداعي",
    "repurpose": "10. إعادة الاستخدام",
    "assets": "11. مكتبة الأصول",
    "approvals": "12. مكتب الموافقات",
    "analytics": "13. التحليلات",
    "team": "14. الفريق والأذونات",
    "settings": "13. الإعدادات والفوترة",
    "settingsBtn": "الإعدادات والفوترة",
    "quickSocialPost": "منشور سريع",
    "engineActive": "محرك AISA™ نشط",
    "planCreateOptimize": "خطط. أنشئ. حسّن. وافق.",
    "backToAiAds": "العودة إلى AI Ads™",
    "canonicalOperations": "العمليات المعتمدة",
    "operationsHub": "مركز عمليات AI Ads™",
    "brandDnaBadge": "DNA العلامة التجارية",
    "topUp": "+إعادة شحن",
    "visualCredits": "الرصيد البصري",
    "role": "الدور",
    "signedInAs": "مسجل الدخول باسم:",
    "accountSettings": "إعدادات الحساب",
    "signOut": "تسجيل الخروج",
    "saveAndDone": "حفظ وإتمام",
    "appearanceStyle": "المظهر والأسلوب",
    "alertsDigest": "التنبيهات والملخص",
    "dataControlsBackup": "التحكم بالبيانات والنسخ",
    "profileSessions": "الملف الشخصي والجلسات",
    "billingVisualCredits": "الفوترة والرصيد البصري",
    "helpCenterFaq": "مركز المساعدة والأسئلة",
    "sendProductFeedback": "إرسال ملاحظات",
    "termsOfService": "شروط الخدمة",
    "privacyPolicy": "سياسة الخصوصية",
    "themeMode": "وضع المظهر",
    "darkMode": "الوضع الداكن",
    "lightMode": "الوضع الفاتح",
    "systemMode": "النظام",
    "accentColorTheme": "لون التمييز",
    "targetRegion": "المنطقة المستهدفة",
    "dashboardLanguage": "لغة لوحة التحكم",
    "multiScheduleReminder": "تذكير الجدولة",
    "describeItWeBuildIt": "صف فكرتك. ونحن نبنيها.",
    "newApplication": "تطبيق جديد",
    "allProjects": "جميع المشاريع",
    "browseTemplates": "تصفح أكثر من 12 قالبًا",
    "viewApprovalsQueue": "عرض قائمة الموافقات",
    "platformPreferences": "تفضيلات المنصة",
    "accountSecurity": "الحساب والأمان",
    "monetizationApi": "التحقيق المالي و API",
    "helpResources": "المساعدة والموارد",
    "darkDesc": "مظهر داكن عالي التباين",
    "lightDesc": "خلفية بيضاء نقية",
    "systemDesc": "مزامنة تلقائية مع نظام التشغيل",
    "targetRegionDesc": "ضبط معايير السوق المستهدفة ومقاييس الجمهور.",
    "languageDesc": "اللغة الافتراضية للواجهة والمطالبات.",
    "reminderDesc": "تنبيها النشر التلقائي والإشعارات الفورية.",
    "logOut": "تسجيل الخروج",
    "canonicalOps": "العمليات المعتمدة",
    "opsFlow": "العلامة التجارية ← الاستراتيجية ← SEO ← إنشاء ← موافقة ← نشر",
    "opsHubTitle": "مركز عمليات AI Ads™",
    "currentlyGoverning": "يدير حالياً:",
    "anchoredToDna": "جميع المخرجات مرتبطة بـ DNA العلامة التجارية الثابت.",
    "quickPost": "منشور سريع",
    "brandDna": "DNA العلامة التجارية",
    "verifiedDnaMemory": "ذاكرة DNA العلامة التجارية الموثقة",
    "immutablePositioning": "التمركز الثابت مقفل",
    "totalCampaigns": "إجمالي الحملات",
    "currentlyActive": "نشطة حالياً",
    "factCheckRate": "معدل التحقق من الحقائق",
    "itemsUnverified": "عناصر غير محققة",
    "noItemsGenerated": "لم يتم إنشاء أي عناصر بعد",
    "endToEndPipeline": "مسار المحتوى المتكامل",
    "dnaStepTitle": "1. DNA العلامة التجارية",
    "dnaStepSub": "التمركز والادعاءات",
    "seoStepTitle": "2. ملخصات SEO",
    "seoStepSub": "مجموعات المواضيع والقصد",
    "studioStepTitle": "3. استوديو التحرير",
    "studioStepSub": "إنشاء متعدد القنوات",
    "approvalsStepTitle": "4. مكتب الموافقات",
    "approvalsStepSub": "الحوكمة والتحقق",
    "repurposeStepTitle": "5. إعادة الاستخدام",
    "repurposeStepSub": "أصل واحد إلى 5 تنسيقات",
    "recentProductionItems": "عناصر الإنتاج الحديثة وحالة الحوكمة",
    "noProductionItemsYet": "لا توجد عناصر إنتاج بعد",
    "noProductionDesc": "لم تقم بإنشاء أي مسودات أو حملات لهذه العلامة التجارية بعد. ابدأ بسحب DNA العلامة التجارية أو كتابة منشور جديد.",
    "tableContent": "المحتوى",
    "tableType": "النوع",
    "tableVerified": "محققة",
    "tableStatus": "الحالة",
    "tableView": "عرض"
  }
};

export const WorkspaceProvider = ({ children }) => {
  // Navigation & History Tracking (Synced with Browser URL Routes)
  const [activeModule, setActiveModuleState] = useState(getModuleFromLocation);
  const [navigationHistory, setNavigationHistory] = useState([]);

  const setActiveModule = (newModule) => {
    setNavigationHistory(prev => [...prev, activeModule]);
    setActiveModuleState(newModule);

    const targetPath = MODULE_TO_PATH[newModule] || '/dashboard';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ module: newModule }, '', targetPath);
    }
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prevModule = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setActiveModuleState(prevModule);
      const targetPath = MODULE_TO_PATH[prevModule] || '/dashboard';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ module: prevModule }, '', targetPath);
      }
    } else if (activeModule !== 'dashboard') {
      setActiveModuleState('dashboard');
      if (window.location.pathname !== '/dashboard') {
        window.history.pushState({ module: 'dashboard' }, '', '/dashboard');
      }
    }
  };

  // Sync state on browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const currentMod = getModuleFromLocation();
      setActiveModuleState(currentMod);
    };

    window.addEventListener('popstate', handlePopState);

    // Set clean URL on initial load if at root /
    const initialPath = MODULE_TO_PATH[activeModule] || '/dashboard';
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({ module: activeModule }, '', initialPath);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const canGoBack = navigationHistory.length > 0 || activeModule !== 'dashboard';

  // Settings Modal & Personalization Preferences State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('personalization');

  const [appearance, setAppearanceState] = useState(() => {
    try {
      return localStorage.getItem('aisa_appearance') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [accentColor, setAccentColorState] = useState(() => {
    try {
      return localStorage.getItem('aisa_accent_color') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  const [region, setRegionState] = useState(() => {
    try {
      return localStorage.getItem('aisa_region') || 'India';
    } catch (e) {
      return 'India';
    }
  });

  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('aisa_language') || 'English';
    } catch (e) {
      return 'English';
    }
  });

  const setLanguage = (val) => {
    setLanguageState(val);
    try {
      localStorage.setItem('aisa_language', val);
    } catch (e) { }

    if (val === 'Arabic') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  useEffect(() => {
    if (language === 'Arabic') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const t = (key, fallback = '') => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.English;
    return langDict[key] || TRANSLATIONS.English[key] || fallback || key;
  };

  const [multiScheduleReminder, setMultiScheduleReminderState] = useState(() => {
    try {
      return localStorage.getItem('aisa_multi_schedule_reminder') || 'Enabled';
    } catch (e) {
      return 'Enabled';
    }
  });

  // Target data for redirecting from Calendar or other modules directly into Content Studio
  const [studioTarget, setStudioTarget] = useState(null);

  // Pipeline Shared States
  const [brandDnaData, setBrandDnaData] = useState(null);
  const [seoSearchData, setSeoSearchData] = useState(null);
  const [generatedStrategy, setGeneratedStrategy] = useState(null);

  // Active Generated Content payload shared between Content Studio and Creative Studio
  const [generatedContent, setGeneratedContentState] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_last_generated_content');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const setGeneratedContent = (data) => {
    setGeneratedContentState(data);
    try {
      if (data) localStorage.setItem('aisa_last_generated_content', JSON.stringify(data));
      else localStorage.removeItem('aisa_last_generated_content');
    } catch (e) { }
  };

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailDigest: true,
    desktopPush: true,
    soundEffects: true,
    productUpdates: false,
  });

  const [dataControlPreferences, setDataControlPreferences] = useState({
    saveChatHistory: true,
    shareWorkspaceLinks: true,
    allowAnalytics: true,
  });

  const setAppearance = (val) => {
    setAppearanceState(val);
    try {
      localStorage.setItem('aisa_appearance', val);
    } catch (e) { }
  };

  const setAccentColor = (val) => {
    setAccentColorState(val);
    try {
      localStorage.setItem('aisa_accent_color', val);
    } catch (e) { }

    const palette = ACCENT_COLOR_MAP[val] || ACCENT_COLOR_MAP.purple;
    applyPaletteToCSS(palette);
  };

  const setRegion = (val) => {
    setRegionState(val);
    try {
      localStorage.setItem('aisa_region', val);
    } catch (e) { }
  };

  const setMultiScheduleReminder = (val) => {
    setMultiScheduleReminderState(val);
    try {
      localStorage.setItem('aisa_multi_schedule_reminder', val);
    } catch (e) { }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    setAppearance(nextTheme);
  };

  useEffect(() => {
    let effectiveTheme = appearance;
    if (appearance === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      effectiveTheme = prefersDark ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [appearance]);

  const ACCENT_COLOR_MAP = {
    default: {
      brand500: '#6366f1',
      brand600: '#4f46e5',
      brand400: '#818cf8',
      brand300: '#a5b4fc',
      brand100: '#e0e7ff',
      brand50: '#eef2ff',
      glow: 'rgba(99, 102, 241, 0.35)',
      from: '#4f46e5',
      to: '#6366f1',
      rgb: '99, 102, 241',
      rgb600: '79, 70, 229',
      rgb400: '129, 140, 248',
      rgb300: '165, 180, 252',
    },
    purple: {
      brand500: '#7B61FF',
      brand600: '#6B5AED',
      brand400: '#A882FF',
      brand300: '#B388FF',
      brand100: '#E8E3FF',
      brand50: '#F8F9FD',
      glow: 'rgba(123, 97, 255, 0.35)',
      from: '#6B5AED',
      to: '#7B61FF',
      rgb: '123, 97, 255',
      rgb600: '107, 90, 237',
      rgb400: '168, 130, 255',
      rgb300: '179, 136, 255',
    },
    blue: {
      brand500: '#0284c7',
      brand600: '#0369a1',
      brand400: '#38bdf8',
      brand300: '#7dd3fc',
      brand100: '#e0f2fe',
      brand50: '#f0f9ff',
      glow: 'rgba(2, 132, 199, 0.35)',
      from: '#0369a1',
      to: '#0284c7',
      rgb: '2, 132, 199',
      rgb600: '3, 105, 161',
      rgb400: '56, 189, 248',
      rgb300: '125, 211, 252',
    },
    emerald: {
      brand500: '#10b981',
      brand600: '#059669',
      brand400: '#34d399',
      brand300: '#6ee7b7',
      brand100: '#d1fae5',
      brand50: '#ecfdf5',
      glow: 'rgba(16, 185, 129, 0.35)',
      from: '#059669',
      to: '#10b981',
      rgb: '16, 185, 129',
      rgb600: '5, 150, 105',
      rgb400: '52, 211, 153',
      rgb300: '110, 231, 183',
    },
    amber: {
      brand500: '#f59e0b',
      brand600: '#d97706',
      brand400: '#fbbf24',
      brand300: '#fcd34d',
      brand100: '#fef3c7',
      brand50: '#fffbeb',
      glow: 'rgba(245, 158, 11, 0.35)',
      from: '#d97706',
      to: '#f59e0b',
      rgb: '245, 158, 11',
      rgb600: '217, 119, 6',
      rgb400: '251, 191, 36',
      rgb300: '252, 211, 77',
    },
    rose: {
      brand500: '#f43f5e',
      brand600: '#e11d48',
      brand400: '#fb7185',
      brand300: '#fca5a5',
      brand100: '#ffe4e6',
      brand50: '#fff1f2',
      glow: 'rgba(244, 63, 94, 0.35)',
      from: '#e11d48',
      to: '#f43f5e',
      rgb: '244, 63, 94',
      rgb600: '225, 29, 72',
      rgb400: '251, 113, 133',
      rgb300: '252, 165, 165',
    },
  };

  const applyPaletteToCSS = (palette) => {
    if (!palette || typeof document === 'undefined') return;
    const root = document.documentElement;
    root.style.setProperty('--brand-500', palette.brand500);
    root.style.setProperty('--brand-600', palette.brand600);
    root.style.setProperty('--brand-400', palette.brand400);
    root.style.setProperty('--brand-300', palette.brand300);
    root.style.setProperty('--brand-100', palette.brand100);
    root.style.setProperty('--brand-50', palette.brand50);
    root.style.setProperty('--brand-glow', palette.glow);
    root.style.setProperty('--brand-from', palette.from);
    root.style.setProperty('--brand-to', palette.to);
    root.style.setProperty('--brand-500-rgb', palette.rgb);
    root.style.setProperty('--brand-600-rgb', palette.rgb600 || palette.rgb);
    root.style.setProperty('--brand-400-rgb', palette.rgb400 || palette.rgb);
    root.style.setProperty('--brand-300-rgb', palette.rgb300 || palette.rgb);
  };

  useEffect(() => {
    const palette = ACCENT_COLOR_MAP[accentColor] || ACCENT_COLOR_MAP.purple;
    applyPaletteToCSS(palette);
  }, [accentColor]);

  // Theme & Role
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_theme');
      return saved || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [user, setUserState] = useState(() => {
    try {
      const savedName = localStorage.getItem('aisa_user_name');
      const saved = localStorage.getItem('aisa_user');
      const savedEmail = localStorage.getItem('aisa_user_email');
      let u = { email: 'admin@aiads.io', name: 'Admin', role: 'AgencyAdmin' };
      if (saved) u = JSON.parse(saved);
      else if (savedEmail) u = { email: savedEmail, name: savedEmail.split('@')[0], role: 'AgencyAdmin' };
      if (savedName) u.name = savedName;
      return u;
    } catch (e) {
      return { email: 'admin@aiads.io', name: 'Admin', role: 'AgencyAdmin' };
    }
  });

  const setUser = (update) => {
    setUserState(prev => {
      const updated = typeof update === 'function' ? update(prev) : update;
      if (updated) {
        try {
          if (updated.name) localStorage.setItem('aisa_user_name', updated.name);
          localStorage.setItem('aisa_user', JSON.stringify(updated));
        } catch (e) { }
      }
      return updated;
    });
  };

  const [activeRole, setActiveRole] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_user');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role || 'AgencyAdmin';
      }
    } catch (e) { }
    return 'AgencyAdmin';
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('aisa_user', JSON.stringify(userData));
    if (userData.role) {
      setActiveRole(userData.role);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aisa_user');
    setIsSettingsModalOpen(false);
    setActiveModuleState('dashboard');
  };


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  // Workspace & Brand DNA Memory
  // Workspace & Brand DNA Memory - Persistent User State
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem('aisa_workspaces');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }
    return [];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    try {
      return localStorage.getItem('aisa_active_ws_id') || '';
    } catch (e) {
      return '';
    }
  });

  // Keep localStorage synced whenever workspaces state changes
  useEffect(() => {
    try {
      localStorage.setItem('aisa_workspaces', JSON.stringify(workspaces));
    } catch (e) { }
  }, [workspaces]);

  useEffect(() => {
    try {
      if (activeWorkspaceId) {
        localStorage.setItem('aisa_active_ws_id', activeWorkspaceId);
      }
    } catch (e) { }
  }, [activeWorkspaceId]);

  // Sync workspaces from MongoDB Atlas Database on Page Load / Refresh / User Login
  useEffect(() => {
    const fetchWorkspacesFromDb = async () => {
      try {
        const email = user?.email || localStorage.getItem('aisa_user_email') || '';
        const url = email
          ? `http://localhost:5000/api/workspace/list?userEmail=${encodeURIComponent(email)}`
          : 'http://localhost:5000/api/workspace/list';

        const res = await fetch(url, {
          headers: email ? { 'x-user-email': email } : {}
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.workspaces)) {
          if (data.workspaces.length > 0) {
            const formatted = data.workspaces.map(w => ({
              ...w,
              id: w._id || w.id,
              brandVoiceTone: w.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
              voiceGuidelines: w.voiceGuidelines || { formalityScore: 4, toneKeywords: w.brandVoiceTone?.toneKeywords || ['Professional', 'Innovative'] }
            }));
            setWorkspaces(formatted);
            setActiveWorkspaceId(prevId => {
              const exists = formatted.some(item => (item.id === prevId || item._id === prevId));
              return exists ? prevId : (formatted[0].id || formatted[0]._id);
            });
          } else {
            // DB is empty for this user account (user has created no brands yet)
            setWorkspaces([]);
            setActiveWorkspaceId('');
            try {
              localStorage.removeItem('aisa_workspaces');
              localStorage.removeItem('aisa_active_ws_id');
            } catch (e) { }
          }
        }
      } catch (err) {
        console.log('Workspace DB Fetch Note:', err.message);
      }
    };

    fetchWorkspacesFromDb();
  }, [user]);



  // Credits & Subscriptions
  const [credits, setCredits] = useState({
    tier: 'Agency',
    balance: 120,
    history: [
      { id: 'tx_001', type: 'MONTHLY_ALLOCATION', credits: 150, timestamp: '2026-07-01T00:00:00Z', note: 'Agency Plan Monthly Renewal' },
      { id: 'tx_002', type: 'DEDUCTION', credits: -10, timestamp: '2026-07-15T10:30:00Z', note: 'AI Carousel Visual Generation' }
    ]
  });

  const [approvalsQueue, setApprovalsQueue] = useState([
    {
      id: 'cnt_101',
      workspaceId: 'ws_001',
      title: 'How AI Ads Transforms Agency Content Production Velocity',
      type: 'BLOG',
      platform: 'Website Blog',
      status: 'APPROVED',
      wordCount: 2150,
      author: 'Senior Copywriter',
      approver: 'Client Marketing Director',
      factCheck: { passed: true, score: 100, status: 'VERIFIED', flags: [] },
      checks: {
        brandDna: { passed: true, score: 98, message: 'Strong alignment with brand voice.' },
        seo: { passed: true, score: 92, message: 'Keywords optimized correctly.' },
        strategy: { passed: true, score: 95, message: 'Matches Q3 campaign goals.' },
        fact: { passed: true, score: 100, message: 'All claims verified.' }
      },
      content: `# How AI Ads Transforms Agency Content Production Velocity\n\nIn today's fast-paced digital ecosystem, agencies are under immense pressure to deliver high-quality content at unprecedented speeds. Enter AI Ads, a game-changing platform designed to supercharge your content production workflow...\n\nBy leveraging advanced machine learning algorithms, AI Ads not only automates repetitive tasks but also ensures that every piece of content remains perfectly aligned with your unique Brand DNA.`,
      history: [
        { id: 'h1', action: 'Submitted for Review', by: 'Senior Copywriter', date: '2026-07-22T09:00:00Z' },
        { id: 'h2', action: 'Approved', by: 'Client Marketing Director', date: '2026-07-22T10:00:00Z', note: 'Looks great, ready to publish.' }
      ],
      createdAt: '2026-07-22T10:00:00Z',
      scheduledDate: '2026-07-28'
    },
    {
      id: 'cnt_102',
      workspaceId: 'ws_001',
      title: '5 Steps to Build Bulletproof Brand DNA in 2026',
      type: 'SOCIAL',
      platform: 'LinkedIn',
      status: 'PENDING',
      author: 'Brand Strategist',
      factCheck: { passed: true, score: 95, status: 'VERIFIED', flags: [] },
      checks: {
        brandDna: { passed: true, score: 95, message: 'Tone is professional and engaging.' },
        seo: { passed: true, score: 88, message: 'Good use of hashtags.' },
        strategy: { passed: false, score: 70, message: 'Missing CTA for the upcoming webinar.' },
        fact: { passed: true, score: 100, message: 'No factual claims made.' }
      },
      content: `Is your Brand DNA ready for the challenges of 2026? 🚀\n\nBuilding a bulletproof brand identity requires more than just a logo and a color palette. It demands a deep understanding of your core values, your target audience's evolving needs, and a consistent voice across all channels.\n\nHere are 5 actionable steps you can take today to fortify your brand's foundation:\n1. Revisit your core mission statement...\n\nSwipe through our latest carousel to learn more!`,
      history: [
        { id: 'h1', action: 'Submitted for Review', by: 'Brand Strategist', date: '2026-07-24T14:30:00Z' }
      ],
      createdAt: '2026-07-24T14:30:00Z',
      scheduledDate: '2026-07-29'
    },
    {
      id: 'cnt_103',
      workspaceId: 'ws_001',
      title: 'Unlocking 400% ROI With Multi-Tenant Campaign Operations',
      type: 'BLOG',
      platform: 'Medium',
      status: 'RED_FLAG_CITATION_NEEDED',
      wordCount: 1800,
      author: 'Gemini 3.5 Editorial Engine',
      factCheck: {
        passed: false,
        score: 60,
        status: 'RED_FLAG_CITATION_NEEDED',
        flags: [{ type: 'UNSUPPORTED_STATISTIC', severity: 'HIGH', message: 'Unverified statistical claim found: "400% ROI". Requires verified source citation.' }]
      },
      checks: {
        brandDna: { passed: true, score: 90, message: 'Tone is authoritative.' },
        seo: { passed: true, score: 96, message: 'Excellent keyword density.' },
        strategy: { passed: true, score: 94, message: 'Matches ROI focus.' },
        fact: { passed: false, score: 60, message: 'Unverified statistic: "400% ROI".' }
      },
      content: `# Unlocking 400% ROI With Multi-Tenant Campaign Operations\n\nManaging multiple client campaigns simultaneously has traditionally been a logistical nightmare for large-scale agencies. However, recent data suggests that adopting a multi-tenant operational model can increase your overall return on investment by a staggering 400%.\n\nThis article explores the architectural shifts required to achieve such unprecedented growth, focusing on unified dashboards, centralized asset management, and AI-driven automation.`,
      history: [
        { id: 'h1', action: 'Generated via AI', by: 'Gemini 3.5', date: '2026-07-25T08:00:00Z' },
        { id: 'h2', action: 'Requested Revision', by: 'Agency Admin', date: '2026-07-25T09:15:00Z', note: 'We need to cite the source for the 400% ROI claim before publishing.' }
      ],
      createdAt: '2026-07-25T09:15:00Z',
      scheduledDate: '2026-08-05'
    }
  ]);

  // Calendar State
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [isQuickPostOpen, setIsQuickPostOpen] = useState(false);
  const [isScraperOpen, setIsScraperOpen] = useState(false);
  const [scraperMode, setScraperMode] = useState('NEW_BRAND'); // 'ACTIVE_BRAND' or 'NEW_BRAND'
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [isAISAAssistantOpen, setIsAISAAssistantOpen] = useState(false);

  const openScraperModal = (mode = 'NEW_BRAND') => {
    setScraperMode(mode);
    setIsScraperOpen(true);
  };

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Brand DNA synced for UWO AI Ads', time: '10m ago', unread: true },
    { id: 2, text: 'Blog draft flagged: Citation Needed', time: '1h ago', unread: true }
  ]);
  const [userAvatar, setUserAvatarState] = useState(() => {
    try {
      const savedAvatar = localStorage.getItem('aisa_user_avatar');
      if (savedAvatar) return savedAvatar;
      const savedUser = localStorage.getItem('aisa_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.avatar) return parsed.avatar;
      }
    } catch (e) { }
    return null;
  });

  const setUserAvatar = (avatarData) => {
    setUserAvatarState(avatarData);
    try {
      if (avatarData) {
        localStorage.setItem('aisa_user_avatar', avatarData);
        setUser(prev => {
          const updated = prev ? { ...prev, avatar: avatarData } : { avatar: avatarData };
          try { localStorage.setItem('aisa_user', JSON.stringify(updated)); } catch (e) { }
          return updated;
        });
      } else {
        localStorage.removeItem('aisa_user_avatar');
        setUser(prev => {
          if (!prev) return prev;
          const { avatar, ...rest } = prev;
          try { localStorage.setItem('aisa_user', JSON.stringify(rest)); } catch (e) { }
          return rest;
        });
      }
    } catch (e) {
      console.error("Error saving user avatar to localStorage:", e);
    }
  };

  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId || w._id === activeWorkspaceId) || workspaces[0] || {
    id: 'ws_empty',
    brandName: 'No Brand Loaded',
    domainUrl: 'https://',
    logoUrl: '',
    brandColors: ['#6366F1', '#8B5CF6'],
    targetAudience: [],
    brandVoiceTone: { formalityScore: 3, toneKeywords: [] },
    competitorLandscape: [],
    contentPillars: [],
    socialMediaPresence: [],
    contactInfo: { email: '', phone: '', location: '' },
    industryCategory: 'General',
    missionStatement: '',
    tagline: '',
    approvedClaims: [],
    restrictedClaims: []
  };

  const addWorkspace = async (newWs) => {
    try {
      const email = user?.email || localStorage.getItem('aisa_user_email') || '';
      const payload = { ...newWs, userEmail: email };

      // Persist workspace to MongoDB Atlas ONLY when user clicks "Save & Lock Brand DNA Memory"
      const res = await fetch('http://localhost:5000/api/workspace/save-dna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': email
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        const savedDoc = {
          ...data.workspace,
          id: data.workspace._id || data.workspace.id || `ws_${Date.now()}`,
          brandVoiceTone: data.workspace.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
          voiceGuidelines: data.workspace.voiceGuidelines || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative'] }
        };
        setWorkspaces(prev => {
          const exists = prev.some(w => (w.id === savedDoc.id || w._id === savedDoc.id));
          if (exists) return prev.map(w => (w.id === savedDoc.id || w._id === savedDoc.id) ? savedDoc : w);
          return [savedDoc, ...prev];
        });
        setActiveWorkspaceId(savedDoc.id);
        return savedDoc;
      }
    } catch (e) {
      console.log('Workspace Save DNA Error:', e.message);
    }

    // Local Fallback if offline
    const formatted = {
      ...newWs,
      id: newWs._id || newWs.id || `ws_${Date.now()}`,
      brandVoiceTone: newWs.brandVoiceTone || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative', 'Reliable'] },
      voiceGuidelines: newWs.voiceGuidelines || { formalityScore: 4, toneKeywords: ['Professional', 'Innovative'] }
    };
    setWorkspaces(prev => {
      const exists = prev.some(w => (w.id === formatted.id || w._id === formatted.id));
      if (exists) return prev;
      return [formatted, ...prev];
    });
    setActiveWorkspaceId(formatted.id);
    return formatted;
  };


  const updateWorkspace = async (id, updatedData) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/workspace/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      if (data.success && data.workspace) {
        const updatedDoc = { ...data.workspace, id: data.workspace._id || data.workspace.id || id };
        setWorkspaces(prev => prev.map(w => (w.id === id || w._id === id) ? updatedDoc : w));
        return;
      }
    } catch (e) {
      console.log('Workspace Update Note:', e.message);
    }
    setWorkspaces(prev => prev.map(w => (w.id === id || w._id === id) ? { ...w, ...updatedData } : w));
  };



  const deleteWorkspace = async (idToDelete) => {
    if (!idToDelete) return;
    try {
      await fetch(`http://localhost:5000/api/workspace/${idToDelete}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Workspace Delete Note:', e.message);
    }
    const updated = workspaces.filter(w => w.id !== idToDelete && w._id !== idToDelete);
    setWorkspaces(updated);
    if (activeWorkspaceId === idToDelete || activeWorkspace?._id === idToDelete) {
      if (updated.length > 0) {
        setActiveWorkspaceId(updated[0].id || updated[0]._id);
      }
    }
  };


  const deductVisualCredits = (cost = 5, reason = 'AI Visual Synthesis') => {
    if (credits.balance < cost) {
      alert(`Insufficient visual credits. Current balance: ${credits.balance}, required: ${cost}. Please top up.`);
      return false;
    }
    setCredits(prev => ({
      ...prev,
      balance: prev.balance - cost,
      history: [{ id: `tx_${Date.now()}`, type: 'DEDUCTION', credits: -cost, timestamp: new Date().toISOString(), note: reason }, ...prev.history]
    }));
    return true;
  };

  const topUpCredits = (amount = 50, packName = '50 Credit Pack') => {
    setCredits(prev => ({
      ...prev,
      balance: prev.balance + amount,
      history: [{ id: `tx_${Date.now()}`, type: 'PURCHASE', credits: amount, timestamp: new Date().toISOString(), note: `Razorpay: ${packName}` }, ...prev.history]
    }));
  };

  const updateApprovalStatus = (id, newStatus, comment = '') => {
    setApprovalsQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus, reviewerComment: comment } : item));
  };

  const addCalendarEvent = (event) => {
    setCalendarEvents(prev => [{ id: `cal_${Date.now()}_${Math.random()}`, ...event }, ...prev]);
  };

  const bulkAddCalendarEvents = (events) => {
    const newEvents = events.map((event, i) => ({
      id: `cal_${Date.now()}_${i}_${Math.random()}`,
      ...event
    }));
    setCalendarEvents(prev => [...newEvents, ...prev]);
  };

  // ─── Global Asset Management ────────────────────────────────────────────────
  const [globalAssets, setGlobalAssets] = useState(() => {
    try {
      const saved = localStorage.getItem(`aisa_assets_${activeWorkspaceId}`) || localStorage.getItem('aisa_global_assets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!activeWorkspaceId) return;
    try {
      const saved = localStorage.getItem(`aisa_assets_${activeWorkspaceId}`);
      if (saved) {
        setGlobalAssets(JSON.parse(saved));
      } else {
        const fallback = localStorage.getItem('aisa_global_assets');
        setGlobalAssets(fallback ? JSON.parse(fallback) : []);
      }
    } catch {
      setGlobalAssets([]);
    }
  }, [activeWorkspaceId]);

  const addGlobalAsset = (asset) => {
    const newAsset = {
      id: asset.id || `asset_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: asset.name || asset.title || 'Brand Asset',
      type: (asset.type || 'DOCUMENT').toUpperCase(), // 'IMAGE' | 'CAROUSEL' | 'DOCUMENT'
      url: asset.url || '',
      date: asset.date || new Date().toISOString(),
      credits: asset.credits || 0,
      workspaceId: asset.workspaceId || activeWorkspaceId,
      content: asset.content || asset.caption || '',
      metadata: asset.metadata || {},
      category: asset.category || asset.type || 'DOCUMENT'
    };

    // Dispatch backend API request to persist asset & record API hit
    try {
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/content/save-asset' : '/api/content/save-asset';
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAsset)
      }).catch(() => {});
    } catch (e) {}

    setGlobalAssets(prev => {
      const updated = [newAsset, ...prev];
      try {
        if (activeWorkspaceId) localStorage.setItem(`aisa_assets_${activeWorkspaceId}`, JSON.stringify(updated));
        localStorage.setItem('aisa_global_assets', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    return newAsset;
  };

  const removeGlobalAsset = (id) => {
    setGlobalAssets(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        if (activeWorkspaceId) localStorage.setItem(`aisa_assets_${activeWorkspaceId}`, JSON.stringify(updated));
        localStorage.setItem('aisa_global_assets', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <WorkspaceContext.Provider value={{
      activeModule, setActiveModule, goBack, canGoBack, navigationHistory,
      theme, toggleTheme,
      user, setUser, loginUser, logout,
      activeRole, setActiveRole,
      workspaces, activeWorkspaceId, setActiveWorkspaceId, activeWorkspace, addWorkspace, updateWorkspace, deleteWorkspace,

      credits, deductVisualCredits, topUpCredits,
      approvalsQueue, setApprovalsQueue, updateApprovalStatus,
      calendarEvents, setCalendarEvents, addCalendarEvent, bulkAddCalendarEvents,
      globalAssets, setGlobalAssets, addGlobalAsset, removeGlobalAsset,
      isQuickPostOpen, setIsQuickPostOpen,
      isScraperOpen, setIsScraperOpen, scraperMode, setScraperMode, openScraperModal,

      isCreditModalOpen, setIsCreditModalOpen,
      isAISAAssistantOpen, setIsAISAAssistantOpen,
      notifications, setNotifications,
      userAvatar, setUserAvatar,

      // New Account Settings Modal & Personalization
      isSettingsModalOpen, setIsSettingsModalOpen,
      activeSettingsTab, setActiveSettingsTab,
      appearance, setAppearance,
      accentColor, setAccentColor,
      region, setRegion,
      language, setLanguage, t,
      multiScheduleReminder, setMultiScheduleReminder,
      notificationPreferences, setNotificationPreferences,
      dataControlPreferences, setDataControlPreferences,
      studioTarget, setStudioTarget,
      generatedContent, setGeneratedContent,

      // End-to-End Pipeline State & Actions
      brandDnaData, setBrandDnaData,
      seoSearchData, setSeoSearchData,
      generatedStrategy, setGeneratedStrategy,
      sendContentToApprovals: (payload) => {
        const newItem = {
          id: `cnt_${Date.now()}`,
          workspaceId: activeWorkspaceId || 'ws_001',
          title: payload.topic || payload.title || payload.subject || payload.headline || 'Generated Marketing Post',
          type: (payload.type || payload.postType || 'SOCIAL').toUpperCase(),
          platform: payload.platform || 'instagram',
          status: 'PENDING',
          author: 'Content Studio AI',
          content: payload.caption || payload.longCaption || payload.body || payload.leadParagraph || '',
          payload: payload,
          createdAt: new Date().toISOString(),
          scheduledDate: payload.scheduledDate || new Date().toISOString().split('T')[0],
          checks: {
            brandDna: { passed: true, score: 98, message: 'Aligned with Brand DNA.' },
            seo: { passed: true, score: 95, message: 'Optimized keywords.' },
            strategy: { passed: true, score: 96, message: 'Campaign goal matched.' },
            fact: { passed: true, score: 100, message: 'No citations needed.' }
          }
        };
        setApprovalsQueue(prev => [newItem, ...prev]);
        setActiveModule('approvals');
      },
      approveAndSendToCreative: (item) => {
        const updatedQueue = approvalsQueue.map(i =>
          (i.id === item.id || i._id === item._id) ? { ...i, status: 'APPROVED' } : i
        );
        setApprovalsQueue(updatedQueue);

        const contentPayload = item.payload || {
          topic: item.title,
          type: item.type,
          platform: item.platform,
          hook: item.title,
          caption: item.content,
          shortCaption: item.content?.slice(0, 100),
          longCaption: item.content,
          cta: 'Click link to learn more!',
          hashtags: ['#AIMarketing', '#BrandDNA', '#Growth']
        };

        setGeneratedContent(contentPayload);
        setStudioTarget(contentPayload);
        setActiveModule('creative');
      }
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
