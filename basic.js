let screen_width = window.innerWidth, screen_height = window.innerHeight;
let canvas_width, canvas_height;
let fps = 500, updated = false, paused = false;
let mobile;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    mobile = true;
} else {
    mobile = false;
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let graph_canvas=document.getElementById("graph-canvas");
let graph_context = graph_canvas.getContext("2d");

let b_display = document.getElementById("b-display");
let t_display = document.getElementById("t-display");
let error_display = document.getElementById("error-display");

let mob_angle = document.getElementById("mob-angle");
let mob_display = document.getElementById("mob-display");

let magnet_angle = document.getElementById("magnet-angle");
let magnet_display = document.getElementById("magnet-display");

let scale_angle = document.getElementById("scale-angle");
let scale_display = document.getElementById("scale-display");

let coord_display = document.getElementById("coord-display");

let measure_button = document.getElementById("measure-button");

let simul_start_time_input = document.getElementById("simul-start-time-input");
let simul_end_time_input = document.getElementById("simul-end-time-input");

if (mobile) {
    canvas_width = 0.9 * screen_width;
}
else {
    canvas_width = 0.4 * screen_width;
}
canvas_height = 1.2*canvas_width;

canvas.width = canvas_width;
canvas.height = canvas_height;

let animate =  function (callback) {
        window.setTimeout(callback, 1000 / fps);
    };

function step() {
    if (!updated) {
        update();
        render();
    }
    if (measuring) {
        Bx_values.push(B_x);
        By_values.push(B_y);
        magnet_x_values.push(magnet.x * distance_multiplier);  
        magnet_y_values.push(magnet.y * distance_multiplier);     
        timestamps.push(time);
        if(time-Math.floor(2*time)/2<1/fps)drawGraph(simul_start_time_input.value,simul_end_time_input.value);
        time += dt;
        updateParams('time');
    }
    if (falling && !paused) {
        magnet.fall();
    }

    animate(step);
}

window.onload = function () {
    initParams();
    animate(step);
    time=0;
    updateParams('time');
}

let click_x, click_y, pressed, shift_key_pressed, cntrl_key_pressed, is_cursor_on_canvas = false;

if (mobile) {
    canvas.addEventListener("touchstart", function (e) {
        getTouchPosition(canvas, e);
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        pressed = true;
        clicked();
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        getTouchPosition(canvas, e);
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        moved();
    }, false);

    canvas.addEventListener("touchend", function (e) {
        getTouchPosition(canvas, e);
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mouseup", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        pressed = false;
        released();
    }, false);
}
else {
    canvas.addEventListener("mousedown", function (e) {
        getMousePosition(canvas, e);
        pressed = true;
        clicked();
    });

    canvas.addEventListener("mousemove", function (e) {
        getMousePosition(canvas, e);
        shift_key_pressed = e.shiftKey;
        cntrl_key_pressed = e.altKey;
        moved();
    });

    
    canvas.addEventListener("mouseup", function (e) {
        getMousePosition(canvas, e);
        pressed = false;
        released();
    });

    canvas.addEventListener("mouseenter", function (e) {
        is_cursor_on_canvas = true;
    });

    canvas.addEventListener("mouseleave", function (e) {
        is_cursor_on_canvas = false;
    });


    window.addEventListener("keydown", function (e) {
        if ( is_cursor_on_canvas ) {
            keyPressed(e.key);
            e.preventDefault();
        }
    }, false);


    window.addEventListener("keyup", function (e) {
        keyReleased(e.key);
    }, false);
}

function getMousePosition(canvas, event) {
    rect = canvas.getBoundingClientRect();
    click_x = event.clientX - rect.left;
    click_y = event.clientY - rect.top;
}

function getTouchPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    click_x = event.touches[0].clientX - rect.left;
    click_y = event.touches[0].clientY - rect.top;
}

function measureToggle() {
    if (!measuring) {
        measuring = true;
        measure_button.innerHTML = "Pause Measurement";
    }
    else {
        measuring = false;
        measure_button.innerHTML = "Start Measurement";
        let mydata = [timestamps,Bx_values,By_values,magnet_y_values]
        export_csv(mydata, ',', "pipedata")
    }
}

function pauseToggle() {
    if (!paused) {
        paused = true;
        pause_button.innerHTML = "Resume";
    }
    else {
        paused = false;
        pause_button.innerHTML = "Pause";
    }
}

const export_csv = (arrayData, delimiter, fileName) => {
   //  alert("in export");
    let csv = "Table contains row wise data: time stamps, Bx, By, magnet.y\n";
    arrayData.forEach( array => {
        csv += array.join()+"\n";
    });
    csv += "Pipe corner points as (x,y) \n"
    pipe.points.forEach(point => {
        csv += (point.x*scaling_factor).toString() + "," + (point.y*scaling_factor).toString() + ","
    });
    csv += "\n Scale Factor = " + scaling_factor.toString() + "\n"

    let csvData = new Blob([csv], { type: 'text/csv' });  
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}