window.onload = function () {
    // Obtener los parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    // Obtener los valores de los parámetros
    const radioOrificio = parseFloat(params.get('radioOrificio'));
    const radioRecipiente = parseFloat(params.get('radioRecipiente'));
    const alturaInicial = parseFloat(params.get('alturaInicial'));
    const tiempoTotal = parseFloat(params.get('tiempoTotal'));

    // Ejecutar la simulación con los valores obtenidos de la URL
    const simulationResult = runSimulation(radioOrificio, radioRecipiente, alturaInicial, tiempoTotal);

    // Mostrar los resultados en el área de texto
    document.getElementById('resultArea').textContent = simulationResult;

    // Crear la gráfica
    createChart(simulationResult);
};

function runSimulation(radioOrificio, radioRecipiente, alturaInicial, tiempoTotal) {
    const G = 9.81; // Aceleración debido a la gravedad en m/s^2
    const DELTA_T = 0.01; // Paso de tiempo en segundos
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
    const dAlturaInicial = -(areaOrificio / areaRecipiente) * Math.sqrt(2 * G * alturaAgua) ;
    result += `Con los valores iniciales:\n`;
    result += `d(h)/dt = -(${areaOrificio} / ${areaRecipiente}) * sqrt(2 * ${G} * ${alturaInicial})\n`;
    result += `d(h)/dt ≈ ${dAlturaInicial.toFixed(4)} m/s\n\n`;

    result += `Simulación:\n`;

    while (tiempo < tiempoTotal && alturaAgua > 0) {
        const dAltura = -(areaOrificio / areaRecipiente) * Math.sqrt(2 * G * alturaAgua) * DELTA_T;
        alturaAgua += dAltura;
        tiempo += DELTA_T;
        result += `Tiempo: ${tiempo.toFixed(2)} s, Altura del agua: ${alturaAgua.toFixed(4)} m\n`;
    }

    result += '\nLa simulación ha terminado.';
    return result;
}

function createChart(simulationResult) {
    // Extraer los datos de la simulación para la gráfica
    const tiempoData = [];
    const alturaData = [];

    // Analizar el texto de los resultados para extraer los datos de tiempo y altura
    const lines = simulationResult.split('\n');
    lines.forEach(line => {
        if (line.startsWith('Tiempo:')) {
            const tiempo = parseFloat(line.split(':')[1].split(' ')[1]);
            const altura = parseFloat(line.split(':')[2].split(' ')[1]);
            tiempoData.push(tiempo);
            alturaData.push(altura);
        }
    });

    // Dibujar la gráfica utilizando Chart.js
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tiempoData,
            datasets: [{
                label: 'Altura del Agua',
                data: alturaData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Tiempo (s)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Altura del Agua (m)'
                    }
                }
            }
        }
    });
}
