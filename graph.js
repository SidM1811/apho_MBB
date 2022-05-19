function initGraph() {
    graph = new Chart(graph_context, {
        type: 'scatter',
        data: {
            labels: timestamps,
            datasets: [{
                label: "B_w (in μT)",
                data: Bx_values,
                backgroundColor: ["#0000ff"],
                borderColor: ["#0000ff"],
                color: ["#0000ff"],
                spanGaps: true,
                //showLine: true,
                pointRadius: 1.0,
                pointHoverRadius: 4.0,
                borderWidth: 1.0,
                animation: false
            },
            {
                label: "B_l (in μT)",
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
                        color: "white",
                    },
                    grid: {
                        color: ["#ffffff"],
                        borderColor: "white",
                        lineWidth: 0.25
                    },
                    ticks: {
                        precision: 2,
                        color: "white",
                        fontColor: "white"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Magnetic field (μT)",
                        font: {
                            size: 20,
                        },
                        color: "white",
                    },
                    grid: {
                        color: ["#ffffff"],
                        borderColor: "white",
                        lineWidth: 0.25
                    },
                    ticks: {
                        color: "white",
                        fontColor: "white"
                    },
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Time: ${context.parsed.x.toFixed(3)} s, B: ${context.parsed.y.toFixed(2)} μT`;
                        }
                    },
                },
                legend: {
                    labels: {
                        color: "white"
                    }
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
