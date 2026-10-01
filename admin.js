// ===================================================================
// PANNEAU ADMINISTRATEUR CACHÉ — Gestion des projets
// ===================================================================
// ACCÈS :
//   - Sur ordinateur : tapez le mot "admin" au clavier n'importe où
//     sur la page (en dehors d'un champ de texte).
//   - Sur mobile/tablette : allez tout en bas de la page (pied de page)
//     et tapez 5 fois rapidement sur "Edan RODDE".
//
// MOT DE PASSE PAR DÉFAUT : EdanSIO2026#Admin
//   -> À CHANGER ! Voir les instructions tout en bas de ce fichier
//      (section "CHANGER LE MOT DE PASSE").
//
// FONCTIONNEMENT :
//   Les modifications (édition / ajout / suppression de projets) sont
//   enregistrées dans le navigateur (localStorage), donc uniquement
//   visibles par vous, sur cet ordinateur. Une fois satisfait du
//   résultat, utilisez le bouton "Exporter le code" du panneau pour
//   récupérer le code HTML à coller définitivement dans vos fichiers.
// ===================================================================

(function () {
    'use strict';

    // ============ CONFIGURATION ============
    const PASSWORD_HASH = 'd7b44f845298b18a7dacaf0b00195a71ebb61befc6c5b27b6e1cad740403074a';
    const STORAGE_KEY = 'pf_admin_data_v1';
    const AUTH_KEY = 'pf_admin_auth_v1';

    const DEFAULT_COVER_IMG = 'https://res.cloudinary.com/dynbrtfxs/image/upload/v1765110955/images_zyxhcs.png';

    const DEFAULT_ICON_SMALL = `<svg class="icon-svg" style="width:24px;height:24px;margin-right:.5rem;vertical-align:middle;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" opacity="0.12"/><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>`;

    const DEFAULT_ICON_BIG = `<svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" opacity="0.08"/><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><circle cx="12" cy="13" r="2.2" stroke-width="1.4"/></svg>`;

    const STATUS_ICON = `<svg class="icon-svg" style="width:14px;height:14px;margin-right:.3rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

    const DATA_ATTR_MAP = {
        title: 'data-title', status: 'data-status', year: 'data-year', hours: 'data-hours',
        resources: 'data-resources', module: 'data-module', description: 'data-description',
        context: 'data-context', client: 'data-client', needs: 'data-needs', docsIn: 'data-docs-in',
        tasks: 'data-tasks', docsOut: 'data-docs-out', opinion: 'data-opinion',
        difficulties: 'data-difficulties', contributions: 'data-contributions', bonus: 'data-bonus',
        tech: 'data-tech', modalImage: 'data-image', modalImage2: 'data-image2', modalImageCaption: 'data-image-caption'
    };

    // Champs texte long (une ligne = un élément, séparés par "|" dans le HTML)
    const LIST_FIELDS = ['resources', 'needs', 'docsIn', 'tasks', 'docsOut', 'difficulties', 'contributions'];
    // Champs texte simple (une seule ligne)
    const TEXT_FIELDS = ['title', 'year', 'hours', 'module', 'client', 'bonus', 'modalImage', 'modalImage2', 'modalImageCaption'];
    // Champs zone de texte (paragraphe)
    const AREA_FIELDS = ['description', 'context', 'opinion'];

    let adminModeActive = false;
    const GRID_SNAPSHOTS = [];

    // ============ UTILITAIRES ============
    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function splitList(str, sep) {
        if (!str) return [];
        return String(str).split(sep).map(s => s.trim()).filter(Boolean);
    }

    function joinLines(textareaValue) {
        return splitList(textareaValue, '\n').join('|');
    }

    function extractYearLabel(yearStr) {
        if (!yearStr) return '';
        const matches = String(yearStr).match(/\d{4}/g);
        return matches ? matches[matches.length - 1] : yearStr;
    }

    async function sha256(text) {
        const enc = new TextEncoder().encode(text);
        const buf = await crypto.subtle.digest('SHA-256', enc);
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { edits: {}, additions: [], deletions: [] };
            const d = JSON.parse(raw);
            return { edits: d.edits || {}, additions: d.additions || [], deletions: d.deletions || [] };
        } catch (e) { return { edits: {}, additions: [], deletions: [] }; }
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function isAuthed() {
        return localStorage.getItem(AUTH_KEY) === '1';
    }

    function uid() {
        return 'new-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    // ============ SNAPSHOT DES CARTES EXISTANTES ============
    function extractFields(card) {
        const f = {};
        Object.keys(DATA_ATTR_MAP).forEach(k => { f[k] = card.dataset[k] || ''; });
        return f;
    }

    function captureCard(card, category) {
        const fields = extractFields(card);
        let iconHTML = '', coverImage = '';
        if (category === 'pro') {
            const svg = card.querySelector('h3 svg');
            iconHTML = svg ? svg.outerHTML : '';
            const img = card.querySelector('.project-image img');
            coverImage = img ? img.getAttribute('src') : '';
        } else {
            const box = card.querySelector('.project-icon-large');
            iconHTML = box ? box.innerHTML : '';
        }
        return { key: fields.title, fields, iconHTML, coverImage, htmlId: card.id || '' };
    }

    function snapshotGrid(grid, category) {
        if (!grid) return null;
        const cards = Array.from(grid.querySelectorAll('[data-project="true"]')).map(c => captureCard(c, category));
        return { selector: category === 'pro' ? '.projects-grid' : '.school-projects-grid', category, cards };
    }

    function snapshotAll() {
        const proGrid = document.querySelector('.projects-grid');
        const schoolGrid = document.querySelector('.school-projects-grid');
        const s1 = snapshotGrid(proGrid, 'pro');
        const s2 = snapshotGrid(schoolGrid, 'scolaire');
        if (s1) GRID_SNAPSHOTS.push(s1);
        if (s2) GRID_SNAPSHOTS.push(s2);
    }

    // ============ CONSTRUCTION DU HTML DES CARTES ============
    function buildDataAttrs(fields, key) {
        let s = ` data-project="true" data-admin-key="${esc(key)}"`;
        Object.keys(DATA_ATTR_MAP).forEach(k => {
            const v = fields[k];
            if (v) s += ` ${DATA_ATTR_MAP[k]}="${esc(v)}"`;
        });
        return s;
    }

    function buildProCardHTML(key, fields, iconHTML, coverImage, htmlId) {
        const icon = iconHTML || DEFAULT_ICON_SMALL;
        const cover = coverImage || DEFAULT_COVER_IMG;
        const idAttr = htmlId ? ` id="${esc(htmlId)}"` : '';
        return `<div${idAttr} class="project-card reveal visible pf-admin-card"${buildDataAttrs(fields, key)}>
            <div class="project-image" aria-hidden="true"><img src="${esc(cover)}" alt="${esc(fields.title || '')}"></div>
            <div class="project-content">
                <h3>${icon}<span class="pf-admin-title">${esc(fields.title || '')}</span></h3>
                <p>${esc(fields.description || '')}</p>
            </div>
            <span class="click-hint">Cliquez pour plus de détails</span>
        </div>`;
    }

    function buildSchoolCardHTML(key, fields, iconHTML, htmlId) {
        const icon = iconHTML || DEFAULT_ICON_BIG;
        const statusClass = (fields.status || '').trim() === 'Terminé' ? 'completed' : 'in-progress';
        const yearLabel = extractYearLabel(fields.year || '');
        const techs = splitList(fields.tech, ',').map(t => `<span>${esc(t)}</span>`).join('');
        const idAttr = htmlId ? ` id="${esc(htmlId)}"` : '';
        return `<article${idAttr} class="school-project-card reveal visible pf-admin-card"${buildDataAttrs(fields, key)}>
            <div class="project-status">
                <span class="status-badge ${statusClass}">${STATUS_ICON}${esc(fields.status || '')}</span>
                <span class="project-year">${esc(yearLabel)}</span>
            </div>
            <div class="project-icon-large">${icon}</div>
            <h3><span class="pf-admin-title">${esc(fields.title || '')}</span></h3>
            <p>${esc(fields.description || '')}</p>
            <div class="project-tech">${techs}</div>
            <span class="click-hint">Cliquez pour plus de détails</span>
        </article>`;
    }

    // ============ RENDU ============
    function addHoursBadge(card) {
        const hours = card.dataset.hours;
        const old = card.querySelector('.card-hours-badge');
        if (old) old.remove();
        if (!hours) return;
        const badge = document.createElement('span');
        badge.className = 'card-hours-badge';
        badge.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${esc(hours)}`;
        const hint = card.querySelector('.click-hint');
        if (hint) card.insertBefore(badge, hint); else card.appendChild(badge);
    }

    function attachCursorHover(card) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        if (!cursor || !cursorFollower) return;
        card.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollower.classList.add('hover'); });
        card.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollower.classList.remove('hover'); });
    }

    function attachClickToOpen(card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.pf-admin-card-controls')) return;
            if (e.target.closest('img')) return;
            if (typeof window.openProjectModal === 'function') window.openProjectModal(card);
        });
    }

    function addAdminControls(card, key, category) {
        const old = card.querySelector('.pf-admin-card-controls');
        if (old) old.remove();
        const ctrl = document.createElement('div');
        ctrl.className = 'pf-admin-card-controls';
        ctrl.innerHTML = `<button type="button" class="pf-admin-mini-btn pf-edit" title="Modifier">✏️</button><button type="button" class="pf-admin-mini-btn pf-delete" title="Supprimer">🗑️</button>`;
        ctrl.querySelector('.pf-edit').addEventListener('click', (e) => { e.stopPropagation(); openProjectForm(category, key); });
        ctrl.querySelector('.pf-delete').addEventListener('click', (e) => { e.stopPropagation(); deleteProject(key, category); });
        card.appendChild(ctrl);
    }

    function render() {
        const data = loadData();
        GRID_SNAPSHOTS.forEach(gridSnap => {
            const grid = document.querySelector(gridSnap.selector);
            if (!grid) return;
            grid.innerHTML = '';
            gridSnap.cards.forEach(snap => {
                if (data.deletions.includes(snap.key)) return;
                const edit = data.edits[snap.key] || {};
                const fields = Object.assign({}, snap.fields, edit.fields || {});
                const icon = edit.iconHTML || snap.iconHTML;
                const cover = edit.coverImage !== undefined && edit.coverImage !== '' ? edit.coverImage : snap.coverImage;
                const html = gridSnap.category === 'pro'
                    ? buildProCardHTML(snap.key, fields, icon, cover, snap.htmlId)
                    : buildSchoolCardHTML(snap.key, fields, icon, snap.htmlId);
                grid.insertAdjacentHTML('beforeend', html);
            });
            data.additions.filter(a => a.category === gridSnap.category).forEach(a => {
                const html = gridSnap.category === 'pro'
                    ? buildProCardHTML(a.key, a.fields, null, a.coverImage, null)
                    : buildSchoolCardHTML(a.key, a.fields, null, null);
                grid.insertAdjacentHTML('beforeend', html);
            });
        });

        document.querySelectorAll('.pf-admin-card').forEach(card => {
            addHoursBadge(card);
            attachCursorHover(card);
            attachClickToOpen(card);
            if (adminModeActive) {
                const key = card.dataset.adminKey;
                const category = card.classList.contains('school-project-card') ? 'scolaire' : 'pro';
                card.classList.add('pf-admin-editable');
                addAdminControls(card, key, category);
            }
        });
    }

    // ============ RÉCUPÉRATION DES CHAMPS EFFECTIFS (pour pré-remplir le formulaire) ============
    function getEffectiveProject(key, category) {
        const data = loadData();
        // C'est un ajout admin
        const addition = data.additions.find(a => a.key === key);
        if (addition) return { fields: addition.fields, coverImage: addition.coverImage, isAddition: true };
        // C'est une carte d'origine
        const gridSnap = GRID_SNAPSHOTS.find(g => g.category === category);
        const snap = gridSnap ? gridSnap.cards.find(c => c.key === key) : null;
        if (!snap) return null;
        const edit = data.edits[key] || {};
        return {
            fields: Object.assign({}, snap.fields, edit.fields || {}),
            coverImage: edit.coverImage !== undefined && edit.coverImage !== '' ? edit.coverImage : snap.coverImage,
            isAddition: false
        };
    }

    function deleteProject(key, category) {
        if (!confirm('Supprimer définitivement ce projet de l\'aperçu ?\n(Cette action ne modifie pas encore vos fichiers réels — utilisez "Exporter le code" ensuite pour appliquer.)')) return;
        const data = loadData();
        if (key.startsWith('new-')) {
            data.additions = data.additions.filter(a => a.key !== key);
        } else {
            if (!data.deletions.includes(key)) data.deletions.push(key);
        }
        saveData(data);
        render();
    }

    // ============ FORMULAIRE PROJET (création / édition) ============
    let formOverlay = null;

    function fieldLabel(key) {
        const labels = {
            title: 'Titre du projet *', status: 'Statut', year: 'Année / période', hours: 'Temps passé (ex: ~20h)',
            resources: 'Ressources (une par ligne)', module: 'Module BTS SIO', description: 'Description courte *',
            context: 'Contexte', client: 'Client / demande', needs: 'Besoins (un par ligne)',
            docsIn: 'Documents fournis (un par ligne)', tasks: 'Tâches réalisées (une par ligne)',
            docsOut: 'Documents produits (un par ligne)', opinion: 'Avis personnel',
            difficulties: 'Difficultés (une par ligne)', contributions: 'Apports (un par ligne)',
            bonus: 'Partie bonus', tech: 'Compétences / technologies (séparées par des virgules)',
            modalImage: 'Image (URL) — 1ère image du détail', modalImage2: 'Image (URL) — 2e image du détail',
            modalImageCaption: 'Légende des images'
        };
        return labels[key] || key;
    }

    function buildFormFieldsHTML(category) {
        let html = '';
        const order = ['title', 'status', 'year', 'hours', 'module', 'description', 'tech'];
        if (category === 'pro') order.push('coverImage');
        order.push('context', 'client', 'resources', 'needs', 'docsIn', 'tasks', 'docsOut',
            'difficulties', 'contributions', 'opinion', 'bonus', 'modalImage', 'modalImage2', 'modalImageCaption');

        order.forEach(key => {
            if (key === 'coverImage') {
                html += `<label class="pf-field"><span>Image de couverture (URL)</span><input type="text" name="coverImage" placeholder="https://..."></label>`;
                return;
            }
            if (key === 'status') {
                html += `<label class="pf-field"><span>Statut</span><select name="status"><option value="Terminé">Terminé</option><option value="En cours">En cours</option></select></label>`;
                return;
            }
            if (LIST_FIELDS.includes(key)) {
                html += `<label class="pf-field pf-field-wide"><span>${fieldLabel(key)}</span><textarea name="${key}" rows="3" placeholder="Un élément par ligne"></textarea></label>`;
            } else if (AREA_FIELDS.includes(key)) {
                html += `<label class="pf-field pf-field-wide"><span>${fieldLabel(key)}</span><textarea name="${key}" rows="3"></textarea></label>`;
            } else {
                html += `<label class="pf-field"><span>${fieldLabel(key)}</span><input type="text" name="${key}"></label>`;
            }
        });
        return html;
    }

    function openProjectForm(category, editKey) {
        closeProjectForm();
        const isEdit = !!editKey;
        const existing = isEdit ? getEffectiveProject(editKey, category) : null;

        formOverlay = document.createElement('div');
        formOverlay.className = 'pf-modal-overlay';
        formOverlay.innerHTML = `
            <div class="pf-modal-box pf-form-box">
                <button type="button" class="pf-modal-close" aria-label="Fermer">×</button>
                <h2>${isEdit ? 'Modifier' : 'Nouveau'} projet ${category === 'pro' ? 'professionnel' : 'scolaire'}</h2>
                <form class="pf-project-form">
                    <div class="pf-field-grid">${buildFormFieldsHTML(category)}</div>
                    <div class="pf-form-actions">
                        <button type="button" class="pf-btn pf-btn-ghost pf-cancel">Annuler</button>
                        <button type="submit" class="pf-btn pf-btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>`;
        document.body.appendChild(formOverlay);
        document.body.style.overflow = 'hidden';

        const form = formOverlay.querySelector('.pf-project-form');

        // Pré-remplissage
        if (existing) {
            const f = existing.fields;
            Object.keys(DATA_ATTR_MAP).forEach(k => {
                const input = form.elements[k];
                if (!input) return;
                if (LIST_FIELDS.includes(k)) input.value = splitList(f[k], '|').join('\n');
                else input.value = f[k] || '';
            });
            if (form.elements.coverImage) form.elements.coverImage.value = existing.coverImage || '';
        }

        formOverlay.querySelector('.pf-modal-close').addEventListener('click', closeProjectForm);
        formOverlay.querySelector('.pf-cancel').addEventListener('click', closeProjectForm);
        formOverlay.addEventListener('click', (e) => { if (e.target === formOverlay) closeProjectForm(); });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProjectForm(form, category, isEdit ? editKey : null);
        });
    }

    function closeProjectForm() {
        if (formOverlay) { formOverlay.remove(); formOverlay = null; document.body.style.overflow = ''; }
    }

    function saveProjectForm(form, category, editKey) {
        const title = form.elements.title.value.trim();
        const description = form.elements.description.value.trim();
        if (!title || !description) {
            alert('Le titre et la description courte sont obligatoires.');
            return;
        }
        const fields = {};
        Object.keys(DATA_ATTR_MAP).forEach(k => {
            const input = form.elements[k];
            if (!input) { fields[k] = ''; return; }
            fields[k] = LIST_FIELDS.includes(k) ? joinLines(input.value) : input.value.trim();
        });
        const coverImage = form.elements.coverImage ? form.elements.coverImage.value.trim() : '';

        const data = loadData();

        if (editKey) {
            if (editKey.startsWith('new-')) {
                const addition = data.additions.find(a => a.key === editKey);
                if (addition) { addition.fields = fields; addition.coverImage = coverImage; }
            } else {
                data.edits[editKey] = { fields, coverImage };
            }
        } else {
            data.additions.push({ key: uid(), category, fields, coverImage });
        }

        saveData(data);
        closeProjectForm();
        render();
    }

    // ============ EXPORT DU CODE ============
    function openExportPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'pf-modal-overlay';

        let sections = '';
        GRID_SNAPSHOTS.forEach(gridSnap => {
            const grid = document.querySelector(gridSnap.selector);
            if (!grid) return;
            const label = gridSnap.category === 'pro' ? 'Grille "Projets Professionnels" (.projects-grid)' : 'Grille "Projets Scolaires" (.school-projects-grid)';
            sections += `<div class="pf-export-section">
                <div class="pf-export-head"><strong>${label}</strong><button type="button" class="pf-btn pf-btn-small pf-copy-btn">Copier</button></div>
                <textarea class="pf-export-area" readonly spellcheck="false">${esc(grid.innerHTML.trim())}</textarea>
            </div>`;
        });

        const backupJSON = JSON.stringify(loadData(), null, 2);

        overlay.innerHTML = `
            <div class="pf-modal-box pf-export-box">
                <button type="button" class="pf-modal-close" aria-label="Fermer">×</button>
                <h2>Exporter le code</h2>
                <p class="pf-export-hint">Copiez le code ci-dessous et remplacez le contenu du bloc correspondant dans le fichier HTML source, pour rendre vos changements permanents.</p>
                ${sections}
                <div class="pf-export-section">
                    <div class="pf-export-head"><strong>Sauvegarde de vos modifications (JSON)</strong><button type="button" class="pf-btn pf-btn-small pf-copy-btn">Copier</button></div>
                    <textarea class="pf-export-area pf-json-area" readonly spellcheck="false">${esc(backupJSON)}</textarea>
                </div>
                <div class="pf-export-section">
                    <div class="pf-export-head"><strong>Importer une sauvegarde JSON</strong></div>
                    <textarea class="pf-export-area pf-import-area" placeholder="Collez ici une sauvegarde JSON exportée précédemment..."></textarea>
                    <button type="button" class="pf-btn pf-btn-primary pf-import-btn" style="margin-top:.6rem;">Importer</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        overlay.querySelector('.pf-modal-close').addEventListener('click', () => { overlay.remove(); document.body.style.overflow = ''; });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) { overlay.remove(); document.body.style.overflow = ''; } });

        overlay.querySelectorAll('.pf-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const area = btn.closest('.pf-export-section').querySelector('.pf-export-area');
                area.select();
                navigator.clipboard.writeText(area.value).then(() => {
                    const old = btn.textContent;
                    btn.textContent = 'Copié !';
                    setTimeout(() => { btn.textContent = old; }, 1500);
                }).catch(() => { document.execCommand('copy'); });
            });
        });

        overlay.querySelector('.pf-import-btn').addEventListener('click', () => {
            const val = overlay.querySelector('.pf-import-area').value.trim();
            if (!val) return;
            try {
                const parsed = JSON.parse(val);
                saveData({ edits: parsed.edits || {}, additions: parsed.additions || [], deletions: parsed.deletions || [] });
                alert('Sauvegarde importée avec succès.');
                overlay.remove();
                document.body.style.overflow = '';
                render();
            } catch (e) {
                alert('JSON invalide, vérifiez le contenu collé.');
            }
        });
    }

    // ============ TOOLBAR ADMIN ============
    let toolbarEl = null;

    function buildToolbar() {
        if (toolbarEl) return;
        const hasPro = !!document.querySelector('.projects-grid');
        const hasSchool = !!document.querySelector('.school-projects-grid');

        toolbarEl = document.createElement('div');
        toolbarEl.className = 'pf-admin-toolbar';
        toolbarEl.innerHTML = `
            <div class="pf-toolbar-header">
                <span>🔐 Mode Admin</span>
                <button type="button" class="pf-toolbar-collapse" title="Réduire">▾</button>
            </div>
            <div class="pf-toolbar-body">
                ${hasPro ? '<button type="button" class="pf-btn pf-btn-primary pf-add-pro">+ Projet Pro</button>' : ''}
                ${hasSchool ? '<button type="button" class="pf-btn pf-btn-primary pf-add-school">+ Projet Scolaire</button>' : ''}
                <button type="button" class="pf-btn pf-btn-ghost pf-export">Exporter le code</button>
                <button type="button" class="pf-btn pf-btn-ghost pf-reset">Réinitialiser mes modifs</button>
                <button type="button" class="pf-btn pf-btn-ghost pf-logout">Se déconnecter</button>
            </div>`;
        document.body.appendChild(toolbarEl);

        toolbarEl.querySelector('.pf-toolbar-collapse').addEventListener('click', () => {
            toolbarEl.classList.toggle('pf-collapsed');
            const btn = toolbarEl.querySelector('.pf-toolbar-collapse');
            btn.textContent = toolbarEl.classList.contains('pf-collapsed') ? '▸' : '▾';
        });
        const addPro = toolbarEl.querySelector('.pf-add-pro');
        if (addPro) addPro.addEventListener('click', () => openProjectForm('pro', null));
        const addSchool = toolbarEl.querySelector('.pf-add-school');
        if (addSchool) addSchool.addEventListener('click', () => openProjectForm('scolaire', null));
        toolbarEl.querySelector('.pf-export').addEventListener('click', openExportPanel);
        toolbarEl.querySelector('.pf-reset').addEventListener('click', () => {
            if (confirm('Effacer toutes vos modifications non exportées (éditions, ajouts, suppressions) ?')) {
                saveData({ edits: {}, additions: [], deletions: [] });
                render();
            }
        });
        toolbarEl.querySelector('.pf-logout').addEventListener('click', logout);
    }

    function removeToolbar() {
        if (toolbarEl) { toolbarEl.remove(); toolbarEl = null; }
    }

    // ============ AUTHENTIFICATION ============
    function enableAdminMode() {
        adminModeActive = true;
        localStorage.setItem(AUTH_KEY, '1');
        buildToolbar();
        render();
    }

    function logout() {
        adminModeActive = false;
        localStorage.removeItem(AUTH_KEY);
        removeToolbar();
        render();
    }

    let loginOverlay = null;
    function openLoginModal() {
        if (loginOverlay) return;
        loginOverlay = document.createElement('div');
        loginOverlay.className = 'pf-modal-overlay';
        loginOverlay.innerHTML = `
            <div class="pf-modal-box pf-login-box">
                <button type="button" class="pf-modal-close" aria-label="Fermer">×</button>
                <h2>🔐 Accès administrateur</h2>
                <form class="pf-login-form">
                    <label class="pf-field"><span>Mot de passe</span><input type="password" name="pw" autocomplete="off" autofocus></label>
                    <p class="pf-login-error" style="display:none;">Mot de passe incorrect.</p>
                    <div class="pf-form-actions">
                        <button type="button" class="pf-btn pf-btn-ghost pf-cancel">Annuler</button>
                        <button type="submit" class="pf-btn pf-btn-primary">Se connecter</button>
                    </div>
                </form>
            </div>`;
        document.body.appendChild(loginOverlay);
        document.body.style.overflow = 'hidden';
        const input = loginOverlay.querySelector('input[name="pw"]');
        setTimeout(() => input.focus(), 50);

        const close = () => { loginOverlay.remove(); loginOverlay = null; document.body.style.overflow = ''; };
        loginOverlay.querySelector('.pf-modal-close').addEventListener('click', close);
        loginOverlay.querySelector('.pf-cancel').addEventListener('click', close);
        loginOverlay.addEventListener('click', (e) => { if (e.target === loginOverlay) close(); });

        loginOverlay.querySelector('.pf-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const pw = input.value;
            const hash = await sha256(pw);
            if (hash === PASSWORD_HASH) {
                close();
                enableAdminMode();
            } else {
                loginOverlay.querySelector('.pf-login-error').style.display = 'block';
                input.value = '';
                input.focus();
            }
        });
    }

    function triggerAdminAccess() {
        if (isAuthed()) {
            adminModeActive = true;
            buildToolbar();
            render();
        } else {
            openLoginModal();
        }
    }

    // ============ DÉCLENCHEURS SECRETS ============
    function initSecretTriggers() {
        // Clavier : taper "admin"
        let buffer = '';
        document.addEventListener('keydown', (e) => {
            const tag = document.activeElement && document.activeElement.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key.length !== 1) return;
            buffer = (buffer + e.key.toLowerCase()).slice(-5);
            if (buffer === 'admin') {
                buffer = '';
                triggerAdminAccess();
            }
        });

        // Mobile : 5 taps sur le nom dans le pied de page
        const brand = document.querySelector('.footer-brand h3');
        if (brand) {
            let taps = 0, timer = null;
            brand.style.cursor = 'default';
            brand.addEventListener('click', () => {
                taps++;
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => { taps = 0; }, 2500);
                if (taps >= 5) {
                    taps = 0;
                    triggerAdminAccess();
                }
            });
        }
    }

    // ============ INITIALISATION ============
    function init() {
        snapshotAll();
        if (GRID_SNAPSHOTS.length === 0) return; // pas de grille de projets sur cette page

        if (isAuthed()) adminModeActive = true;
        render();
        if (adminModeActive) buildToolbar();

        initSecretTriggers();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ===================================================================
// CHANGER LE MOT DE PASSE
// ===================================================================
// 1. Ouvrez la console du navigateur (F12) sur n'importe quelle page.
// 2. Tapez ce code en remplaçant "MonNouveauMotDePasse" par votre choix :
//
//    crypto.subtle.digest('SHA-256', new TextEncoder().encode('MonNouveauMotDePasse'))
//      .then(buf => console.log(Array.from(new Uint8Array(buf))
//      .map(b => b.toString(16).padStart(2,'0')).join('')));
//
// 3. Copiez le résultat affiché (une longue chaîne de lettres/chiffres).
// 4. Collez-le dans ce fichier, tout en haut, à la place de la valeur
//    de PASSWORD_HASH.
// ===================================================================
