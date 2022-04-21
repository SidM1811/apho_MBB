let fine_factor = 1;
function clicked() {
    if(insidePolygon(click_x, click_y, magnet.points)) {
        magnet.select();
    }
    else if (insidePolygon(click_x, click_y, scale.cornerpts)) {
        scale.rotateselect();
    }
    else if (insidePolygon(click_x, click_y, scale.points)) {
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
        if(insidePolygon(click_x, click_y, scale.cornerpts)) {
            document.getElementById("canvas").style.cursor = "crosshair";
        }
        else if (insidePolygon(click_x, click_y, scale.points)) {
            document.getElementById("canvas").style.cursor = "move";
        }
        else {
            document.getElementById("canvas").style.cursor = "default";
        }
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
        case "Control":
            cntrl_key_pressed = true;
            fine_factor *= 20;
            break;
        case "Shift":
            shift_key_pressed = true;
            fine_factor /= 20;
            break;
    }
    magnet.updateonarrowkeys()
    updated = false;
}

function keyReleased(key) {
    switch (key) {
        case "Control":
            cntrl_key_pressed = false;
            break;
        case "Shift":
            shift_key_pressed = false;
            break;
    }
}