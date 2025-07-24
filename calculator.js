let currentCalculation = null;
let loanChart = null;

// ✅ Fonction pour formater les montants en FCFA
function formatCurrency(value) {
    return value.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF'
    });
}

// Fonction principale de calcul
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const term = parseFloat(document.getElementById('loanTerm').value);

    if (!validateInputs(amount, rate, term)) return;

    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;

    const monthlyPayment = rate === 0
        ? amount / numPayments
        : amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
          (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - amount;

    currentCalculation = {
        amount,
        rate,
        term,
        monthlyPayment,
        totalPayment,
        totalInterest,
        timestamp: new Date()
    };

    displayResults(monthlyPayment, totalPayment, totalInterest);
    createChart(amount, totalInterest);
    document.getElementById("monthlyPayment").innerText = formatCurrency(monthlyPayment);

    if (currentUser) {
        document.getElementById('saveLoanBtn').style.display = 'block';
    }
}

function validateInputs(amount, rate, term) {
    if (isNaN(amount) || amount <= 0) return alert('Montant invalide');
    if (isNaN(rate) || rate < 0 || rate > 20) return alert('Taux invalide');
    if (isNaN(term) || term <= 0 || term > 40) return alert('Durée invalide');
    if (amount > 1000000) return alert('Montant max 1 000 000 FCFA');
    return true;
}

function displayResults(monthly, total, interest) {
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthly);
    document.getElementById('totalPayment').textContent = formatCurrency(total);
    document.getElementById('totalInterest').textContent = formatCurrency(interest);

    document.getElementById('resultsCard').style.display = 'block';
    document.getElementById('chartContainer').style.display = 'block';
}

function createChart(principal, interest) {
    const ctx = document.getElementById('loanChart').getContext('2d');

    if (loanChart) loanChart.destroy();

    loanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Capital', 'Interest'],
            datasets: [{
                data: [principal, interest],
                backgroundColor: ['#06d6a0', '#6366f1'],
                borderColor: ['#05c49a', '#5855eb'],
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percent = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percent}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });

    document.getElementById('loanChart').style.height = '300px';
}

function saveLoan() {
    if (!currentUser) return alert('Vous devez être connecté');
    if (!currentCalculation) return alert('Aucun calcul à sauvegarder');

    const loanName = prompt('Nom du prêt :', `Prêt ${formatCurrency(currentCalculation.amount)}`);
    if (!loanName) return;

    const loan = {
        id: generateId(),
        name: loanName,
        ...currentCalculation,
        paidMonths: 0,
        totalMonths: currentCalculation.term * 12,
        createdAt: new Date(),
        userId: currentUser.id
    };

    let savedLoans = JSON.parse(localStorage.getItem('userLoans') || '[]');
    savedLoans.push(loan);
    localStorage.setItem('userLoans', JSON.stringify(savedLoans));

    alert(`Prêt "${loanName}" sauvegardé avec succès !`);
    loadUserLoans();
}

function resetCalculator() {
    document.getElementById('loanAmount').value = "";
    document.getElementById('interestRate').value = "";
    document.getElementById('loanTerm').value = "";

    document.getElementById('resultsCard').style.display = "none";
    document.getElementById('chartContainer').style.display = "none";
    document.getElementById('saveLoanBtn').style.display = "none";

    document.getElementById('monthlyPayment').innerText = "0 FCFA";
    document.getElementById('totalPayment').innerText = "0 FCFA";
    document.getElementById('totalInterest').innerText = "0 FCFA";

    if (loanChart) loanChart.destroy();
    loanChart = null;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function scrollToCalculator() {
    const el = document.getElementById("calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}
