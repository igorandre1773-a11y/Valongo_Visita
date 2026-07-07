const galeria = document.querySelector('.galeria');

if (galeria && Array.isArray(conteudos)) {
    conteudos.forEach(function (item) {
        const article = document.createElement('article');
        article.classList.add('gallery-item');
        article.innerHTML = `
            <div class="imagem">
                <img src="${item.imagem}" alt="${item.título}">
            </div>
            <div class="caption">
                <h3>${item.título}</h3>
                <p><strong>Categoria:</strong> ${item.categoria}</p>
                <p>${item.descrição}</p>
                <p><strong>Local:</strong> ${item.local}</p>
                <button class="btn saiba-mais" 
                    data-title="${item.título}"
                    data-categoria="${item.categoria}"
                    data-descricao="${item.descrição}"
                    data-local="${item.local}"
                    data-imagem="${item.imagem}"
                    data-link="${item.link}">
                    Saiba mais
                </button>
            </div>
        `;
        galeria.appendChild(article);
    });
} else {
    console.warn('Elemento .galeria não encontrado ou array conteudos inválido.');
}

// Modal 'Saiba mais' functionality for sobre.html
function initSaibaMais() {
    const modal = document.getElementById('modal');
    if (!modal) return;
    const modalBody = modal.querySelector('.modal-body');
    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');

    // Build gallery items from buttons that have data-title (gallery)
    const galleryButtons = Array.from(document.querySelectorAll('.saiba-mais[data-title]'));
    const galleryItems = galleryButtons.map(btn => ({
        title: btn.dataset.title || '',
        categoria: btn.dataset.categoria || '',
        descricao: btn.dataset.descricao || '',
        local: btn.dataset.local || '',
        imagem: btn.dataset.imagem || '',
        link: btn.dataset.link || ''
    }));

    let currentIndex = -1;

    function renderGalleryItem(index) {
        const item = galleryItems[index];
        if (!item) return;
        const html = `
            <div class="modal-gallery">
                ${item.imagem ? `<img src="${item.imagem}" alt="${item.title}" class="modal-image">` : ''}
                <div class="modal-info">
                    <h3>${item.title}</h3>
                    <p><strong>Categoria:</strong> ${item.categoria}</p>
                    <p>${item.descricao}</p>
                    <p><strong>Local:</strong> ${item.local}</p>
                    ${item.link ? `<p><a href="${item.link}" class="btn" target="_blank" rel="noopener">Ver fonte</a></p>` : ''}
                    <p class="modal-index">${index + 1} / ${galleryItems.length}</p>
                </div>
            </div>
        `;
        modalBody.innerHTML = html;
        modal.setAttribute('aria-hidden', 'false');
        currentIndex = index;
        updateNavButtons();
        closeBtn.focus();
    }

    function openModal(html) {
        modalBody.innerHTML = html;
        modal.setAttribute('aria-hidden', 'false');
        closeBtn.focus();
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        modalBody.innerHTML = '';
        currentIndex = -1;
    }

    // Create prev/next buttons if not present
    let prevBtn = modalContent.querySelector('.modal-prev');
    let nextBtn = modalContent.querySelector('.modal-next');
    if (!prevBtn) {
        prevBtn = document.createElement('button');
        prevBtn.className = 'modal-prev';
        prevBtn.setAttribute('aria-label', 'Anterior');
        prevBtn.innerHTML = '‹';
        modalContent.appendChild(prevBtn);
    }
    if (!nextBtn) {
        nextBtn = document.createElement('button');
        nextBtn.className = 'modal-next';
        nextBtn.setAttribute('aria-label', 'Próximo');
        nextBtn.innerHTML = '›';
        modalContent.appendChild(nextBtn);
    }

    function updateNavButtons() {
        if (galleryItems.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        prevBtn.style.display = (currentIndex > 0) ? 'block' : 'none';
        nextBtn.style.display = (currentIndex < galleryItems.length - 1) ? 'block' : 'none';
    }

    prevBtn.addEventListener('click', function () {
        if (currentIndex > 0) renderGalleryItem(currentIndex - 1);
    });
    nextBtn.addEventListener('click', function () {
        if (currentIndex < galleryItems.length - 1) renderGalleryItem(currentIndex + 1);
    });

    document.querySelectorAll('.saiba-mais').forEach(function (btn) {
        btn.addEventListener('click', function () {
            // If button has data attributes (gallery), open the carousel at that index
            if (btn.dataset && btn.dataset.title) {
                const idx = galleryButtons.indexOf(btn);
                if (idx !== -1) {
                    renderGalleryItem(idx);
                    return;
                }
            }

            // Fallback: collect following nodes until next H2 (sobre.html sections)
            let el = btn.nextElementSibling;
            let html = '';
            while (el && el.tagName !== 'H2') {
                html += el.outerHTML;
                el = el.nextElementSibling;
            }
            if (!html) html = '<p>Sem conteúdo adicional.</p>';
            openModal(html);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
        if (e.key === 'ArrowLeft' && modal.getAttribute('aria-hidden') === 'false' && currentIndex > 0) renderGalleryItem(currentIndex - 1);
        if (e.key === 'ArrowRight' && modal.getAttribute('aria-hidden') === 'false' && currentIndex < galleryItems.length - 1) renderGalleryItem(currentIndex + 1);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSaibaMais);
} else {
    initSaibaMais();
}
