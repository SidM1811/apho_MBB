class Mobile {
    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width / scaling_factor;
        this.height = height / scaling_factor;

        this.points = [];
        this.makeRect();

        this.selected = false;
        this.initial_x = 0;
        this.initial_y = 0;
        this.selected_x = 0;
        this.selected_y = 0;

        this.angle = 0;
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
    }
    render() {
        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(this.points[3].x, this.points[3].y);
        for(let point of this.points) {
            context.lineTo(point.x, point.y);
        }
        context.stroke();
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
    }
}