document.addEventListener("DOMContentLoaded", function() {
    const isSubPage = window.location.pathname.includes('/pages/');
    const basePath = isSubPage ? '..' : '.';

    function loadComponent(selector, filePath) {
        const element = document.getElementById(selector);
        if (element) {
            fetch(filePath)
                .then(response => response.ok ? response.text() : Promise.reject('File tidak ditemukan'))
                .then(data => {
                    element.innerHTML = data;
                    if (selector === 'header-placeholder') {
                        updateLinks(element, basePath);
                        attachMobileMenuEvent();
                    }
                    if (selector === 'footer-placeholder') {
                        updateLinks(element, basePath);
                        updateCopyrightYear();
                    }
                })
                .catch(error => console.error(`Gagal memuat ${filePath}:`, error));
        }
    }

    loadComponent('header-placeholder', `${basePath}/components/header.html`);
    loadComponent('footer-placeholder', `${basePath}/components/footer.html`);

    function updateLinks(container, base) {
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            let href = link.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                if (base === '..') {
                    if (href === 'index.html') {
                        link.setAttribute('href', '../index.html');
                    } else {
                        // Link sudah benar (misal: 'kontak.html' di dalam folder 'pages')
                    }
                } else { // Berada di root (index.html)
                    if (href !== 'index.html') {
                        link.setAttribute('href', `pages/${href}`);
                    }
                }
            }
        });
    }

    function attachMobileMenuEvent() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        }
    }
    
    function updateCopyrightYear() {
        const yearSpan = document.getElementById('copyright-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    function loadMenuItems() {
        const menuGrid = document.getElementById('menu-grid');
        if (menuGrid) {
            fetch(`${basePath}/data/menu.json`)
                .then(response => response.json())
                .then(menuData => {
                    menuGrid.innerHTML = ''; 
                    menuData.forEach(item => {
                        const menuCardHTML = `
                            <div class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 relative">
                                ${item.badge ? `<span class="absolute top-0 right-0 ${item.badge.warna} text-white text-xs font-bold px-3 py-1 rounded-bl-lg">${item.badge.teks}</span>` : ''}
                                <img src="${basePath}/assets/img/${item.gambar}" alt="${item.nama}" class="w-full h-56 object-cover">
                                <div class="p-6">
                                    <h3 class="text-2xl font-bold font-poppins">${item.nama}</h3>
                                    <p class="mt-2 text-gray-600">${item.deskripsi}</p>
                                </div>
                            </div>
                        `;
                        menuGrid.innerHTML += menuCardHTML;
                    });
                })
                .catch(error => {
                    console.error('Error memuat data menu:', error);
                    menuGrid.innerHTML = '<p>Gagal memuat menu. Silakan coba lagi nanti.</p>';
                });
        }
    }

    loadMenuItems();
});