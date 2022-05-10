function initGraph() {
    graph = new Chart(graph_context, {
        type: 'scatter',
        data: {
            labels: timestamps,
            datasets: [{
                label: "Bx (in μT)",
                data: Bx_values,
                backgroundColor: ["#ffffff"],
                borderColor: ["#ffffff"],
                color: ["#ffffff"],
		spanGaps: true,
		//showLine: true,
		pointRadius: 1.0,
		pointHoverRadius: 4.0,
		borderWidth: 1.0,
		animation: false
            },
		{
                label: "By (in μT)",
                data: By_values,
                backgroundColor: ["#00ff00"],
                borderColor: ["#00ff00"],
                color: ["#00ff00"],
		spanGaps: true,
		//showLine: true,
		pointRadius: 1.0,
		pointHoverRadius: 4.0,
		borderWidth: 1.0,
		animation: false
            }]
        },
        options: {
            spanGaps: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time (s)",
                        font: {
                            size: 20,
                        },
                    },
                    grid: {
                        color: ["#ff0000"]
                    },
			ticks:{
			precision:2
		    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Magnetic field (μT)",
                        font: {
                            size: 20,
                        },
                    },
                    grid: {
                        color: ["#ff0000"]
                    },
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Time: ${context.parsed.x.toFixed(3)} s, B: ${context.parsed.y.toFixed(3)} μT`;
                        }
                    },
                }
            },
            normalized: true,
            animation: false,
        }
    });
}

function drawGraph(t_start, t_end) {
    start_index = Math.max(Math.floor(t_start * fps), 0);
    end_index = Math.min(Math.ceil(t_end * fps), timestamps.length);
    graph.data.labels = timestamps.slice(start_index, end_index);
    graph.data.datasets[0].data = Bx_values.slice(start_index, end_index);
    graph.data.datasets[1].data = By_values.slice(start_index, end_index);
    graph.update();
}

function resetGraph() {
	if (measuring) measureToggle();
	resetMeasurements();
	if (graph !== undefined) graph.destroy();
	initGraph();
	time = 0;
}
