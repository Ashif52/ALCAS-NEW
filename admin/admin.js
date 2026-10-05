// ── Auth & API Config ──
const API = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000/api'
    : '/api';
const PUBLIC = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:4000/public'
    : '/public';

let allData = { projects: [], logos: [], testimonials: [], videos: [] };

function getToken() { return sessionStorage.getItem('alcas_admin_token'); }
function setToken(t) { sessionStorage.setItem('alcas_admin_token', t); }
function clearToken() { sessionStorage.removeItem('alcas_admin_token'); }
function authHeaders() {
    const token = getToken();
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
}
function authHeadersMultipart() {
    const token = getToken();
    const h = {};
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
}

// ── Login / Logout ──
async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('loginError');
    const password = document.getElementById('loginPassword').value;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';
    errEl.textContent = '';
    try {
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await res.json();
        if (!res.ok || !data.token) {
            errEl.textContent = data.error || 'Invalid password';
            btn.disabled = false;
            btn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
            return;
        }
        setToken(data.token);
        document.getElementById('loginOverlay').classList.add('hidden');
        loadAllData();
    } catch {
        errEl.textContent = 'Connection failed. Is the server running?';
        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
    }
}

async function handleLogout() {
    try {
        await fetch(`${API}/auth/logout`, {
            method: 'POST', headers: authHeaders()
        });
    } catch { /* ignore */ }
    clearToken();
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
    // Check if we have a valid session
    const token = getToken();
    if (token) {
        try {
            const res = await fetch(`${API}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.authenticated) {
                document.getElementById('loginOverlay').classList.add('hidden');
            } else {
                clearToken();
            }
        } catch {
            clearToken();
        }
    }
    setupNav();
    setupModal();
    setupButtons();
    setupCropper();
    if (getToken()) loadAllData();
});

// ── Navigation ──
function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });
    document.getElementById('hamburger').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
    document.getElementById('sidebarClose').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('open');
    });
}

function switchSection(name) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.section === name));
    document.querySelectorAll('.section-panel').forEach(p => p.classList.toggle('active', p.id === `sec-${name}`));
    const titles = { dashboard: 'Dashboard', projects: 'Projects', logos: 'Brand Logos', testimonials: 'Testimonials', videos: 'Videos (9:16)' };
    document.getElementById('pageTitle').textContent = titles[name] || name;
    document.getElementById('sidebar').classList.remove('open');
}

// ── Modal ──
function setupModal() {
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
    });
}
function openModal(title, bodyHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ── Toast ──
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('hide'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ── Buttons ──
function setupButtons() {
    document.getElementById('addProjectBtn').addEventListener('click', () => showProjectForm());
    document.getElementById('addLogoBtn').addEventListener('click', () => showLogoForm());
    document.getElementById('addTestimonialBtn').addEventListener('click', () => showTestimonialForm());
    document.getElementById('addVideoBtn')?.addEventListener('click', () => showVideoForm());
}

// ── Data Loading ──
async function loadAllData() {
    try {
        const res = await fetch(`${API}/content`);
        allData = await res.json();
        if (!allData.videos) allData.videos = [];
        updateDashboard();
        renderProjects();
        renderLogos();
        renderTestimonials();
        renderVideos();
    } catch (err) {
        showToast('Failed to load data. Is the server running?', 'error');
    }
}

function updateDashboard() {
    document.getElementById('statProjects').textContent = allData.projects.length;
    document.getElementById('statLogos').textContent = allData.logos.length;
    document.getElementById('statTestimonials').textContent = allData.testimonials.length;
    document.getElementById('statImages').textContent = allData.projects.length + allData.logos.length + allData.testimonials.length + (allData.videos ? allData.videos.length : 0);
}

function imgSrc(p) {
    if (!p) return '';
    if (p.startsWith('http')) return p;
    const origin = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:4000'
        : '';
    const cleanPath = p.startsWith('/') ? p.slice(1) : p;
    return `${origin}/${cleanPath}`;
}

// ═══════════════════════════════════════
// ── PROJECTS ──
// ═══════════════════════════════════════
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!allData.projects.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-briefcase"></i><h4>No projects yet</h4><p>Click "Add Project" to get started</p></div>`;
        return;
    }
    grid.innerHTML = allData.projects.map(p => `
        <div class="item-card">
            <img class="card-image" src="${imgSrc(p.image)}" alt="${p.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22><rect fill=%22%231a1a26%22 width=%22400%22 height=%22200%22/><text x=%22200%22 y=%22100%22 fill=%22%2371717a%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22>No Image</text></svg>'">
            <div class="card-body">
                <h4>${esc(p.title)}</h4>
                <div class="card-role">${esc(p.role)}</div>
                <p class="card-desc">${esc(p.description)}</p>
                ${p.tags?.length ? `<div class="card-tags">${p.tags.map(t => `<span class="card-tag">${esc(t)}</span>`).join('')}</div>` : ''}
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="showProjectForm('${p.id}')"><i class="fas fa-pen"></i> Edit</button>
                <button class="card-action-btn delete-btn" onclick="deleteItem('projects','${p.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function showProjectForm(editId) {
    const item = editId ? allData.projects.find(p => p.id === editId) : null;
    const title = item ? 'Edit Project' : 'Add Project';
    openModal(title, `
        <form id="projectForm" onsubmit="saveProject(event, '${editId || ''}')">
            <div class="form-group">
                <label>Project Image <span class="required">*</span></label>
                <div class="upload-zone ${item?.image ? 'has-image' : ''}" onclick="this.querySelector('input').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drop image here or <span>browse</span></p>
                    <img class="upload-preview" src="${item?.image ? imgSrc(item.image) : ''}" id="projImgPreview">
                    <span class="upload-change">Change</span>
                    <input type="file" accept="image/*" onchange="handleUpload(this, 'projects', 'projImgPreview', 'projImgPath')">
                </div>
                <input type="hidden" id="projImgPath" value="${item?.image || ''}">
            </div>
            <div class="form-group">
                <label>Title <span class="required">*</span></label>
                <input class="form-input" id="projTitle" value="${esc(item?.title || '')}" required placeholder="e.g. NMG Marine Service">
            </div>
            <div class="form-group">
                <label>Role / Type</label>
                <input class="form-input" id="projRole" value="${esc(item?.role || '')}" placeholder="e.g. WEBSITE, CRM, Branding">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="form-textarea" id="projDesc" placeholder="Describe the project...">${esc(item?.description || '')}</textarea>
            </div>
            <div class="form-group">
                <label>Live Link</label>
                <input class="form-input" id="projLink" value="${esc(item?.link || '')}" placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label>Tags</label>
                <div class="tags-input-container" id="projTagsContainer">
                    ${(item?.tags || []).map(t => `<span class="tag-chip">${esc(t)}<button type="button" onclick="this.parentElement.remove()">×</button></span>`).join('')}
                    <input class="tags-input" placeholder="Type & press Enter" onkeydown="addTag(event, 'projTagsContainer')">
                </div>
                <p class="form-hint">Press Enter to add tags</p>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save" id="projSaveBtn">${item ? 'Update' : 'Save'} Project</button>
            </div>
        </form>
    `);
}

async function saveProject(e, editId) {
    e.preventDefault();
    const btn = document.getElementById('projSaveBtn');
    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Saving...';
    const tags = [...document.querySelectorAll('#projTagsContainer .tag-chip')].map(c => c.textContent.replace('×', '').trim());
    const body = {
        image: document.getElementById('projImgPath').value,
        title: document.getElementById('projTitle').value,
        role: document.getElementById('projRole').value,
        description: document.getElementById('projDesc').value,
        link: document.getElementById('projLink').value,
        tags
    };
    try {
        const url = editId ? `${API}/projects/${editId}` : `${API}/projects`;
        const method = editId ? 'PUT' : 'POST';
        await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
        showToast(editId ? 'Project updated!' : 'Project added!');
        closeModal();
        await loadAllData();
    } catch { showToast('Failed to save', 'error'); }
    btn.disabled = false; btn.textContent = 'Save Project';
}

// ═══════════════════════════════════════
// ── LOGOS ──
// ═══════════════════════════════════════
function renderLogos() {
    const grid = document.getElementById('logosGrid');
    if (!allData.logos.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-palette"></i><h4>No logos yet</h4><p>Click "Add Logo" to get started</p></div>`;
        return;
    }
    grid.innerHTML = allData.logos.map(l => `
        <div class="item-card logo-card">
            <img class="card-image" src="${imgSrc(l.image)}" alt="${l.label}" onerror="this.style.display='none'">
            <div class="card-body">
                <h4><i class="${l.icon}" style="color:var(--accent);margin-right:8px;"></i>${esc(l.label)}</h4>
                <p class="card-desc">${esc(l.desc)}</p>
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="showLogoForm('${l.id}')"><i class="fas fa-pen"></i> Edit</button>
                <button class="card-action-btn delete-btn" onclick="deleteItem('logos','${l.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function showLogoForm(editId) {
    const item = editId ? allData.logos.find(l => l.id === editId) : null;
    openModal(item ? 'Edit Logo' : 'Add Logo', `
        <form id="logoForm" onsubmit="saveLogo(event, '${editId || ''}')">
            <div class="form-group">
                <label>Logo Image <span class="required">*</span></label>
                <div class="upload-zone ${item?.image ? 'has-image' : ''}" onclick="this.querySelector('input').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drop image or <span>browse</span></p>
                    <img class="upload-preview" src="${item?.image ? imgSrc(item.image) : ''}" id="logoImgPreview">
                    <span class="upload-change">Change</span>
                    <input type="file" accept="image/*" onchange="handleUpload(this, 'logos', 'logoImgPreview', 'logoImgPath')">
                </div>
                <input type="hidden" id="logoImgPath" value="${item?.image || ''}">
            </div>
            <div class="form-group">
                <label>Brand Name <span class="required">*</span></label>
                <input class="form-input" id="logoLabel" value="${esc(item?.label || '')}" required placeholder="e.g. Healthifem">
            </div>
            <div class="form-group">
                <label>Icon Class</label>
                <input class="form-input" id="logoIcon" value="${esc(item?.icon || 'fas fa-star')}" placeholder="e.g. fas fa-heartbeat">
                <p class="form-hint">Font Awesome class. Browse at fontawesome.com/icons</p>
            </div>
            <div class="form-group">
                <label>Description</label>
                <input class="form-input" id="logoDesc" value="${esc(item?.desc || '')}" placeholder="Short description of the brand">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">${item ? 'Update' : 'Save'} Logo</button>
            </div>
        </form>
    `);
}

async function saveLogo(e, editId) {
    e.preventDefault();
    const body = {
        image: document.getElementById('logoImgPath').value,
        label: document.getElementById('logoLabel').value,
        icon: document.getElementById('logoIcon').value,
        desc: document.getElementById('logoDesc').value
    };
    try {
        await fetch(editId ? `${API}/logos/${editId}` : `${API}/logos`, {
            method: editId ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        showToast(editId ? 'Logo updated!' : 'Logo added!');
        closeModal(); await loadAllData();
    } catch { showToast('Failed to save', 'error'); }
}

// ═══════════════════════════════════════
// ── TESTIMONIALS ──
// ═══════════════════════════════════════
function renderTestimonials() {
    const grid = document.getElementById('testimonialsGrid');
    if (!allData.testimonials.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-quote-right"></i><h4>No testimonials yet</h4><p>Click "Add Testimonial" to get started</p></div>`;
        return;
    }
    grid.innerHTML = allData.testimonials.map(t => `
        <div class="item-card testimonial-card">
            <img class="card-image" src="${imgSrc(t.image)}" alt="${t.name}" onerror="this.style.display='none'">
            <div class="card-body">
                <h4>${esc(t.name)}</h4>
                <div class="card-location"><i class="fas fa-map-marker-alt"></i> ${esc(t.location)}</div>
                <p class="card-quote">"${esc(t.quote)}"</p>
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="showTestimonialForm('${t.id}')"><i class="fas fa-pen"></i> Edit</button>
                <button class="card-action-btn delete-btn" onclick="deleteItem('testimonials','${t.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function showTestimonialForm(editId) {
    const item = editId ? allData.testimonials.find(t => t.id === editId) : null;
    openModal(item ? 'Edit Testimonial' : 'Add Testimonial', `
        <form id="testForm" onsubmit="saveTestimonial(event, '${editId || ''}')">
            <div class="form-group">
                <label>Client Image</label>
                <div class="upload-zone ${item?.image ? 'has-image' : ''}" onclick="this.querySelector('input').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Drop image or <span>browse</span></p>
                    <img class="upload-preview" src="${item?.image ? imgSrc(item.image) : ''}" id="testImgPreview">
                    <span class="upload-change">Change</span>
                    <input type="file" accept="image/*" onchange="handleUpload(this, 'testimonials', 'testImgPreview', 'testImgPath')">
                </div>
                <input type="hidden" id="testImgPath" value="${item?.image || ''}">
            </div>
            <div class="form-group">
                <label>Client Name <span class="required">*</span></label>
                <input class="form-input" id="testName" value="${esc(item?.name || '')}" required placeholder="e.g. SBJ Jewelry">
            </div>
            <div class="form-group">
                <label>Location</label>
                <input class="form-input" id="testLocation" value="${esc(item?.location || '')}" placeholder="e.g. Chennai, India">
            </div>
            <div class="form-group">
                <label>Quote / Review <span class="required">*</span></label>
                <textarea class="form-textarea" id="testQuote" required placeholder="What did the client say?">${esc(item?.quote || '')}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save">${item ? 'Update' : 'Save'} Testimonial</button>
            </div>
        </form>
    `);
}

async function saveTestimonial(e, editId) {
    e.preventDefault();
    const body = {
        image: document.getElementById('testImgPath').value,
        name: document.getElementById('testName').value,
        location: document.getElementById('testLocation').value,
        quote: document.getElementById('testQuote').value
    };
    try {
        await fetch(editId ? `${API}/testimonials/${editId}` : `${API}/testimonials`, {
            method: editId ? 'PUT' : 'POST',
            headers: authHeaders(),
            body: JSON.stringify(body)
        });
        showToast(editId ? 'Testimonial updated!' : 'Testimonial added!');
        closeModal(); await loadAllData();
    } catch { showToast('Failed to save', 'error'); }
}

// ── Custom Confirm Dialog ──
let confirmResolve = null;

function showConfirm(message) {
    return new Promise((resolve) => {
        confirmResolve = resolve;
        document.getElementById('confirmMessage').textContent = message || 'This action cannot be undone. Are you sure you want to delete this item?';
        document.getElementById('confirmOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

function closeConfirm() {
    document.getElementById('confirmOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('confirmCancelBtn').addEventListener('click', () => {
        closeConfirm();
        if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        closeConfirm();
        if (confirmResolve) { confirmResolve(true); confirmResolve = null; }
    });
    document.getElementById('confirmOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeConfirm();
            if (confirmResolve) { confirmResolve(false); confirmResolve = null; }
        }
    });
});

async function deleteItem(type, id) {
    const confirmed = await showConfirm('This action cannot be undone. Are you sure you want to delete this item?');
    if (!confirmed) return;
    try {
        const btn = document.getElementById('confirmDeleteBtn');
        await fetch(`${API}/${type}/${id}`, { method: 'DELETE', headers: authHeaders() });
        showToast('Item deleted');
        await loadAllData();
    } catch { showToast('Delete failed', 'error'); }
}

let activeCropper = null;
let currentCropCallback = null;

function setupCropper() {
    const overlay = document.getElementById('cropperOverlay');
    if (!overlay) return;
    
    document.getElementById('cropperCloseBtn').addEventListener('click', closeCropper);
    document.getElementById('cropperCancelBtn').addEventListener('click', closeCropper);
    
    document.getElementById('cropRotateLeft').addEventListener('click', () => activeCropper && activeCropper.rotate(-90));
    document.getElementById('cropRotateRight').addEventListener('click', () => activeCropper && activeCropper.rotate(90));
    
    let isFlippedH = false;
    document.getElementById('cropFlipH').addEventListener('click', () => {
        if (!activeCropper) return;
        isFlippedH = !isFlippedH;
        activeCropper.scaleX(isFlippedH ? -1 : 1);
    });
    
    let isFlippedV = false;
    document.getElementById('cropFlipV').addEventListener('click', () => {
        if (!activeCropper) return;
        isFlippedV = !isFlippedV;
        activeCropper.scaleY(isFlippedV ? -1 : 1);
    });
    
    document.querySelectorAll('.cropper-toolbar [data-ratio]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!activeCropper) return;
            document.querySelectorAll('.cropper-toolbar [data-ratio]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const ratio = btn.dataset.ratio;
            if (ratio === 'free') {
                activeCropper.setAspectRatio(NaN);
            } else {
                activeCropper.setAspectRatio(parseFloat(ratio));
            }
        });
    });
    
    document.getElementById('cropperSaveBtn').addEventListener('click', executeCropAndUpload);
}

function handleUpload(input, type, previewId, pathId) {
    const file = input.files ? input.files[0] : null;
    if (!file) return;
    
    if (input && typeof input.value !== 'undefined') input.value = '';
    
    if (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov|ogg|m4v)$/i)) {
        // Direct video upload
        const formData = new FormData();
        formData.append('image', file);
        showToast('Uploading video file...');
        fetch(`${API}/upload/${type}`, { method: 'POST', body: formData, headers: authHeadersMultipart() })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const pathEl = document.getElementById(pathId);
                    if (pathEl) pathEl.value = data.path;
                    const prevEl = document.getElementById(previewId);
                    if (prevEl) {
                        prevEl.src = imgSrc(data.path);
                        prevEl.style.display = 'block';
                        const zone = prevEl.closest('.upload-zone');
                        if (zone) zone.classList.add('has-image');
                    }
                    showToast('Video uploaded successfully!');
                } else {
                    showToast(data.error || 'Upload failed', 'error');
                }
            })
            .catch(() => showToast('Upload failed', 'error'));
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        openCropper(e.target.result, (croppedBlob) => {
            uploadCroppedImage(croppedBlob, file.name, type, previewId, pathId);
        });
    };
    reader.readAsDataURL(file);
}

function openCropper(imageSrc, callback) {
    const overlay = document.getElementById('cropperOverlay');
    const imgEl = document.getElementById('cropperImageSrc');
    if (!overlay || !imgEl) return;
    
    imgEl.src = imageSrc;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    currentCropCallback = callback;
    
    if (activeCropper) {
        activeCropper.destroy();
        activeCropper = null;
    }
    
    document.querySelectorAll('.cropper-toolbar [data-ratio]').forEach(b => {
        b.classList.toggle('active', b.dataset.ratio === 'free');
    });
    
    // Initialize Cropper.js
    activeCropper = new Cropper(imgEl, {
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false
    });
}

function closeCropper() {
    const overlay = document.getElementById('cropperOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (activeCropper) {
        activeCropper.destroy();
        activeCropper = null;
    }
    currentCropCallback = null;
}

function executeCropAndUpload() {
    if (!activeCropper || !currentCropCallback) return;
    
    const btn = document.getElementById('cropperSaveBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Processing...';
    
    const canvas = activeCropper.getCroppedCanvas({
        maxWidth: 1600,
        maxHeight: 1600,
        imageSmoothingQuality: 'high'
    });
    
    if (!canvas) {
        showToast('Failed to crop image', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
        return;
    }
    
    canvas.toBlob((blob) => {
        if (blob) {
            currentCropCallback(blob);
        } else {
            showToast('Failed to generate image blob', 'error');
        }
        btn.disabled = false;
        btn.innerHTML = originalText;
        closeCropper();
    }, 'image/jpeg', 0.9);
}

async function uploadCroppedImage(blob, originalName, type, previewId, pathId) {
    const formData = new FormData();
    const fileName = originalName ? originalName.replace(/\.[^/.]+$/, "") + "_cropped.jpg" : "image_cropped.jpg";
    formData.append('image', blob, fileName);
    
    try {
        const res = await fetch(`${API}/upload/${type}`, { 
            method: 'POST', 
            body: formData, 
            headers: authHeadersMultipart() 
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById(previewId).src = imgSrc(data.path);
            document.getElementById(pathId).value = data.path;
            
            const previewEl = document.getElementById(previewId);
            if (previewEl) {
                const zone = previewEl.closest('.upload-zone');
                if (zone) zone.classList.add('has-image');
            }
            
            showToast('Image cropped and uploaded!');
        } else {
            showToast(data.error || 'Upload failed', 'error');
        }
    } catch { 
        showToast('Upload failed', 'error'); 
    }
}

function addTag(e, containerId) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const val = e.target.value.trim();
    if (!val) return;
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${esc(val)}<button type="button" onclick="this.parentElement.remove()">×</button>`;
    e.target.before(chip);
    e.target.value = '';
}

function esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// ═══════════════════════════════════════
// ── VIDEOS (9:16 REELS) ──
// ═══════════════════════════════════════
function renderVideos() {
    const grid = document.getElementById('videosGrid');
    if (!grid) return;
    const list = allData.videos || [];
    if (!list.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fas fa-video"></i><h4>No videos uploaded yet</h4><p>Click "Add Video" to upload your 9:16 vertical reels & videos</p></div>`;
        return;
    }
    grid.innerHTML = list.map(v => {
        const isVid = v.videoUrl && (v.videoUrl.match(/\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i) || v.videoUrl.includes('/uploads/videos/'));
        return `
        <div class="item-card">
            <div class="card-video-container" style="position:relative; width:100%; height:280px; overflow:hidden; background:#000; display:flex; align-items:center; justify-content:center; border-radius:12px 12px 0 0;">
                ${isVid ? `
                    <video src="${imgSrc(v.videoUrl)}" controls muted playsinline style="width:100%; height:100%; object-fit:cover;"></video>
                ` : `
                    <img class="card-image" src="${imgSrc(v.poster || v.videoUrl)}" alt="${esc(v.title)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22><rect fill=%22%231a1a26%22 width=%22400%22 height=%22200%22/><text x=%22200%22 y=%22100%22 fill=%22%2371717a%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22>Video</text></svg>'">
                `}
                <span style="position:absolute; top:8px; right:8px; background:rgba(230,57,70,0.9); color:#fff; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:600;">9:16 Reel</span>
            </div>
            <div class="card-body">
                <h4>${esc(v.title)}</h4>
                <div class="card-role">${esc(v.subtitle || 'Vertical Video')}</div>
            </div>
            <div class="card-actions">
                <button class="card-action-btn edit-btn" onclick="showVideoForm('${v.id}')"><i class="fas fa-pen"></i> Edit</button>
                <button class="card-action-btn delete-btn" onclick="deleteItem('videos','${v.id}')"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `}).join('');
}

function showVideoForm(editId) {
    const item = editId ? (allData.videos || []).find(v => v.id === editId) : null;
    const title = item ? 'Edit 9:16 Video' : 'Add 9:16 Video';
    
    openModal(title, `
        <form id="videoForm" onsubmit="saveVideo(event, '${editId || ''}')">
            <div class="form-group">
                <label>Title <span class="required">*</span></label>
                <input type="text" class="form-input" id="vTitle" required value="${esc(item?.title || '')}" placeholder="e.g. Brand Story Reel">
            </div>
            <div class="form-group">
                <label>Subtitle / Description</label>
                <input type="text" class="form-input" id="vSubtitle" value="${esc(item?.subtitle || '')}" placeholder="e.g. 9:16 Campaign Video">
            </div>
            <div class="form-group">
                <label>Video File (9:16 Vertical format MP4/WebM/MOV) <span class="required">*</span></label>
                <div class="upload-zone ${item?.videoUrl ? 'has-image' : ''}" onclick="if(!event.target.closest('video')) this.querySelector('input').click()" ondragover="event.preventDefault(); this.classList.add('dragover');" ondragleave="this.classList.remove('dragover');" ondrop="event.preventDefault(); this.classList.remove('dragover'); if(event.dataTransfer.files.length) handleUpload({files: event.dataTransfer.files}, 'videos', 'vPrev', 'vPath');">
                    <i class="fas fa-film"></i>
                    <p>Click or drag 9:16 Video file here</p>
                    <video id="vPrev" class="upload-preview" src="${item?.videoUrl ? imgSrc(item.videoUrl) : ''}" controls muted style="${item?.videoUrl ? 'display:block;' : 'display:none;'}"></video>
                    <span class="upload-change">Change Video</span>
                    <input type="file" accept="video/*,.mp4,.webm,.mov,.m4v" onchange="handleUpload(this, 'videos', 'vPrev', 'vPath')">
                </div>
                <input type="hidden" id="vPath" value="${esc(item?.videoUrl || '')}">
                <p class="form-hint" style="margin-top: 8px;">Or paste an external Video URL below:</p>
                <input type="url" class="form-input" id="vUrlInput" value="${esc(item?.videoUrl || '')}" placeholder="https://example.com/video.mp4" onchange="document.getElementById('vPath').value = this.value; const prev=document.getElementById('vPrev'); prev.src=this.value; prev.style.display='block'; prev.closest('.upload-zone').classList.add('has-image');">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-cancel" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn-save" id="vSaveBtn"><i class="fas fa-check"></i> Save Video</button>
            </div>
        </form>
    `);
}

async function saveVideo(e, editId) {
    e.preventDefault();
    const title = document.getElementById('vTitle').value;
    const subtitle = document.getElementById('vSubtitle').value;
    const videoUrl = document.getElementById('vPath').value || document.getElementById('vUrlInput').value;
    if (!videoUrl) return showToast('Please upload or provide a video URL', 'error');

    const body = { title, subtitle, videoUrl };
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API}/videos/${editId}` : `${API}/videos`;

    try {
        const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        if (data.success) {
            showToast(editId ? 'Video updated!' : 'Video added!');
            closeModal();
            loadAllData();
        } else showToast(data.error || 'Failed to save', 'error');
    } catch { showToast('Server error', 'error'); }
}
