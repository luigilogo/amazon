document.addEventListener('DOMContentLoaded', () => {
    const bscBody = document.getElementById('bsc-body');
    const semaforoSoglia = 0.9; // Soglia per il Giallo (90% del target)

    // Funzione principale per popolare la tabella
    function populateBSCTable(data) {
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;

        data.forEach(item => {
            const row = bscBody.insertRow();
            
            // 1. Calcolo dello Stato (Semaforo)
            let statoClasse = 'rosso';
            let statoIcona = '🔴 Rischio';
            
            // Per KPI dove *più alto è meglio* (es. Ricavi, NPS)
            if (item.kpi.includes('Crescita') || item.kpi.includes('NPS') || item.kpi.includes('Margine') || item.kpi.includes('Ore')) {
                if (item.attuale >= item.target) {
                    statoClasse = 'verde';
                    statoIcona = '🟢 In Target';
                } else if (item.attuale >= item.target * semaforoSoglia) {
                    statoClasse = 'giallo';
                    statoIcona = '🟡 Attenzione';
                }
            } 
            // Per KPI dove *più basso è meglio* (es. Churn, Tempo di Consegna, ODR, Turnover)
            else if (item.kpi.includes('Tasso di Abbandono') || item.kpi.includes('Tempo Medio') || item.kpi.includes('Ordini Difettosi') || item.kpi.includes('Turnover')) {
                 if (item.attuale <= item.target) {
                    statoClasse = 'verde';
                    statoIcona = '🟢 In Target';
                } else if (item.attuale <= item.target / semaforoSoglia) { // Ad esempio, non più del 111% del target
                    statoClasse = 'giallo';
                    statoIcona = '🟡 Attenzione';
                }
            }


            // 2. Aggiorna i contatori
            if (statoClasse === 'verde') greenCount++;
            else if (statoClasse === 'giallo') yellowCount++;
            else redCount++;
            
            // 3. Formattazione dei Valori
            const formatValue = (value, unit) => {
                if (unit === '%') return (value * 100).toFixed(2) + '%';
                if (unit === 'Punti' || unit === 'Ore') return value;
                return value.toFixed(2);
            };

            // 4. Inserimento delle celle nella riga
            row.innerHTML = `
                <td>${item.prospettiva}</td>
                <td>${item.obiettivo}</td>
                <td><strong>${item.kpi}</strong></td>
                <td>${formatValue(item.attuale, item.unita)}</td>
                <td>${formatValue(item.target, item.unita)}</td>
                <td><span class="semaforo ${statoClasse}">${statoIcona}</span></td>
                <td>${item.commenti}</td>
            `;
        });
        
        // Crea il grafico di riepilogo
        createSummaryChart(greenCount, yellowCount, redCount);
    }
    
    // Funzione per creare il grafico a torta/ciambella (Chart.js)
    function createSummaryChart(green, yellow, red) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['🟢 In Target', '🟡 Attenzione', '🔴 Rischio'],
                datasets: [{
                    data: [green, yellow, red],
                    backgroundColor: [
                        '#28a745', // Verde
                        '#ffc107', // Giallo
                        '#dc3545'  // Rosso
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Riepilogo Stato KPI (Totale: ' + bscData.length + ')'
                    }
                }
            }
        });
    }

    // Esegui la funzione con i dati caricati
    populateBSCTable(bscData);
});
