// Costanti e Colori (Più neon/digitali)
const total_budget = 135; // Budget totale teorico in milioni
const budgetColors = {
    flotta: '#66bb6a', // Verde (Successo)
    marketing: '#ff9900', // Arancione (Amazon Accento)
    formazione: '#42a5f5', // Blu (Investimento HR/Digital)
    routing: '#9f7aea' // Viola (Tech/Algoritmi)
};

const performanceData = {
    high: {
        status: 'OTTIMALE',
        kpi_finanziaria: '-4.8%', kpi_clienti: '+21.5%', kpi_interni: '45.0%', kpi_apprendimento: '1.550',
        color: '#66bb6a', // Verde Neon
        bg: 'rgba(102, 187, 106, 0.1)',
        message: 'Performance ECCELLENTE. La strategia ESG sta generando valore. Budget pienamente allocato e allineato. Il legame causa-effetto è confermato.',
        total_speso: 135,
        flotta_spesa: 100,
        alignment_score: 98,
    },
    medium: {
        status: 'ATTENZIONE',
        kpi_finanziaria: '-2.5%', kpi_clienti: '+18.0%', kpi_interni: '35.0%', kpi_apprendimento: '1.200',
        color: '#ffc107', // Giallo
        bg: 'rgba(255, 193, 7, 0.1)',
        message: 'Performance in ATTENZIONE. La spesa per Flotta Elettrica è in ritardo (-€10M) a causa di inefficienze nei Processi Interni. L\'allineamento è compromesso.',
        total_speso: 125,
        flotta_spesa: 90,
        alignment_score: 75,
    },
    low: {
        status: 'CRITICO',
        kpi_finanziaria: '+1.2%', kpi_clienti: '+5.0%', kpi_interni: '20.0%', kpi_apprendimento: '500',
        color: '#e53935', // Rosso
        bg: 'rgba(229, 57, 53, 0.1)',
        message: 'Performance CRITICA. La mancanza di allineamento del Budget (-€35M non spesi) ha causato il fallimento di tutti gli obiettivi BSC, portando ad un aumento dei costi (CPS).',
        total_speso: 100,
        flotta_spesa: 70,
        alignment_score: 40,
    }
};

/**
 * Calcola e restituisce la stringa conic-gradient.
 */
function getDoughnutGradient(total_speso, flotta_spesa) {
    const spesa_altre_voci = 35; // Marketing (20) + Formazione (10) + Routing (5)

    // Calcolo delle proporzioni in base alla spesa ATTUALE (total_speso)
    const flotta_prop = flotta_spesa / total_speso; 
    const marketing_prop = 20 / total_speso;
    const formazione_prop = 10 / total_speso;
    const routing_prop = 5 / total_speso;

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

    // Funzione helper per l'effetto neon sui punteggi
    const getNeonShadow = (color) => `0 0 10px ${color}, 0 0 20px ${color}`;

    // 1. Aggiorna lo Score di Allineamento (IMPATTO)
    const scoreBox = document.getElementById('alignment-score');
    scoreBox.textContent = `${data.alignment_score}%`;
    scoreBox.style.color = data.color;
    scoreBox.style.textShadow = getNeonShadow(data.color);

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
        indicator.style.color = '#10151c'; // Testo scuro
        indicator.querySelector('.kpi-value').textContent = kpi.value;
        indicator.style.boxShadow = getNeonShadow(data.color);
        
        document.querySelector(`#kpi-${kpi.id} .kpi-target`).textContent = `Target: ${kpi.target_val}`;
    });

    // 3. Aggiorna il Messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.bg;
    impactMessage.style.color = data.color;
    impactMessage.style.border = `1px solid ${data.color}`;
    impactMessage.style.boxShadow = `0 0 8px ${data.color}40`; // Soft shadow per il messaggio

    // 4. Aggiorna la Visualizzazione del Budget (Doughnut Chart)
    const budget_text = `Budget Speso: €${data.total_speso}M (su €${total_budget}M Allocati)`;
                        
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
