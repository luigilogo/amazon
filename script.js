// Dati completi per ogni scenario di performance (mantenuti dalla V2 per coerenza)
const performanceData = {
    high: {
        status: 'Ottimale',
        kpi_finanziaria: '-4.8%',
        kpi_clienti: '+21.5%',
        kpi_interni: '45.0%',
        kpi_apprendimento: '1.550',
        color: '#48bb78', // Verde ESG
        bg: '#27373f', 
        message: 'Performance OTTİMALE: l\'esecuzione delle iniziative ESG (Flotta e Formazione) sta riducendo il Costo per Spedizione (CPS) e stimolando la domanda sostenibile. Budget completamente allineato.',
        budget_status: 'Budget allineato: €135M',
        flotta_prop: 0.74, // 100M su 135M
    },
    medium: {
        status: 'Attenzione',
        kpi_finanziaria: '-2.5%',
        kpi_clienti: '+18.0%',
        kpi_interni: '35.0%', 
        kpi_apprendimento: '1.200',
        color: '#f6ad55', // Giallo Ambra
        bg: '#3c3527', 
        message: 'Performance a ATTENZIONE: il ritardo nell\'implementazione della logistica Elettrica (Interni) sta limitando la riduzione del CPS. Budget parzialmente bloccato (Flotta).',
        budget_status: 'Budget bloccato: €125M (Flotta -10M)',
        flotta_prop: (90/125), // 90M su 125M totale speso
    },
    low: {
        status: 'Critico',
        kpi_finanziaria: '+1.2%',
        kpi_clienti: '+5.0%',
        kpi_interni: '20.0%',
        kpi_apprendimento: '500',
        color: '#f56565', // Rosso
        bg: '#3f2727',
        message: 'Performance CRITICA: Fallimento nell\'esecuzione della strategia ESG. Il CPS è in aumento. Rivedere urgentemente l\'allocazione del Budget, che risulta sottoutilizzato.',
        budget_status: 'Budget sottoutilizzato: €100M (Flotta -30M)',
        flotta_prop: (70/100), // 70M su 100M totale speso
    }
};

const total_budget = 135; // Budget totale teorico
const marketing_percent = 20 / total_budget; // 14.8%
const formazione_percent = 10 / total_budget; // 7.4%
const routing_percent = 5 / total_budget; // 3.7%

/**
 * Calcola e restituisce la stringa conic-gradient per il Doughnut Chart.
 * La proporzione della Flotta è dinamica. Le altre sono fisse (20M, 10M, 5M).
 */
function getDoughnutGradient(flotta_prop) {
    // Proporzioni fisse (in gradi da 0 a 360)
    const start_marketing = flotta_prop * 360;
    const start_formazione = start_marketing + (marketing_percent * 360);
    const start_routing = start_formazione + (formazione_percent * 360);

    // Colori
    const flotta_color = '#48bb78'; // Verde (Iniziativa più importante)
    const marketing_color = '#ff9900'; // Arancione
    const formazione_color = '#9f7aea'; // Viola
    const routing_color = '#4299e1'; // Blu

    // Costruzione del gradiente
    return `conic-gradient(
        ${flotta_color} 0deg ${start_marketing}deg,
        ${marketing_color} ${start_marketing}deg ${start_formazione}deg,
        ${formazione_color} ${start_formazione}deg ${start_routing}deg,
        ${routing_color} ${start_routing}deg 360deg
    )`;
}

function updateDashboard() {
    const level = document.getElementById('performance-level').value;
    const data = performanceData[level];
    
    if (!data) return;

    // 1. Aggiorna i KPI Dettagliati (Valori, Colori, Bordi)
    const kpi_elements = [
        { id: 'finanziaria', value: data.kpi_finanziaria, name: 'Costo per Spedizione (CPS)' },
        { id: 'clienti', value: data.kpi_clienti, name: 'Tasso Acquisto Prodotti Sostenibili' },
        { id: 'interni', value: data.kpi_interni, name: 'Logistica Ultimo Miglio Elettrica' },
        { id: 'apprendimento', value: data.kpi_apprendimento, name: 'Dipendenti Certificati Green Tech' },
    ];

    kpi_elements.forEach(kpi => {
        const card = document.getElementById(`kpi-${kpi.id}`);
        const indicator = document.getElementById(`ind-${kpi.id}`);
        
        card.style.borderBottom = `5px solid ${data.color}`;
        
        indicator.querySelector('.status-text').textContent = `Stato: ${data.status}`;
        indicator.style.backgroundColor = data.color;
        indicator.style.color = '#1a202c'; // Testo scuro per leggibilità su sfondo colorato
        
        document.querySelector(`#kpi-${kpi.id} .kpi-value`).innerHTML = `Valore Attuale: **${kpi.value}**`;
    });

    // 2. Aggiorna il Messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.bg;
    impactMessage.style.color = data.color;
    impactMessage.style.border = `1px solid ${data.color}`;

    // 3. Aggiorna la Visualizzazione del Budget (Doughnut Chart)
    document.getElementById('budget-status').innerHTML = `Status Budget: ${data.budget_status}`;
    
    const doughnutChart = document.getElementById('doughnut-chart');
    const gradientString = getDoughnutGradient(data.flotta_prop);
    doughnutChart.style.background = gradientString;
    
    // Aggiornamento della Legenda (per chiarezza)
    const legendHtml = `
        <div class="legend-item"><span class="legend-color" style="background-color: ${performanceData.high.color};"></span> Flotta Elettrica (${~~(data.flotta_prop * 100)}%)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${performanceData.medium.color};"></span> Marketing (15%)</div>
        <div class="legend-item"><span class="legend-color" style="background-color: ${performanceData.low.color};"></span> Formazione (7%)</div>
    `;
    let legendContainer = document.querySelector('.chart-legend');
    if (!legendContainer) {
        legendContainer = document.createElement('div');
        legendContainer.className = 'chart-legend';
        document.querySelector('.chart-container').insertAdjacentElement('afterend', legendContainer);
    }
    legendContainer.innerHTML = legendHtml;
}

document.addEventListener('DOMContentLoaded', updateDashboard);
