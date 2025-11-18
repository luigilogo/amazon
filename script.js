// Mappa dei colori e messaggi in base al livello di performance selezionato
const performanceData = {
    high: {
        color: { bg: '#c8e6c9', border: '#388e3c' }, // Verde
        message: 'Performance eccellente: i KPI mostrano un impatto positivo sui costi operativi e sull\'adozione ESG!',
        messageColor: { bg: '#e8f5e9', text: '#388e3c' }
    },
    medium: {
        color: { bg: '#ffecb3', border: '#ffc107' }, // Giallo
        message: 'Performance al limite del Target: è necessario un monitoraggio intensivo, soprattutto sui KPI di Processi Interni.',
        messageColor: { bg: '#fffde7', text: '#ffc107' }
    },
    low: {
        color: { bg: '#ffcdd2', border: '#e53935' }, // Rosso
        message: 'Performance sotto il Target: le iniziative chiave (Flotta Elettrica) sono in ritardo, impattando negativamente il Costo per Spedizione (CPS).',
        messageColor: { bg: '#fbe9e7', text: '#e53935' }
    }
};

/**
 * Funzione per aggiornare la dashboard in base al selettore di performance.
 * Questo genera l'effetto shock dinamico.
 */
function updateDashboard() {
    const level = document.getElementById('performance-level').value;
    const data = performanceData[level];
    
    if (!data) return;

    // 1. Aggiorna i colori della Mappa Strategica
    const perspectives = document.querySelectorAll('.perspective');
    perspectives.forEach(p => {
        p.style.backgroundColor = data.color.bg;
        p.style.borderLeft = `5px solid ${data.color.border}`;
    });

    // 2. Aggiorna il messaggio di Impatto Strategico
    const impactMessage = document.getElementById('impact-message');
    impactMessage.textContent = data.message;
    impactMessage.style.backgroundColor = data.messageColor.bg;
    impactMessage.style.color = data.messageColor.text;

    // 3. Esempio di visualizzazione Budget (Opzionale: potresti
    // cambiare l'altezza di una barra per mostrare dove è stato speso meno)
    // Esempio: Se LOW, simuliamo un basso investimento in Flotta (bar-flotta)
    if (level === 'low') {
        document.getElementById('bar-flotta').style.height = '70%'; // Simulazione: 30% del budget non speso
        document.getElementById('bar-flotta').textContent = 'Flotta Elettrica (Solo €70M)';
    } else {
        document.getElementById('bar-flotta').style.height = '100%';
        document.getElementById('bar-flotta').textContent = 'Flotta Elettrica (€100M)';
    }
}

// Inizializza la dashboard al caricamento della pagina con il valore di default ('high')
document.addEventListener('DOMContentLoaded', updateDashboard);
