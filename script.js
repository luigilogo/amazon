// Costanti e Colori (Palette Corporate)
const total_budget = 135; // Budget totale teorico in milioni

const budgetColors = {
    flotta: '#4caf50', // Verde scuro per ESG
    marketing: '#ff9900', // Arancione Amazon
    formazione: '#007bff', // Blu Corporate
    routing: '#9c27b0' // Viola Tech
};

const performanceData = {
    high: {
        status: 'OTTIMALE',
        kpi_finanziaria: '-4.8%', kpi_clienti: '+21.5%', kpi_interni: '45.0%', kpi_apprendimento: '1.550',
        color: '#4caf50', // Verde Successo
        bg: '#e8f5e9',
        message: 'Performance OTTIMALE. Budget pienamente allocato e allineato. Il successo nelle iniziative ESG (Processi e Crescita) ha generato una riduzione dei costi (CPS).',
        total_speso: 135,
        flotta_spesa: 100,
        alignment_score: 98,
    },
    medium: {
        status: 'ATTENZIONE',
        kpi_finanziaria: '-2.5%', kpi_clienti: '+18.0%', kpi_interni: '35.0%', kpi_apprendimento: '1.200',
        color: '#ffc107', // Giallo Warning
        bg: '#fff8e1',
        message: 'Performance in ATTENZIONE. La spesa per Flotta Elettrica è in ritardo (-€10M). La logistica (Processi Interni) non raggiunge il target, limitando l\'impatto sul CPS.',
        total_speso: 125,
        flotta_spesa: 90,
        alignment_score: 75,
    },
    low: {
        status: 'CRITICO',
        kpi_finanziaria: '+1.2%', kpi_clienti: '+5.0%', kpi_interni: '20.0%', kpi_apprendimento: '500',
        color: '#e53935', // Rosso Critico
        bg: '#fbe9e7',
        message: 'Performance CRITICA. Budget sottoutilizzato (-€35M). Il mancato allineamento ha causato il fallimento di tutti gli obiettivi BSC, portando ad un aumento dei costi (CPS).',
        total_speso: 100,
        flotta_spesa: 70,
        alignment_score: 40,
    }
};

/**
 * Calcola e restituisce la stringa conic-gradient.
 */
function getDoughnutGradient(total_speso, flotta_spesa) {
    const marketing_spesa = 20;
    const formazione_spesa = 10;
    const routing_spesa = 5;

    // Calcolo delle proporzioni (dal totale speso)
    const flotta_prop = flotta_spesa / total_speso; 
    const marketing_prop = marketing_spesa / total_speso;
    const formazione_prop = formazione_spesa / total_speso;
    const routing_prop = routing_spesa / total_speso;

    // Punti di inizio (in gradi)
    const start_marketing = flotta_prop * 360;
    const start_formazione = start_marketing + (marketing_prop * 360);
    const start_routing = start_formazione + (formazione_prop * 360);

    return `conic-gradient(
        ${budgetColors.flotta} 0deg ${start_marketing}deg,
        ${budgetColors.marketing} ${start_marketing}deg ${start_formazione}deg,
        ${budgetColors.formazione} ${start_formazione}deg ${start_routing}deg,
        ${budgetColors.routing} ${start_routing}deg 360deg
    )`;
}

function updateDashboard() {
    const level = document.getElementById('performance-level').value;
    const data = performanceData[level];
    
    if (!data) return;

    // 1. Aggiorna lo Score di Allineamento
    const scoreBox = document.getElementById('alignment-score');
    scoreBox.textContent = `${data.alignment_score}%`;
    scoreBox.style.color = data.color;
    // La scala di colori per il punteggio (verde->giallo->rosso)
    if (data.alignment_score < 50) {
        scoreBox.style.color = performanceData.low.color;
    } else if (data.alignment_score < 80) {
        scoreBox.style.color = performanceData.medium.color;
    } else {
        scoreBox.style.color = performanceData.high.color;
    }


    // 2. Aggiorna i KPI Dettagliati
    const kpi_elements = [
        { id: 'finanziaria', value: data.kpi_finanziaria, target_val: 'Riduzione -5%' },
        { id: 'clienti', value: data.kpi_clienti, target_val: 'Aumento +20%' },
        { id: 'interni', value: data.kpi_interni, target_val: 'Target 50%' },
        { id: 'apprendimento', value: data.kpi_apprendimento, target_val: 'Target 1.500' },
    ];

    kpi_elements.forEach(kpi => {
        const card = document.getElementById(`kpi-${kpi.id}`);
        const indicator = document.getElementById(`ind-${kpi.id}`);
        
        // Linea di stato superiore dinamica
        card.style.borderTop = `4px solid ${data.color}`;
        
        indicator.style.backgroundColor = data.color;
        
        document.querySelector(`#kpi-${kpi.id} .kpi-value`).textContent = kpi.value;
        document.querySelector(`#kpi-${kpi.id} .kpi-target`).textContent = `Target: ${kpi.target_val}`;
    });

    // 3. Aggiorna il Messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.bg;
    impactMessage.style.color = data.color;
    impactMessage.style.border = `1px solid ${data.color}`;

    // 4. Aggiorna la Visualizzazione del Budget (Doughnut Chart)
    const budget_text = `Spesa Attuale: €${data.total_speso}M (Allocato: €${total_budget}M)`;
                        
    document.getElementById('budget-status').innerHTML = `**${budget_text}**`;
    
    const doughnutChart = document.getElementById('doughnut-chart');
    const gradientString = getDoughnutGradient(data.total_speso, data.flotta_spesa);
    doughnutChart.style.background = gradientString;
    
    // Aggiornamento della Legenda
    const legendHtml = `
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.flotta};"></span> Flotta Elettrica (€${data.flotta_spesa}M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.marketing};"></span> Marketing Sostenibile (€20M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.formazione};"></span> Formazione Green (€10M)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${budgetColors.routing};"></span> Routing Algoritmi (€5M)</div>
    `;
    document.querySelector('.chart-legend').innerHTML = legendHtml;
}

document.addEventListener('DOMContentLoaded', updateDashboard);
