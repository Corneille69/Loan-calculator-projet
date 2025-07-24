let currentUser = null;
let users = JSON.parse(localStorage.getItem('zenloan_users') || '[]');

// Vérifie l'état de connexion au chargement
document.addEventListener('DOMContentLoaded', function () {
    checkAuthState();

    document.getElementById('authModal').addEventListener('click', function (e) {
        if (e.target === this) closeAuth();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeAuth();
    });

    // Formulaires avec la touche Entrée
    document.getElementById('loginPassword').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') login();
    });

    document.getElementById('registerPassword').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') register();
    });
});

function showAuth() {
    document.getElementById("authModal").style.display = "block";
    showLogin();
    document.body.style.overflow = "hidden";
}

function closeAuth() {
    document.getElementById("authModal").style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("loginForm").reset();
    document.getElementById("registerForm").reset();
}

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    const tabs = document.querySelectorAll(".auth-tab");
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
}

function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    const tabs = document.querySelectorAll(".auth-tab");
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
}

function validateRegistration(name, email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2) return alert("Nom invalide !");
    if (!emailRegex.test(email)) return alert("Email invalide !");
    if (password.length < 6) return alert("Mot de passe trop court !");
    return true;
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function register() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    if (!validateRegistration(name, email, password)) return;

    if (users.find(u => u.email === email)) {
        alert("Un compte avec cet email existe déjà.");
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password: hashPassword(password)
    };

    users.push(newUser);
    localStorage.setItem("zenloan_users", JSON.stringify(users));
    localStorage.setItem("zenloan_current_user", JSON.stringify({ name, email }));

    currentUser = { name, email };
    alert("Compte créé avec succès !");
    closeAuth();
    updateAuthUI();
    afficherPrets(currentUser.name);
}

function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const user = users.find(u => u.email === email);
    if (!user) return alert("Email non trouvé !");
    if (user.password !== hashPassword(password)) return alert("Mot de passe incorrect !");

    currentUser = { name: user.name, email: user.email };
    localStorage.setItem("zenloan_current_user", JSON.stringify(currentUser));

    alert("Connexion réussie !");
    closeAuth();
    updateAuthUI();
    afficherPrets(currentUser.name);
}

function logout() {
    currentUser = null;
    localStorage.removeItem("zenloan_current_user");
    updateAuthUI();
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("home").style.display = "block";
    document.getElementById("calculator").style.display = "block";
    alert("Déconnexion réussie !");
}

function checkAuthState() {
    const saved = localStorage.getItem("zenloan_current_user");
    if (saved) {
        currentUser = JSON.parse(saved);
        updateAuthUI();
        afficherPrets(currentUser.name);
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById("authBtn");
    const dashboardLink = document.getElementById("dashboardLink");
    const userInfo = document.getElementById("userInfo");

    if (currentUser) {
        authBtn.textContent = "Se déconnecter";
        authBtn.onclick = logout;
        dashboardLink.style.display = "inline-block";
        userInfo.textContent = `Bonjour ${currentUser.name}`;
    } else {
        authBtn.textContent = "Se connecter";
        authBtn.onclick = showAuth;
        dashboardLink.style.display = "none";
        userInfo.textContent = "";
    }
}
