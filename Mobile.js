class Mobile {
    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width / scaling_factor;
        this.height = height / scaling_factor;

        this.sidebezel = (4/150)*this.height;
        this.topbezel = (1/15)*this.height;
        this.bottombezel = (14/150)*this.height;
        this.buttoncenter = {x: this.x, y: this.y+(68/150) * this.height};
        this.buttonradius = (5/150)*this.height;
        this.cameracenter = {x: this.x, y: this.y-(70/150) * this.height};
        this.cameraradius = (2/150)*this.height;

        this.screenpoints = [];
        this.points = [];
        this.makeRect();

        this.selected = false;
        this.initial_x = 0;
        this.initial_y = 0;
        this.selected_x = 0;
        this.selected_y = 0;

        this.angle = 0;

        this.arrow_deviation = 0.005 / scaling_factor;
        this.arrow_1 = {
            start_x: 0,
            start_y: 0,
            end_x: 0,
            end_y: 0
        }
        this.arrow_2 = {
            start_x: 0,
            start_y: 0,
            end_x: 0,
            end_y: 0
        }
        this.x_label = {
            x: 0,
            y: 0
        }
        this.ylabel = {
            x: 0,
            y: 0
        }
        this.makeArrows();
    }
    update() {
        this.x = this.initial_x + click_x - this.selected_x;
        this.y = this.initial_y + click_y - this.selected_y;
        this.makeRect();

        let prev_angle = this.angle;
        this.angle = 0;
        this.transform(prev_angle);
        magnetometer.update();

        updated = false;

        this.makeArrows();
    }
    render() {
        context.strokeStyle = "#000000";
        context.fillStyle = "rgba(128,128,128,0.5)";
 /*       var my_gradient = context.createLinearGradient(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
        my_gradient.addColorStop(0, "black");
        my_gradient.addColorStop(0.03, "rgba(128,128,128,0.5)");
        my_gradient.addColorStop(0.97, "rgba(128,128,128,0.5)");
        my_gradient.addColorStop(1, "black");
        context.fillStyle = my_gradient;*/
        context.beginPath();
        context.moveTo(this.points[3].x, this.points[3].y);
        for(let point of this.points) {
            context.lineTo(point.x, point.y);
        }
        context.fill();
        context.stroke();
        context.beginPath();
        context.moveTo(this.screenpoints[3].x, this.screenpoints[3].y);
        for(let point of this.screenpoints) {
            context.lineTo(point.x, point.y);
        }
        // context.fill();
        context.stroke();
        context.beginPath();
        context.arc(this.buttoncenter.x,this.buttoncenter.y,this.buttonradius,0,2*Math.PI);
        context.stroke();
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(this.cameracenter.x,this.cameracenter.y,this.cameraradius,0,2*Math.PI);
        context.fill();
        context.stroke();

        drawArrow(this.arrow_1);
        drawArrow(this.arrow_2);

        context.fillText("x", this.x_label.x, this.x_label.y);
        context.fillText("y", this.y_label.x, this.y_label.y);
    }
    select() {
        this.selected = true;
        this.selected_x = click_x;
        this.selected_y = click_y;
        this.initial_x = this.x;
        this.initial_y = this.y;
    }
    drop() {
        this.selected = false;
    }
    transform(angle) {
        let transform_angle = angle - this.angle;
        this.angle = angle;

        let old_x;
        for(let point of this.points) {
            point.x -= this.x;
            point.y -= this.y;
            old_x = point.x;

            point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
            point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

            point.x += this.x;
            point.y += this.y; 
        }
        for(let point of this.screenpoints) {
            point.x -= this.x;
            point.y -= this.y;
            old_x = point.x;

            point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
            point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

            point.x += this.x;
            point.y += this.y; 
        }
        let point = this.buttoncenter;
        point.x -= this.x;
        point.y -= this.y;
        old_x = point.x;

        point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
        point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

        point.x += this.x;
        point.y += this.y; 
        this.buttoncenter = point;
        point = this.cameracenter;
        point.x -= this.x;
        point.y -= this.y;
        old_x = point.x;

        point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
        point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

        point.x += this.x;
        point.y += this.y; 
        this.cameracenter = point;

        this.makeArrows();
    }
    makeRect() {
        this.points = [
            {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2
            },
            {
                x: this.x + this.width / 2,
                y: this.y - this.height / 2
            },
            {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            },
            {
                x: this.x - this.width / 2,
                y: this.y + this.height / 2
            }
        ];
        this.screenpoints = [
            {
                x: this.x - this.width / 2 + this.sidebezel,
                y: this.y - this.height / 2 + this.topbezel
            },
            {
                x: this.x + this.width / 2 - this.sidebezel,
                y: this.y - this.height / 2 + this.topbezel
            },
            {
                x: this.x + this.width / 2 - this.sidebezel,
                y: this.y + this.height / 2 - this.bottombezel,
            },
            {
                x: this.x - this.width / 2 + this.sidebezel,
                y: this.y + this.height / 2 - this.bottombezel
            }
        ];
        this.buttoncenter = {x: this.x, y: this.y+(68/150) * this.height};
        this.cameracenter = {x: this.x, y: this.y-(70/150) * this.height};
    }
    makeArrows() {
        context.strokeStyle = "#000000";
        context.fillStyle = "#000000";

        let dx = this.points[1].x - this.points[0].x;
        let dy = this.points[1].y - this.points[0].y;
        let theta = 3 * Math.PI / 4;

        // Calculates deviation of arrow origin from left corner
        let delta_x = dx * Math.cos(theta) + dy * Math.sin(theta);
        let delta_y = -dx * Math.sin(theta) + dy * Math.cos(theta);
        let magn = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        let unit_x = (delta_x / magn) * 0.005 * Math.sqrt(2) / scaling_factor;
        let unit_y = (delta_y / magn) * 0.005 * Math.sqrt(2) / scaling_factor;

        // length of the arrow in both direction
        let extension_x = 0.03 * Math.cos(this.angle * Math.PI / 180) / scaling_factor;
        let extension_y = 0.03 * Math.sin(this.angle * Math.PI / 180) / scaling_factor;

        this.arrow_1 = {
            start_x: this.points[0].x + unit_x,
            start_y: this.points[0].y + unit_y,
            end_x: this.points[0].x + unit_x + extension_x,
            end_y: this.points[0].y + unit_y + extension_y
        }

        this.x_label = {
            x: this.arrow_1.end_x + 0.005 * Math.cos(this.angle * Math.PI / 180) / scaling_factor,
            y: this.arrow_1.end_y + 0.005 * Math.sin(this.angle * Math.PI / 180) / scaling_factor
        }

        extension_x = 0.03 * Math.cos(this.angle * Math.PI / 180 + Math.PI / 2) / scaling_factor;
        extension_y = 0.03 * Math.sin(this.angle * Math.PI / 180 + Math.PI / 2) / scaling_factor;

        this.arrow_2 = {
            start_x: this.points[0].x + unit_x,
            start_y: this.points[0].y + unit_y,
            end_x: this.points[0].x + unit_x + extension_x,
            end_y: this.points[0].y + unit_y + extension_y
        }

        this.y_label = {
            x: this.arrow_2.end_x + 0.005 * Math.cos(this.angle * Math.PI / 180 + Math.PI / 2) / scaling_factor,
            y: this.arrow_2.end_y + 0.005 * Math.sin(this.angle * Math.PI / 180 + Math.PI / 2) / scaling_factor
        }
    }
}

function drawArrow(arrow) {
    from_x = arrow.start_x;
    from_y = arrow.start_y;
    to_x = arrow.end_x;
    to_y = arrow.end_y;

	let head_length = 10; // length of head in pixels
	let dx = to_x - from_x;
	let dy = to_y - from_y;
	let angle = Math.atan2(dy, dx);

	context.beginPath()
	context.moveTo(from_x, from_y);
	context.lineTo(to_x, to_y);
	context.lineTo(to_x - head_length * Math.cos(angle - Math.PI / 6), to_y - head_length * Math.sin(angle - Math.PI / 6));
	context.moveTo(to_x, to_y);
	context.lineTo(to_x - head_length * Math.cos(angle + Math.PI / 6), to_y - head_length * Math.sin(angle + Math.PI / 6));
	context.stroke();
}

function getMagn(x, y) {
    return Math.sqrt(x * x + y * y);
}