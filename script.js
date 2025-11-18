// Dati completi per ogni scenario di performance
const performanceData = {
    high: {
        status: 'Ottimale',
        kpi_finanziaria: '-4.8%',
        kpi_clienti: '+21.5%',
        kpi_interni: '45.0%',
        kpi_apprendimento: '1.550',
        color: '#48bb78', // Verde (Successo)
        bg: '#e6fffa', // Sfondo chiaro
        message: 'Performance ECCELLENTE. La strategia ESG sta generando valore: il CPS è ridotto e la domanda di prodotti sostenibili è in forte crescita.',
        flotta_prop: 0.74, 
    },
    medium: {
        status: 'Attenzione',
        kpi_finanziaria: '-2.5%',
        kpi_clienti: '+18.0%',
        kpi_interni: '35.0%', 
        kpi_apprendimento: '1.200',
        color: '#f6ad55', // Giallo Ambra (Warning)
        bg: '#fff5f5', 
        message: 'Performance a ATTENZIONE. I KPI di processo (Logistica Elettrica) sono in ritardo, limitando la piena riduzione del CPS. Necessario accelerare le iniziative.',
        flotta_prop: (90/125), // 90M su 125M totale speso
    },
    low: {
        status: 'Critico',
        kpi_finanziaria: '+1.2%',
        kpi_clienti: '+5.0%',
        kpi_interni: '20.0%',
        kpi_apprendimento: '500',
        color: '#e53e3e', // Rosso (Critico)
        bg: '#fff5f5',
        message: 'Performance CRITICA. La strategia è inefficace: i costi aumentano e l\'adozione sostenibile è bassa. Rivedere urgentemente l\'allocazione del Budget, che risulta sottoutilizzato.',
        flotta_prop: (70/100), // 70M su 100M totale speso
    }
};

const total_budget = 135; 
const marketing_percent = 20 / total_budget; 
const formazione_percent = 10 / total_budget; 
const routing_percent = 5 / total_budget; 

const budgetColors = {
    flotta: '#48bb78', // Verde ESG
    marketing: '#ff9900', // Arancione Amazon
    formazione: '#4299e1', // Blu (Investimento HR)
    routing: '#9f7aea' // Viola (Tech/Algoritmi)
};

/**
 * Calcola e restituisce la stringa conic-gradient per il Doughnut Chart.
 * La proporzione della Flotta è dinamica.
 */
function getDoughnutGradient(flotta_prop_ratio) {
    const total_speso = 100 / total_budget; // Base per il calcolo delle proporzioni fisse
    
    // Ricalcoliamo le percentuali in base al budget corrente speso (non 135M)
    // Usiamo flotta_prop_ratio per calcolare la porzione di flotta nel gradiente
    
    const flotta_portion = flotta_prop_ratio * 360; 
    const marketing_portion = marketing_percent * 360; 
    const formazione_portion = formazione_percent * 360; 
    const routing_portion = routing_percent * 360; 
    
    // Per semplicità visiva, usiamo le proporzioni sul 360, ma la legenda riflette la spesa
    // Aggustiamo i punti di partenza
    const start_marketing = flotta_portion;
    const start_formazione = start_marketing + marketing_portion;
    const start_routing = start_formazione + formazione_portion;

    return `conic-gradient(
        ${budgetColors.flotta} 0deg ${flotta_portion}deg,
        ${budgetColors.marketing} ${flotta_portion}deg ${start_formazione}deg,
        ${budgetColors.formazione} ${start_formazione}deg ${start_routing}deg,
        ${budgetColors.routing} ${start_routing}deg 360deg
    )`;
}

function updateDashboard() {
    const level = document.getElementById('performance-level').value;
    const data = performanceData[level];
    
    if (!data) return;

    // 1. Aggiorna i KPI Dettagliati (Valori, Colori, Bordi)
    const kpi_elements = [
        { id: 'finanziaria', value: data.kpi_finanziaria, target_val: '-5.0%' },
        { id: 'clienti', value: data.kpi_clienti, target_val: '+20.0%' },
        { id: 'interni', value: data.kpi_interni, target_val: '50.0%' },
        { id: 'apprendimento', value: data.kpi_apprendimento, target_val: '1.500' },
    ];

    kpi_elements.forEach(kpi => {
        const card = document.getElementById(`kpi-${kpi.id}`);
        const indicator = document.getElementById(`ind-${kpi.id}`);
        
        // Bordo in alto colorato
        card.style.borderTop = `5px solid ${data.color}`;
        
        indicator.querySelector('.status-text').textContent = data.status;
        indicator.style.backgroundColor = data.color;
        indicator.style.color = 'white'; 
        
        document.querySelector(`#kpi-${kpi.id} .kpi-value`).innerHTML = `${kpi.value}`;
        document.querySelector(`#kpi-${kpi.id} p`).textContent = `Target: ${kpi.target_val}`;
    });

    // 2. Aggiorna il Messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.bg;
    impactMessage.style.color = data.color;
    impactMessage.style.border = `1px solid ${data.color}`;

    // 3. Aggiorna la Visualizzazione del Budget (Doughnut Chart)
    const budget_text = (level === 'high') ? '€135M (Completamente Allineato)' :
                        (level === 'medium') ? '€125M (Ritardo Flotta -10M)' :
                        '€100M (Critico -35M non spesi)';
                        
    document.getElementById('budget-status').innerHTML = `Budget di Progetto: **${budget_text}**`;
    
    const doughnutChart = document.getElementById('doughnut-chart');
    
    // Calcoliamo la spesa dinamica totale per la legenda
    let current_total_budget = total_budget;
    if (level === 'medium') current_total_budget = 125;
    if (level === 'low') current_total_budget = 100;

    const flotta_spesa = Math.round(data.flotta_prop * current_total_budget); // Spesa in M
    
    const gradientString = getDoughnutGradient(data.flotta_prop);
    doughnutChart.style.background = gradientString;
    
    // Aggiornamento della Legenda
    const legendHtml = `
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.flotta};"></span> Flotta Elettrica (€${flotta_spesa}M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.marketing};"></span> Marketing (€20M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.formazione};"></span> Formazione (€10M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.routing};"></span> Routing (€5M)</div>
    `;
    let legendContainer = document.querySelector('.chart-legend');
    if (!legendContainer) {
        // Se la legenda non esiste, la creiamo (dovrebbe esistere in V3)
    }
    legendContainer.innerHTML = legendHtml;
}

document.addEventListener('DOMContentLoaded', updateDashboard);
