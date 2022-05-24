class Scale {
    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width/scaling_factor;
        this.height = height/scaling_factor;
	    this.least_count = 0.002/scaling_factor;

        this.points = [];
        this.ticks = [];
        this.cornerpts = [];
        this.makeRect();

        this.selected = false;
        this.rotateselected = false;
        this.initial_x = 0;
        this.initial_y = 0;
        this.selected_x = 0;
        this.selected_y = 0;
        this.selectedangle = 0;
        this.initialangle = 0;

        this.angle = 0;

      
    }
    update() {
        if (this.selected) {
            this.x = this.initial_x + click_x - this.selected_x;
            this.y = this.initial_y + click_y - this.selected_y;
            this.makeRect();

            let prev_angle = this.angle;
            this.angle = 0;
            this.transform(prev_angle);
        }
        else if (this.rotateselected) {
            let new_angle = toDegree(Math.atan2(click_y - this.y, click_x - this.x));
            let prev_angle = this.initialangle + new_angle - this.selectedangle;
            if (prev_angle < 0) {
                prev_angle += 360;
            }
            scale_angle.value = Math.trunc(prev_angle);
            this.makeRect();
            this.angle = 0;
            this.transform(prev_angle);
        }

        updated = false;
    }
    render() {
        if (show_scale) {
            context.strokeStyle = "#000000";
            context.beginPath();
            context.moveTo(this.points[3].x, this.points[3].y);
            for (let point of this.points) {
                context.lineTo(point.x, point.y);
            }
            for (let point of this.ticks) {
                context.moveTo(point.x1, point.y1);
                context.lineTo(point.x2, point.y2);
            }
            context.stroke();
        }
    }
    select() {
        this.selected = true;
        this.selected_x = click_x;
        this.selected_y = click_y;
        this.initial_x = this.x;
        this.initial_y = this.y;
    }
    rotateselect() {
        //alert('in rotateselet')
        this.rotateselected = true;
        this.selected_x = click_x;
        this.selected_y = click_y;
        this.initial_x = this.x;
        this.initial_y = this.y;
        this.initialangle = this.angle;
        this.selectedangle = toDegree(Math.atan2(this.selected_y - this.y, this.selected_x - this.x));

    }
    drop() {
        this.selected = false;
        this.rotateselected = false;
    }
    transform(angle) {
        let transform_angle = angle - this.angle;
        this.angle = angle;

        let old_x;
        for (let point of this.points) {
            point.x -= this.x;
            point.y -= this.y;
            old_x = point.x;

            point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
            point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

            point.x += this.x;
            point.y += this.y;
        }
        for (let point of this.cornerpts) {
            point.x -= this.x;
            point.y -= this.y;
            old_x = point.x;

            point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
            point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

            point.x += this.x;
            point.y += this.y;
        }

        for (let point of this.ticks) {
            point.x1 -= this.x;
            point.y1 -= this.y;
            point.x2 -= this.x;
            point.y2 -= this.y;

            old_x = point.x1;
            point.x1 = point.x1 * Math.cos(toRadian(transform_angle)) - point.y1 * Math.sin(toRadian(transform_angle));
            point.y1 = old_x * Math.sin(toRadian(transform_angle)) + point.y1 * Math.cos(toRadian(transform_angle));
            old_x = point.x2;
            point.x2 = point.x2 * Math.cos(toRadian(transform_angle)) - point.y2 * Math.sin(toRadian(transform_angle));
            point.y2 = old_x * Math.sin(toRadian(transform_angle)) + point.y2 * Math.cos(toRadian(transform_angle));

            point.x1 += this.x;
            point.y1 += this.y;
            point.x2 += this.x;
            point.y2 += this.y;
        }
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
                y: this.y + this.height / 2,
            },
            {
                x: this.x - this.width / 2,
                y: this.y + this.height / 2
            }
        ];
        // let current_y = 0, i = 1;
        // while (current_y < this.height) {
        //     current_y = this.y + i * 0.01 / scaling_factor;
        //     this.ticks.append({
        //         x1: this.x,
        //         y1: this.y + i * 0.01 / scaling_factor,
        //         x2: this.x + this.width / 2,
        //         y2: this.y + i * 0.01 / scaling_factor
        //     })
        // }

        for (let i = 1; i < this.height/this.least_count; i++) {
            this.ticks[i - 1] = (i%5==0?
	    {
                x1: this.x,
                y1: this.y + i * this.least_count - this.height/2,
                x2: this.x + this.width / 2,
                y2: this.y + i * this.least_count - this.height/2
            }:{
                x1: this.x+this.width/4,
                y1: this.y + i * this.least_count - this.height/2,
                x2: this.x + this.width / 2,
                y2: this.y + i * this.least_count - this.height/2
            });
        }

        this.cornerpts = [
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
                y: this.y - this.height / 2 + 10
            },
            {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2 + 10
            }
        ];
    }
}
