// Dati completi per ogni scenario di performance
const performanceData = {
    high: {
        status: 'Ottimale',
        kpi_finanziaria: '-4.8%',
        kpi_clienti: '+21.5%',
        kpi_interni: '45.0%',
        kpi_apprendimento: '1.550',
        color: '#4caf50', // Verde
        bg: '#e8f5e9',
        message: 'Performance ottimale: l\'esecuzione delle iniziative ESG (Flotta e Formazione) sta riducendo il Costo per Spedizione (CPS) e stimolando la domanda di prodotti sostenibili.',
        budget_status: '**€135M** (Completamente Allineato alla Strategia)',
        bar_flotta_height: '100%',
        bar_flotta_text: 'Flotta Elettrica (€100M)',
    },
    medium: {
        status: 'Attenzione',
        kpi_finanziaria: '-2.5%', // Vicino al target (-5%) ma non ottimale
        kpi_clienti: '+18.0%', // Vicino al target (+20%)
        kpi_interni: '35.0%', // Lontano dal target (50%) - Processo in ritardo
        kpi_apprendimento: '1.200',
        color: '#ffc107', // Giallo
        bg: '#fffde7',
        message: 'Performance a rischio: il ritardo nell\'implementazione della logistica Elettrica (Interni) sta limitando la riduzione del CPS. Intervento urgente sui Processi.',
        budget_status: '**€125M** (10M non spesi, ritardo iniziative)',
        bar_flotta_height: '90%', // Simulazione: 10M non spesi in Flotta
        bar_flotta_text: 'Flotta Elettrica (€90M)',
    },
    low: {
        status: 'Critico',
        kpi_finanziaria: '+1.2%', // Aumento del costo (effetto negativo)
        kpi_clienti: '+5.0%',
        kpi_interni: '20.0%',
        kpi_apprendimento: '500',
        color: '#f44336', // Rosso
        bg: '#fbe9e7',
        message: 'Performance critica: Fallimento nell\'esecuzione della strategia ESG. Il CPS è in aumento a causa della mancanza di investimenti in Flotta e Formazione. Rivedere l\'allocazione del Budget.',
        budget_status: '**€100M** (35M bloccati o non spesi)',
        bar_flotta_height: '70%', // Simulazione: 30M non spesi in Flotta
        bar_flotta_text: 'Flotta Elettrica (€70M - CRITICO)',
    }
};

/**
 * Funzione per aggiornare l'intera dashboard in base allo scenario selezionato.
 */
function updateDashboard() {
    const level = document.getElementById('performance-level').value;
    const data = performanceData[level];
    
    if (!data) return;

    // 1. Aggiorna i KPI Dettagliati
    const kpi_elements = {
        'finanziaria': { value: data.kpi_finanziaria, target: '#ind-finanziaria', card: '#kpi-finanziaria' },
        'clienti': { value: data.kpi_clienti, target: '#ind-clienti', card: '#kpi-clienti' },
        'interni': { value: data.kpi_interni, target: '#ind-interni', card: '#kpi-interni' },
        'apprendimento': { value: data.kpi_apprendimento, target: '#ind-apprendimento', card: '#kpi-apprendimento' },
    };

    for (const key in kpi_elements) {
        const { value, target, card } = kpi_elements[key];
        
        // Aggiorna il valore numerico
        document.querySelector(`#kpi-${key} .kpi-value`).innerHTML = `Valore Attuale: **${value}**`;
        
        // Aggiorna l'indicatore di stato e colore
        const indicator = document.querySelector(target);
        indicator.querySelector('.status-text').textContent = `Stato: ${data.status}`;
        indicator.style.backgroundColor = data.color;
        
        // Aggiorna il bordo della card (per un impatto visivo ancora maggiore)
        document.querySelector(card).style.borderBottom = `5px solid ${data.color}`;
    }

    // 2. Aggiorna il Messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.bg;
    impactMessage.style.color = data.color;
    
    // 3. Aggiorna la Visualizzazione del Budget (Barra Flotta)
    document.getElementById('budget-status').innerHTML = `Status Budget: ${data.budget_status}`;
    document.getElementById('bar-flotta').style.height = data.bar_flotta_height;
    document.getElementById('bar-flotta').textContent = data.bar_flotta_text;

    // Colora anche la barra di Flotta in base allo stato
    document.getElementById('bar-flotta').style.backgroundColor = (level === 'low') ? '#d32f2f' : '#ff9800'; 
}

// Inizializza la dashboard al caricamento della pagina
document.addEventListener('DOMContentLoaded', updateDashboard);
