import { getBrandLogoUrl } from './brandLogoHelper';

/**
 * Triggers a file download directly to the user's device.
 * Burns brand logo and brand name watermark badge onto canvas prior to downloading.
 */
export const downloadImageToDevice = async (imageUrl, defaultFilename = 'ai_ads_visual.jpg', brandOptions = {}) => {
  if (!imageUrl) return false;

  // Extract brand details or fallback from localStorage if available
  let brandName = brandOptions.brandName || brandOptions.brand;
  let domainUrl = brandOptions.domainUrl || brandOptions.domain;
  let logoUrl = brandOptions.logoUrl || brandOptions.faviconUrl;

  if (!brandName) {
    try {
      const activeWsId = localStorage.getItem('aisa_active_ws_id');
      const wsListStr = localStorage.getItem('aisa_workspaces');
      if (wsListStr) {
        const wsList = JSON.parse(wsListStr);
        const activeWs = wsList.find(w => w.id === activeWsId || w._id === activeWsId) || wsList[0];
        if (activeWs) {
          brandName = activeWs.brandName;
          domainUrl = domainUrl || activeWs.domainUrl;
          logoUrl = logoUrl || activeWs.logoUrl || activeWs.faviconUrl;
        }
      }
    } catch (e) {}
  }
  brandName = brandName || 'Brand';
  logoUrl = getBrandLogoUrl({ brandName, domainUrl, logoUrl });

  // Sanitize filename to ASCII for clean file system & header compliance
  const fileName = (defaultFilename || 'ai_ads_visual.jpg')
    .replace(/[^\x20-\x7E]/g, '') // remove non-ASCII characters like ™, ®, ©
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-\.]/g, '') || `ai_ads_visual_${Date.now()}.jpg`;

  /**
   * Internal Helper: Renders base image onto canvas with glassmorphic brand logo overlay badge
   */
  const renderWatermarkedCanvasDataUrl = async (imgSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const w = img.naturalWidth || img.width || 1080;
          const h = img.naturalHeight || img.height || 1080;
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // Calculate proportional dimensions based on canvas resolution
          const scale = Math.max(w, h) / 1080;
          const paddingX = Math.round(20 * scale);
          const badgeH = Math.round(44 * scale);
          const avatarRadius = Math.round(15 * scale);
          const fontSize = Math.round(15 * scale);

          ctx.save();
          ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
          const textMetrics = ctx.measureText(brandName.toUpperCase());
          const badgeW = Math.round(paddingX * 2 + avatarRadius * 2 + 10 * scale + textMetrics.width);

          const badgeX = Math.round(32 * scale);
          const badgeY = Math.round(32 * scale);

          // Draw glassmorphic dark badge background
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(badgeX, badgeY, badgeW, badgeH, Math.round(badgeH / 2));
          } else {
            ctx.rect(badgeX, badgeY, badgeW, badgeH);
          }
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fill();
          ctx.lineWidth = Math.max(1, 1.5 * scale);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();

          // Try drawing brand logo image
          let logoLoaded = false;
          if (logoUrl) {
            try {
              const logoImg = new Image();
              logoImg.crossOrigin = 'anonymous';
              logoLoaded = await new Promise((resLogo) => {
                logoImg.onload = () => resLogo(true);
                logoImg.onerror = () => resLogo(false);
                logoImg.src = logoUrl;
              });

              if (logoLoaded) {
                ctx.save();
                const avatarCenterX = badgeX + paddingX + avatarRadius;
                const avatarCenterY = badgeY + badgeH / 2;
                ctx.beginPath();
                ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(
                  logoImg,
                  avatarCenterX - avatarRadius,
                  avatarCenterY - avatarRadius,
                  avatarRadius * 2,
                  avatarRadius * 2
                );
                ctx.restore();
              }
            } catch (e) {
              logoLoaded = false;
            }
          }

          // Fallback avatar circle with brand initials if logo URL is missing or failed to load
          if (!logoLoaded) {
            const avatarCenterX = badgeX + paddingX + avatarRadius;
            const avatarCenterY = badgeY + badgeH / 2;
            ctx.beginPath();
            ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#6366F1'; // Brand Indigo
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `900 ${Math.round(13 * scale)}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const initials = brandName.substring(0, 2).toUpperCase();
            ctx.fillText(initials, avatarCenterX, avatarCenterY);
          }

          // Draw Brand Name Text
          const textX = badgeX + paddingX + avatarRadius * 2 + Math.round(10 * scale);
          const textY = badgeY + badgeH / 2;
          ctx.fillStyle = '#FFFFFF';
          ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(brandName.toUpperCase(), textX, textY);

          ctx.restore();

          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } catch (err) {
          console.warn('Watermark canvas generation failed:', err);
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = imgSrc;
    });
  };

  const triggerDownloadFromUrl = (urlToDownload) => {
    const link = document.createElement('a');
    link.href = urlToDownload;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Strategy 1: Data URL (Base64 or SVG Data URL) -> Watermark on Canvas
  if (imageUrl.startsWith('data:')) {
    try {
      const watermarked = await renderWatermarkedCanvasDataUrl(imageUrl);
      if (watermarked) {
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      triggerDownloadFromUrl(imageUrl);
      return true;
    } catch (e) {
      console.warn('Data URL watermark download error:', e);
    }
  }

  // Strategy 2: Direct Fetch Blob + Watermark Canvas
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    if (res.ok) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const watermarked = await renderWatermarkedCanvasDataUrl(blobUrl);
      URL.revokeObjectURL(blobUrl);

      if (watermarked) {
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      const directBlobUrl = URL.createObjectURL(blob);
      triggerDownloadFromUrl(directBlobUrl);
      setTimeout(() => URL.revokeObjectURL(directBlobUrl), 1000);
      return true;
    }
  } catch (e) {
    console.log('Direct fetch blocked by CORS, trying Canvas/Proxy fallback...');
  }

  // Strategy 3: Canvas In-Memory Export with Watermark
  try {
    const watermarked = await renderWatermarkedCanvasDataUrl(imageUrl);
    if (watermarked) {
      triggerDownloadFromUrl(watermarked);
      return true;
    }
  } catch (e) {
    console.log('Canvas export failed, using backend proxy download...');
  }

  // Strategy 4: Backend Proxy Route Fetch -> Convert Blob to Watermarked Canvas
  try {
    const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
    const proxyUrl = `${apiBase}/download-image?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(fileName)}`;

    const response = await fetch(proxyUrl);
    if (response.ok) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const watermarked = await renderWatermarkedCanvasDataUrl(blobUrl);

      if (watermarked) {
        URL.revokeObjectURL(blobUrl);
        triggerDownloadFromUrl(watermarked);
        return true;
      }
      triggerDownloadFromUrl(blobUrl);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      return true;
    }
  } catch (e) {
    console.error('All download methods failed:', e);
  }

  return false;
};
