document.addEventListener('DOMContentLoaded', () => {
    const bscBody = document.getElementById('bsc-body');
    const semaforoSoglia = 0.9; // Soglia per il Giallo (90% del target)

    // Funzione principale per popolare la tabella
    function populateBSCTable(data) {
        let greenCount = 0;
        let yellowCount = 0;
        let redCount = 0;

        data.forEach(item => {
            
            // 1. Calcolo dello Stato (Semaforo)
            let statoClasse = 'rosso';
            let statoIcona = '🔴 Rischio';
            
            // Definisce se il KPI è "più alto è meglio" (HTB - Higher The Better)
            // o "più basso è meglio" (LTB - Lower The Better)
            const isHTB = !(item.kpi.includes('Tasso di Abbandono') || 
                            item.kpi.includes('Tempo Medio') || 
                            item.kpi.includes('Ordini Difettosi') || 
                            item.kpi.includes('Turnover'));

            if (isHTB) {
                // HTB: Verde se Attuale >= Target
                if (item.attuale >= item.target) {
                    statoClasse = 'verde';
                    statoIcona = '🟢 In Target';
                } else if (item.attuale >= item.target * semaforoSoglia) {
                    // Giallo se Attuale è almeno il 90% del Target
                    statoClasse = 'giallo';
                    statoIcona = '🟡 Attenzione';
                }
            } else {
                // LTB: Verde se Attuale <= Target
                if (item.attuale <= item.target) {
                    statoClasse = 'verde';
                    statoIcona = '🟢 In Target';
                } else if (item.attuale <= item.target / semaforoSoglia) { 
                    // Giallo se Attuale è al massimo il 111% del Target (1 / 0.9)
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
                // Se è un valore piccolo (come l'ODR), usa più decimali
                if (value < 0.1 && unit === '%') return (value * 100).toFixed(3) + '%';
                if (unit === '%') return (value * 100).toFixed(2) + '%';
                if (unit === 'Giorni' || unit === 'Punti' || unit === 'Ore') return value.toFixed(1);
                return value.toFixed(2);
            };

            // 4. Inserimento delle celle nella riga
            const row = bscBody.insertRow();
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
        
        // 5. Crea il grafico di riepilogo
        createSummaryChart(greenCount, yellowCount, redCount);
    }
    
    // Funzione per creare il grafico a ciambella (Chart.js)
    function createSummaryChart(green, yellow, red) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Verifica se ci sono dati da mostrare
        if (green + yellow + red === 0) {
            ctx.fillText("Nessun dato KPI disponibile.", 10, 50);
            return;
        }

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['🟢 In Target', '🟡 Attenzione', '🔴 Rischio'],
                datasets: [{
                    data: [green, yellow, red],
                    backgroundColor: [
                        '#28a745', 
                        '#ffc107', 
                        '#dc3545'  
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
                        text: 'Riepilogo Stato KPI (Totale: ' + bscData.length + ')',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    }

    // Esegui la funzione con i dati caricati
    populateBSCTable(bscData);
});
