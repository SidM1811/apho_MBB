let fine_factor = 1;
let finify = 2;
let zoom_in_counter = 3;
let zoom_out_counter = 3;

function clicked() {
    if(insidePolygon(click_x, click_y, magnet.points)) {
        magnet.select();
    }
    else if (show_scale && insidePolygon(click_x, click_y, scale.cornerpts)) {
        scale.rotateselect();
    }
    else if (show_scale && insidePolygon(click_x, click_y, scale.points)) {
        scale.select();
    }
    else if(insidePolygon(click_x, click_y, mob.points)) {
        mob.select();
    }
    else if (insidePolygon(click_x, click_y, pipe.points)) {
        pipe.select();
    }
}

function moved() {
    if(magnet.selected) {
        magnet.update();
        falling = false;
    }
    else if (scale.selected || scale.rotateselected) {
        scale.update();
    }
    else if(mob.selected) {
        mob.update();
    }
    else if (pipe.selected) {
        pipe.update();
    }
    else {
        if(show_scale && insidePolygon(click_x, click_y, scale.cornerpts)) {
            document.getElementById("canvas").style.cursor = "crosshair";
        }
        else if (show_scale && insidePolygon(click_x, click_y, scale.points)) {
            document.getElementById("canvas").style.cursor = "move";
        }
        else {
            document.getElementById("canvas").style.cursor = "default";
        }
    }
}

function finer() {
    fine_factor *= finify;
    zoom_in_counter -= 1;
    zoom_out_counter += 1;

    if (zoom_in_counter > 0) {
        document.getElementById("coarser-button").disabled = false;
    }
    else {
        document.getElementById("finer-button").disabled = true;
    }
}

function coarser() {
    fine_factor /= finify;
    zoom_out_counter -= 1;
    zoom_in_counter += 1;

    if (zoom_out_counter > 0) {
        document.getElementById("finer-button").disabled = false;
    }
    else {
        document.getElementById("coarser-button").disabled = true;
    }
}

function released() {
    if(magnet.selected) {
        magnet.drop();
    }
    else if(mob.selected) {
        mob.drop();
    }
    else if (pipe.selected) {
        pipe.drop();
    }
    if(scale.selected || scale.rotateselected ) {
        scale.drop();
    }
}

function keyPressed(key) {
    switch (key) {
        case "ArrowLeft":
            // left pressed
            magnet.x -= 0.0002 / scaling_factor / fine_factor;
            break;
        case "ArrowRight":
            // Right pressed
            magnet.x += 0.0002 / scaling_factor / fine_factor;
            break;
        case "ArrowUp":
            // Up pressed
            magnet.y -= 0.0002 / scaling_factor / fine_factor;
            break;
        case "ArrowDown":
            // Down pressed
            magnet.y += 0.0002 / scaling_factor / fine_factor;
            break;
    }
    magnet.updateonarrowkeys()
    updated = false;
}

function keyReleased(key) {
}