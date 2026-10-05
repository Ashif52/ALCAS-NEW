/**
 * ALCAS Dynamic Content Loader
 * Fetches projects, logos, and testimonials from the admin backend asynchronously.
 * Falls back to local data if the API takes too long (>1000ms) or fails.
 */
(function () {
    const TIMEOUT_MS = 1000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Try fetching from the relative URL (proxied by Next.js dev server/production origin)
    fetch('/api/content', { signal: controller.signal })
        .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (data.projects) window.__ALCAS_PROJECTS = data.projects;
            if (data.logos) window.__ALCAS_LOGOS = data.logos;
            if (data.testimonials) window.__ALCAS_TESTIMONIALS = data.testimonials;
            window.__ALCAS_LOADED = true;
            console.log('[ALCAS] Dynamic content loaded ✓ (' +
                (data.projects ? data.projects.length : 0) + ' projects, ' +
                (data.logos ? data.logos.length : 0) + ' logos, ' +
                (data.testimonials ? data.testimonials.length : 0) + ' testimonials)');

            // Dispatch custom event to notify page scripts that data is ready
            const event = new CustomEvent('alcas-content-loaded', { detail: data });
            window.dispatchEvent(event);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            console.warn('[ALCAS] Async fetch failed or timed out. Using fallback inline data.', error);
            window.__ALCAS_LOADED = false;
            // Dispatch event with null detail to trigger initialization with fallbacks
            const event = new CustomEvent('alcas-content-loaded', { detail: null });
            window.dispatchEvent(event);
        });
})();
