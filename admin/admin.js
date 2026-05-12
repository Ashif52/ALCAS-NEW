const API = 'http://localhost:4000/api';
const PUBLIC = 'http://localhost:4000/public';
let allData = { projects: [], logos: [], testimonials: [] };

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupModal();
    setupButtons();
    loadAllData();
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
    const titles = { dashboard: 'Dashboard', projects: 'Projects', logos: 'Brand Logos', testimonials: 'Testimonials' };
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
}

// ── Data Loading ──
async function loadAllData() {
    try {
        const res = await fetch(`${API}/content`);
        allData = await res.json();
        updateDashboard();
        renderProjects();
        renderLogos();
        renderTestimonials();
    } catch (err) {
        showToast('Failed to load data. Is the server running?', 'error');
    }
}

function updateDashboard() {
    document.getElementById('statProjects').textContent = allData.projects.length;
    document.getElementById('statLogos').textContent = allData.logos.length;
    document.getElementById('statTestimonials').textContent = allData.testimonials.length;
    document.getElementById('statImages').textContent = allData.projects.length + allData.logos.length + allData.testimonials.length;
}

// ── Image path helper ──
function imgSrc(p) {
    if (!p) return '';
    if (p.startsWith('http')) return p;
    return `${PUBLIC}/${p}`;
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
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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
            headers: { 'Content-Type': 'application/json' },
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        showToast(editId ? 'Testimonial updated!' : 'Testimonial added!');
        closeModal(); await loadAllData();
    } catch { showToast('Failed to save', 'error'); }
}

// ═══════════════════════════════════════
// ── SHARED UTILITIES ──
// ═══════════════════════════════════════
async function deleteItem(type, id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
        await fetch(`${API}/${type}/${id}`, { method: 'DELETE' });
        showToast('Item deleted');
        await loadAllData();
    } catch { showToast('Delete failed', 'error'); }
}

async function handleUpload(input, type, previewId, pathId) {
    const file = input.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
        const res = await fetch(`${API}/upload/${type}`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
            document.getElementById(previewId).src = `${PUBLIC}/${data.path}`;
            document.getElementById(pathId).value = data.path;
            input.closest('.upload-zone').classList.add('has-image');
            showToast('Image uploaded!');
        }
    } catch { showToast('Upload failed', 'error'); }
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
