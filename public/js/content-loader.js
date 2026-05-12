/**
 * ALCAS Dynamic Content Loader
 * Fetches projects, logos, and testimonials from the admin backend.
 * Uses synchronous XHR so data is available before DOMContentLoaded fires.
 */
(function () {
    // Try synchronous XHR first (works on same-origin)
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/content', false); // synchronous
        xhr.send();

        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            if (data.projects) window.__ALCAS_PROJECTS = data.projects;
            if (data.logos) window.__ALCAS_LOGOS = data.logos;
            if (data.testimonials) window.__ALCAS_TESTIMONIALS = data.testimonials;
            window.__ALCAS_LOADED = true;
            console.log('[ALCAS] Dynamic content loaded ✓ (' + 
                (data.projects ? data.projects.length : 0) + ' projects, ' +
                (data.logos ? data.logos.length : 0) + ' logos, ' +
                (data.testimonials ? data.testimonials.length : 0) + ' testimonials)');
            return; // Success, exit early
        }
    } catch (e) {
        console.warn('[ALCAS] Sync XHR failed, trying fallback...', e);
    }

    // Fallback: try fetching from admin server directly (cross-origin)
    try {
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', 'http://localhost:4000/api/content', false);
        xhr2.send();

        if (xhr2.status === 200) {
            var data = JSON.parse(xhr2.responseText);
            if (data.projects) window.__ALCAS_PROJECTS = data.projects;
            if (data.logos) window.__ALCAS_LOGOS = data.logos;
            if (data.testimonials) window.__ALCAS_TESTIMONIALS = data.testimonials;
            window.__ALCAS_LOADED = true;
            window.__ALCAS_PUBLIC_BASE = 'http://localhost:4000/public';
            console.log('[ALCAS] Dynamic content loaded via direct admin URL ✓');
            return;
        }
    } catch (e2) {
        console.warn('[ALCAS] Direct admin fetch also failed:', e2);
    }

    console.log('[ALCAS] Using fallback inline data');
    window.__ALCAS_LOADED = false;
})();
