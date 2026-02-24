let currentLang = localStorage.getItem('selectedLang') || 'es';

// Aplicar idioma inicial
applyLanguage(currentLang);

const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        currentLang = lang;
        localStorage.setItem('selectedLang', lang);
        applyLanguage(lang);
    });
});

function applyLanguage(lang) {
    // Actualizar estado de los botones
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            el.innerHTML = window.translations[lang][key];
        }
    });

    // Actualizar atributo lang del HTML
    document.documentElement.lang = lang;
    injectDate();
}


window.addEventListener('scroll', reveal);

function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        } else {
            reveals[i].classList.remove('active');
        }
    }
}

// ---  LÓGICA DE LA FECHA  ---
function injectDate() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;

    const locale = document.documentElement.lang || 'es';
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    // Escribe la fecha en el idioma activo
    dateElement.textContent = new Intl.DateTimeFormat(locale, options).format(new Date());
}

// ---  MODAL DE PROYECTOS ---
function openModal(projectKey) {
    const modal = document.getElementById('mc-modal');
    if (!modal) return;

    const currentLang = document.documentElement.lang || 'es';
    const titleEl = document.getElementById('modal-title');
    const descEl = document.getElementById('modal-desc');
    const iconEl = document.getElementById('modal-icon');
    const linkEl = document.getElementById('modal-link');

    if (window.translations && window.translations[currentLang]) {
        const t = window.translations[currentLang];

        titleEl.textContent = t[projectKey + '_title'] || 'Project';
        descEl.textContent = t[projectKey + '_desc'] || 'Description...';
        linkEl.textContent = t[projectKey + '_btn'] || 'Ver Proyecto';

        const projectData = {
            'pa_p1': { 
                img: 'images/fotoProyecto.jpg', 
                url: 'https://github.com/kapustakstepan-dev/stepankapustiak.github.io/tree/main/NAVIDAD%20FINAL/NAVIDAD%20FINAL' 
            },
            'pa_p2': { 
                img: 'images/fotoTelefonica42.png', 
                url: 'https://www.42madrid.com/' 
            },
            'pa_p3': { 
                img: 'assets/img/proyecto3.png', 
                url: ' ' 
            }
        };

        const data = projectData[projectKey];
        if (data) {
            iconEl.innerHTML = `<img src="${data.img}" alt="Preview" style="width: 100%; border: 2px solid #000; box-shadow: 4px 4px 0 #000;">`;
            linkEl.href = data.url;
            linkEl.target = "_blank";
        }
    }
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('mc-modal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('mc-modal');
    const gameModal = document.getElementById('game-modal');
    if (event.target == modal) modal.style.display = "none";
    if (event.target == gameModal) closeGameModal();
};

let gameInstance = null;

function openGameModal() {
    const modal = document.getElementById('game-modal');
    if (!modal) return;
    modal.style.display = 'flex';

    if (!gameInstance) {
        gameInstance = new JuegoJS('flappyCanvas');
    } else {
        gameInstance.resize();
        gameInstance.reset();
        gameInstance.drawMessage("Click to Start");
    }
}

function closeGameModal() {
    const modal = document.getElementById('game-modal');
    if (modal) modal.style.display = 'none';
    if (gameInstance) {
        gameInstance.gameActive = false;
        gameInstance.reset();
    }
}
function copyToClipboard() {
    const letterContainer = document.querySelector('.letter-body');
    
    const textToCopy = letterContainer.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {

        const btn = document.querySelector('[data-i18n="cl_copy"]');
        const originalText = btn.innerText;
        
        btn.innerText = "¡Copiado!";
        btn.style.backgroundColor = "#76b400";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = ""; 
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
 
    });
}
