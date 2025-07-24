
// Variables globales
let currentUser = null;
let currentLoan = null;
let loanChart = null;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si un utilisateur est connecté
    checkAuthState();
    
    // Gestion du scroll pour le header
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Gestion des liens de navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            scrollToSection(target);
        });
    });

    // Animation des éléments au scroll
    observeElements();
});

// Fonctions de navigation
function scrollToCalculator() {
    scrollToSection('calculator');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.getElementById('header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Observer pour les animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    // Observer les éléments à animer
    document.querySelectorAll('.feature-card, .result-card, .loan-card').forEach(el => {
        observer.observe(el);
    });

    function scrollToCalculator() {
    const calculatorSection = document.getElementById("calculator");
    if (calculatorSection) {
        calculatorSection.scrollIntoView({ behavior: "smooth" });
    }
}





}

// Fonctions utilitaires
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

// Gestion des erreurs
function showError(message) {
    // Créer une notification d'erreur
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Ajouter les styles dynamiquement
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #fee;
        color: #c53030;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #c53030;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function showSuccess(message) {
    // Créer une notification de succès
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #f0fff4;
        color: #22543d;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #22543d;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Ajouter les keyframes CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Gestion du responsive
function handleResize() {
    // Ajuster le graphique si nécessaire
    if (loanChart) {
        loanChart.resize();
    }
}

window.addEventListener('resize', handleResize);

// Fonctions d'export pour d'autres modules
window.appUtils = {
    formatCurrency,
    formatNumber,
    showError,
    showSuccess,
    scrollToSection
};

function afficherPrets(userName) {
    const loansGrid = document.getElementById("loansGrid");
    loansGrid.innerHTML = "";

    const storedLoans = JSON.parse(localStorage.getItem(userName + "_loans")) || [];

    if (storedLoans.length === 0) {
        loansGrid.innerHTML = "<p>Aucun prêt sauvegardé pour l'instant.</p>";
        return;
    }

    storedLoans.forEach((loan, index) => {
        const card = document.createElement("div");
        card.classList.add("loan-card");
        card.innerHTML = `
            <h4>Prêt #${index + 1} - ${loan.date}</h4>
            <p><strong>Montant :</strong> ${loan.montant} €</p>
            <p><strong>Taux :</strong> ${loan.taux} %</p>
            <p><strong>Durée :</strong> ${loan.duree} ans</p>
            <p><strong>Mensualité :</strong> ${loan.mensualite}</p>
            <p><strong>Total remboursé :</strong> ${loan.total}</p>
            <p><strong>Intérêts :</strong> ${loan.interets}</p>
        `;
        loansGrid.appendChild(card);
    });
}


