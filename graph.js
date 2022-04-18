function initGraph() {
    graph = new Chart(graph_context, {
        type: 'scatter',
        data: {
            labels: timestamps,
            datasets: [{
                label: "Bx (in micro T)",
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
                label: "By (in micro T)",
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
                    grid: {
                        color: ["#ff0000"]
                    },
			ticks:{
			precision:2
		    }
                },
                y: {
                    grid: {
                        color: ["#ff0000"]
                    },
                }
            },
            normalized: true,
            animation: false,
        }
    });
}

function drawGraph(t_start,t_end) {
    start_index=Math.max(Math.floor(t_start*fps),0);
    end_index=Math.min(Math.ceil(t_end*fps),timestamps.length);
    graph.data.labels = timestamps.slice(start_index,end_index);
    graph.data.datasets[0].data = Bx_values.slice(start_index,end_index);
    graph.data.datasets[1].data = By_values.slice(start_index,end_index);
    graph.update();
}

function resetGraph() {
	if (measuring) measureToggle();
	resetMeasurements();
	if (graph !== undefined) graph.destroy();
	initGraph();
	time = 0;
	updateParams("time");
}