document.addEventListener('DOMContentLoaded', () => {
    const bscBody = document.getElementById('bsc-body');
    const semaforoSoglia = 0.9; 
    const filterSelect = document.getElementById('prospettiva-filter');
    let kpiStatus = []; // Array globale per il riepilogo

    // Funzione per calcolare lo stato (verde/giallo/rosso) per un singolo KPI
    function calculateKPIStatus(item) {
        let status = 'rosso';
        
        const isHTB = !(item.kpi.includes('Tasso di Abbandono') || 
                        item.kpi.includes('Tempo Medio') || 
                        item.kpi.includes('Ordini Difettosi') || 
                        item.kpi.includes('Turnover'));

        if (isHTB) {
            if (item.attuale >= item.target) {
                status = 'verde';
            } else if (item.attuale >= item.target * semaforoSoglia) {
                status = 'giallo';
            }
        } else {
            if (item.attuale <= item.target) {
                status = 'verde';
            } else if (item.attuale <= item.target / semaforoSoglia) {
                status = 'giallo';
            }
        }
        return status;
    }

    // Funzione principale per popolare la tabella e preparare i dati
    function populateBSCTable(data, filter) {
        bscBody.innerHTML = ''; // Pulisce il corpo della tabella per il filtro
        kpiStatus = []; // Resetta lo stato

        const filteredData = data.filter(item => filter === 'Tutti' || item.prospettiva === filter);

        filteredData.forEach(item => {
            const statusClass = calculateKPIStatus(item);
            let statoIcona = '';

            if (statusClass === 'verde') statoIcona = '🟢 In Target';
            else if (statusClass === 'giallo') statoIcona = '🟡 Attenzione';
            else statoIcona = '🔴 Rischio';
            
            // Aggiungi lo stato all'array di riepilogo
            kpiStatus.push({
                prospettiva: item.prospettiva,
                kpi: item.kpi,
                attuale: item.attuale,
                target: item.target,
                status: statusClass,
                isHTB: !(item.kpi.includes('Tasso di Abbandono') || item.kpi.includes('Tempo Medio') || item.kpi.includes('Ordini Difettosi') || item.kpi.includes('Turnover'))
            });
            
            // Formattazione
            const formatValue = (value, unit) => {
                if (value < 0.1 && unit === '%') return (value * 100).toFixed(3) + '%';
                if (unit === '%') return (value * 100).toFixed(2) + '%';
                if (unit === 'Giorni' || unit === 'Punti' || unit === 'Ore') return value.toFixed(1);
                return value.toFixed(2);
            };

            // Inserimento della riga
            const row = bscBody.insertRow();
            row.innerHTML = `
                <td>${item.prospettiva}</td>
                <td>${item.obiettivo}</td>
                <td><strong>${item.kpi}</strong></td>
                <td>${formatValue(item.attuale, item.unita)}</td>
                <td>${formatValue(item.target, item.unita)}</td>
                <td><span class="semaforo ${statusClass}">${statoIcona}</span></td>
                <td>${item.commenti}</td>
            `;
        });
        
        // Aggiorna il cruscotto e il grafico di confronto
        updateDashboardSummary(kpiStatus);
        createComparisonChart(kpiStatus);
    }
    
    // Funzione 1: Metriche di Alto Livello (Gauge)
    function updateDashboardSummary(statusData) {
        const totalKPI = statusData.length;
        const greenCount = statusData.filter(d => d.status === 'verde').length;
        const redCount = statusData.filter(d => d.status === 'rosso').length;
        const targetPercentage = totalKPI > 0 ? (greenCount / totalKPI * 100).toFixed(1) : 0;
        
        document.getElementById('kpi-total').innerHTML = `<h3>${totalKPI}</h3><p>KPI Totali Monitorati</p>`;
        document.getElementById('kpi-in-target').innerHTML = `<h3>${greenCount} (${targetPercentage}%)</h3><p>KPI In Target (Verde)</p>`;
        document.getElementById('kpi-at-risk').innerHTML = `<h3>${redCount}</h3><p>KPI A Rischio (Rosso)</p>`;
        
        // Calcolo di un indice di performance medio (semplificato)
        const avgScore = totalKPI > 0 ? (greenCount * 1 + statusData.filter(d => d.status === 'giallo').length * 0.5) / totalKPI : 0;
        document.getElementById('kpi-avg-score').innerHTML = `<h3>${(avgScore * 100).toFixed(0)}/100</h3><p>Indice di Performance BSC</p>`;
    }
    
    // Funzione 2: Grafico di Confronto Attuale vs Target (Barre)
    function createComparisonChart(statusData) {
        const ctx = document.getElementById('performanceComparisonChart');

        // Se Chart.js è già inizializzato, lo distrugge prima di ricrearlo (necessario per i filtri)
        if (window.myComparisonChart) {
            window.myComparisonChart.destroy();
        }
        
        // Dati normalizzati per il grafico (performance Attuale vs 100% Target)
        const labels = statusData.map(d => d.kpi);
        const currentPerformance = statusData.map(d => {
            // Normalizza per l'orientamento (HTB vs LTB)
            const ratio = d.isHTB ? d.attuale / d.target : d.target / d.attuale;
            return Math.min(ratio * 100, 150); // Limita al 150% per chiarezza del grafico
        });
        
        const backgroundColors = statusData.map(d => {
            if (d.status === 'verde') return '#28a745';
            if (d.status === 'giallo') return '#ffc107';
            return '#dc3545';
        });

        window.myComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Performance % (100% = Target)',
                    data: currentPerformance,
                    backgroundColor: backgroundColors,
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y', // Grafico a barre orizzontali
                scales: {
                    x: {
                        min: 0,
                        max: 120, // Focus fino al 120% per evidenziare il Target
                        title: { display: true, text: 'Percentuale rispetto al Target (100%)' },
                        ticks: { callback: function(value) { return value + "%"; } }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.formattedValue + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // --- Gestione Filtro e Inizializzazione ---

    // Popola le opzioni del filtro
    const prospettive = [...new Set(bscData.map(item => item.prospettiva))];
    prospettive.forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.textContent = p;
        filterSelect.appendChild(option);
    });

    // Event listener per il filtro
    filterSelect.addEventListener('change', (e) => {
        populateBSCTable(bscData, e.target.value);
    });

    // Caricamento iniziale
    populateBSCTable(bscData, 'Tutti');
});
