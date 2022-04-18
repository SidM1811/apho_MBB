let mob, magnet, magnetometer, pipe, scale;
let scaling_factor;
let constant_part, dipole_moment;
let gravity, dt;
let magnetism_multiplier, distance_multiplier;
let Bx_values = [];
let By_values = [];
let timestamps = [];
let magnet_x_values = [];
let magnet_y_values = [];
let datatable = [];
let graph = undefined;
let falling, measuring;

let B_x, B_y;

let time;
let start_time, end_time;

function dropMagnet() {
	if (!falling) {
		magnet.backupPosition();
		falling = true;
		magnet.initFall();
	}
	if (paused)pauseToggle();
}

function resetMeasurements() {
	Bx_values = [];
	By_values = [];
	magnet_x_values = [];
	magnet_y_values = [];
	timestamps = [];
	datatable = [];
	time = 0;
}

function resetMagnet() {
	falling = false;
	magnet.resetPosition();
	if (!paused)pauseToggle();
}

function update() {
	// distance between dipole and magnetometer
	let distance = getDistance(magnet.x, magnet.y, magnetometer.x, magnetometer.y) * distance_multiplier;

	// displacement vector joining center of dipole to magnetometer
	let disp_x = (magnetometer.x - magnet.x) * distance_multiplier;
	let disp_y = (magnetometer.y - magnet.y) * distance_multiplier;
	let disp_magn = getMagn(disp_x, disp_y);

	// dipole moment unit vector pointing from south (blue) to north (red)
	let magnet_x = Math.sin(toRadian(magnet.angle));
	// natural orientation of the magnet is vertical, hence the interchange of sin() and cos()
	let magnet_y = -Math.cos(toRadian(magnet.angle));
	// quirk of coordinate system of electronic displays: Y decreases as we go up
	let magnet_magn = getMagn(magnet_x, magnet_y);

	// calculating angle between displacement vector and dipole moment unit vector
	let rdotm = getDotProduct(disp_x, magnet_x, disp_y, magnet_y);
	let theta = Math.acos(rdotm / magnet_magn / disp_magn);

	// for debugging purposes only. Seems to calculate angle correctly
	b_display.innerHTML =`Angle between r and m: ${toDegree(theta).toFixed(2)} <br> <br>`;

	B_x = constant_part * dipole_moment * (3 * rdotm * disp_x / Math.pow(distance, 5) - magnet_x / Math.pow(distance, 3)) * magnetism_multiplier;
	B_y = constant_part * dipole_moment * (3 * rdotm * disp_y / Math.pow(distance, 5) - magnet_y / Math.pow(distance, 3)) * magnetism_multiplier;

	let orientation = toRadian(mob_angle.value);

	// rotation
	let B_x_prime = Math.cos(orientation) * B_x + Math.sin(orientation) * B_y;
	let B_y_prime = -Math.sin(orientation) * B_x + Math.cos(orientation) * B_y;

	B_x = B_x_prime;
	B_y = B_y_prime;
	b_display.innerHTML += `B<sub>x</sub>: ${B_x.toFixed(6)} μT <br> B<sub>y</sub>: ${B_y.toFixed(6)} μT`;

	updated = true;
}

function render() {
	context.fillStyle = "#ffffff";
	context.fillRect(0, 0, canvas_width, canvas_height);

	drawGrid();

	mob.render();
	magnetometer.render();
	magnet.render();
	scale.render();
	pipe.render();
}

function updateParams(variable) {
	if (variable == "mob-angle") {
		let angle = Number.parseInt(mob_angle.value);
		mob.transform(angle);
		magnetometer.transform(angle);
		mob_display.innerHTML = `Angle of orientation of mobile: ${mob.angle}`;
		updated = false;
	}
	if (variable == "magnet-angle") {
		magnet.transform(Number.parseInt(magnet_angle.value));
		magnet_display.innerHTML = `Angle of orientation of magnet: ${magnet.angle}`;
		updated = false;
	}
	if (variable == "scale-angle") {
		scale.transform(Number.parseInt(scale_angle.value));
		scale_display.innerHTML = `Angle of orientation of scale: ${scale.angle}`;
		updated = false;
	}
	if (variable == "time") {
		t_display.innerHTML = `Time: ${time.toFixed(2)} s`;
	}
	if (variable == "simul-start-time-input") {
		start_time = Number.parseFloat(simul_start_time_input.value);
		drawGraph(start_time,end_time);
		updated = false;
	}
	if (variable == "simul-end-time-input") {
		end_time = Number.parseFloat(simul_end_time_input.value);
		drawGraph(start_time,end_time);
		updated = false;
	}
}

function initParams() {
	// in meters
	canvas_size = 0.2;

	// used for calculations
	distance_multiplier = canvas_size / canvas_width;

	// used for rendering purposes
	scaling_factor = distance_multiplier;

	// used for calculations
	magnetism_multiplier = Math.pow(10, 6);

	// in meters
	let mobile_width = 0.06;
	let mobile_height = 0.15;

	// in meters, with respect to top left corner of phone
	let magnetometer_x = 0.05;
	let magnetometer_y = 0.01;

	// in meters
	let pipe_length = 0.12;
	let pipe_diameter = 0.01;

	// in meters
	let magnet_length = 0.005;
	let magnet_diameter = 0.0025;

	// all objects
	mob = new Mobile(canvas_width / 4, canvas_width / 2, mobile_width, mobile_height);
	magnet = new Magnet(1 * canvas_width / 2, canvas_height / 2, magnet_diameter, magnet_length);
	magnetometer = new Magnetometer(magnetometer_x, magnetometer_y);
	pipe = new Pipe(3 * canvas_width / 4, canvas_height / 2, pipe_diameter, pipe_length);
	scale = new Scale(3 * canvas_width / 5, canvas_height / 2, 0.02, 0.15);

	mob_angle.value = 0;
	updateParams("mob-angle");

	magnet_angle.value = 0;
	updateParams("magnet-angle");

	scale_angle.value = 0;
	updateParams("scale-angle");
	
	start_time = 0;
	simul_start_time_input.value = start_time;

	end_time = 10;
	simul_end_time_input.value = end_time;

	// mu_0 by 4 pi
	constant_part = Math.pow(10, -7);
	dipole_moment = 2.0;

	gravity = 9.8;
	dt = 1 / fps;
	initGraph();
}

function drawGrid() {
	context.strokeStyle = "rgba(0,0,0,0.2)";
	let i = 0;
	while (i < canvas_width) {
		context.beginPath();
		context.moveTo(i, 0);
		context.lineTo(i, canvas_height);
		context.stroke();
		i += 0.01 / scaling_factor;
	}

	i = 0;
	while (i < canvas_height) {
		context.beginPath();
		context.moveTo(0, i);
		context.lineTo(canvas_width, i);
		context.stroke();
		i += 0.01 / scaling_factor;
	}
	context.fillStyle = "#00ff00";
	context.beginPath();
	context.moveTo(0, canvas_height - 0.001 / scaling_factor);
	context.lineTo(canvas_width, canvas_height - 0.001 / scaling_factor);
	context.lineTo(canvas_width, canvas_height);
	context.lineTo(0, canvas_height);
	context.fill();
}
