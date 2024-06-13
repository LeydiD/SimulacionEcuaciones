window.onload = function () {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    // Obtener los valores de los parámetros
    const radioOrificio = parseFloat(params.get('radioOrificio'));
    const radioRecipiente = parseFloat(params.get('radioRecipiente'));
    const alturaInicial = parseFloat(params.get('alturaInicial'));
    const tiempoTotal = parseFloat(params.get('tiempoTotal'));

    // Ejecutar la simulación con los valores obtenidos de la URL
    runSimulation(radioOrificio, radioRecipiente, alturaInicial, tiempoTotal);
};

function runSimulation(radioOrificio, radioRecipiente, alturaInicial, tiempoTotal) {
    const G = 9.81; // Aceleración debido a la gravedad en m/s^2
    const DELTA_T = 1; // Paso de tiempo en segundos
    let alturaAgua = alturaInicial;
    let tiempo = 0;
    let result = '';

    // Calcular las áreas
    const areaOrificio = Math.PI * Math.pow(radioOrificio, 2);
    const areaRecipiente = Math.PI * Math.pow(radioRecipiente, 2);

    // Mostrar los valores iniciales y las áreas calculadas
    result += `Valores iniciales:\n`;
    result += `Radio del orificio: ${radioOrificio} m\n`;
    result += `Radio del recipiente: ${radioRecipiente} m\n`;
    result += `Altura inicial del agua: ${alturaInicial} m\n`;
    result += `Tiempo total de simulación: ${tiempoTotal} s\n\n`;
    result += `Área del Orificio: ${areaOrificio} m²\n`;
    result += `Área del Recipiente: ${areaRecipiente} m²\n\n`;

    // Primer paso para mostrar la fórmula reemplazada
    const dAlturaInicial = -(areaOrificio / areaRecipiente) * Math.sqrt(2 * G * alturaAgua);
    result += `Con los valores iniciales:\n`;
    result += `d(h)/dt = -(${areaOrificio} / ${areaRecipiente}) * sqrt(2 * ${G} * ${alturaInicial})\n`;
    result += `d(h)/dt ≈ ${dAlturaInicial.toFixed(4)} m/s\n\n`;

    result += `Simulación:\n`;

    const tiempoData = [];
    const alturaData = [];

    createChart();

    const updateInterval = setInterval(() => {
        if (tiempo >= tiempoTotal || alturaAgua <= 0) {
            clearInterval(updateInterval);
            result += '\nLa simulación ha terminado.';
            document.getElementById('resultArea').textContent = result;
        } else {
            const dAltura = -(areaOrificio / areaRecipiente) * Math.sqrt(2 * G * alturaAgua) * DELTA_T;
            alturaAgua += dAltura;
            tiempo += DELTA_T;

            tiempoData.push(tiempo);
            alturaData.push(alturaAgua);

            result += `Tiempo: ${tiempo.toFixed(2)} s, Altura del agua: ${alturaAgua.toFixed(4)} m\n`;
            document.getElementById('resultArea').textContent = result;

            // Actualizar la gráfica con los nuevos datos
            updateChart(tiempoData, alturaData);
            updateTank(alturaAgua, alturaInicial);

            // Actualizar los textos de altura y tiempo
            document.getElementById('waterHeightText').textContent = `${alturaAgua.toFixed(4)} m`;
            document.getElementById('timeTextValue').textContent = `${tiempo.toFixed(2)} s`;
        }
    }, 2000);

    function createChart() {
        const ctx = document.getElementById('myChart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Altura del Agua',
                    data: [],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tiempo (s)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Altura (m)'
                        }
                    }
                }
            }
        });
    }

    function updateChart(tiempoData, alturaData) {
        window.myChart.data.labels = tiempoData;
        window.myChart.data.datasets[0].data = alturaData;
        window.myChart.update();
    }

    function updateTank(alturaAgua, alturaInicial) {
        const tank = document.getElementById('waterLevel');
        const alturaPorcentaje = (alturaAgua / alturaInicial) * 100;
        tank.style.height = `${Math.max(0, alturaPorcentaje)}%`;
    }
}
