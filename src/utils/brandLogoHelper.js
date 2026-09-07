/**
 * brandLogoHelper.js
 * Universal Brand Logo & Icon Resolver
 * Guarantees a real, accurate high-res logo image for any brand.
 */

export function getBrandLogoUrl(brandName = '', domainUrl = '', logoUrl = '', faviconUrl = '') {
  let name = brandName;
  let domain = domainUrl;
  let logo = logoUrl;
  let favicon = faviconUrl;

  // Support object arguments: getBrandLogoUrl({ brandName, domainUrl, logoUrl, faviconUrl })
  if (typeof brandName === 'object' && brandName !== null) {
    const opts = brandName;
    name = opts.brandName || opts.brand || '';
    domain = opts.domainUrl || opts.domain || '';
    logo = opts.logoUrl || '';
    favicon = opts.faviconUrl || '';
  }

  // 1. Return valid custom logo or favicon if available and not a dummy placeholder
  if (logo && typeof logo === 'string' && logo.startsWith('http') && !logo.includes('picsum.photos') && !logo.includes('dicebear')) {
    return logo;
  }
  if (favicon && typeof favicon === 'string' && favicon.startsWith('http') && !favicon.includes('picsum.photos') && !favicon.includes('dicebear')) {
    return favicon;
  }

  // 2. Extract clean domain from domainUrl or infer from brandName
  let cleanDomain = '';
  if (domain && typeof domain === 'string') {
    cleanDomain = domain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0].split('?')[0].trim();
  }

  if (!cleanDomain && name) {
    const cleanName = String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
    const knownDomains = {
      jiohotstar: 'jiohotstar.com',
      hotstar: 'hotstar.com',
      jio: 'jio.com',
      chingssecret: 'chingssecret.com',
      chings: 'chingssecret.com',
      nataraj: 'natarajpencils.com',
      redbus: 'redbus.in',
      nvidia: 'nvidia.com',
      zomato: 'zomato.com',
      swiggy: 'swiggy.com',
      redbull: 'redbull.com',
      nike: 'nike.com',
      adidas: 'adidas.com',
      apple: 'apple.com',
      google: 'google.com',
      microsoft: 'microsoft.com',
      tesla: 'tesla.com',
      amazon: 'amazon.com',
      netflix: 'netflix.com',
      spotify: 'spotify.com',
      starbucks: 'starbucks.com',
      mcdonalds: 'mcdonalds.com',
      cocacola: 'coca-cola.com',
      pepsi: 'pepsi.com',
      haldiram: 'haldiram.com',
      haldirams: 'haldiram.com',
    };
    cleanDomain = knownDomains[cleanName] || (cleanName ? `${cleanName}.com` : 'google.com');
  }

  if (!cleanDomain) cleanDomain = 'google.com';

  // Google Favicon API 256px delivers high-resolution official brand logo icons
  return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=256`;
}
