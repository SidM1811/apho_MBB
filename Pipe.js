class Pipe {
    constructor(x, y, width, height) {

        this.x = x;
        this.y = y;
        this.width = width/ scaling_factor;
        this.height = height/ scaling_factor;

        this.points = [];
        this.blue_points = [];
        this.makeRects();
        
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
        this.makeRects();
        let prev_angle = this.angle;
        this.angle = 0;
        this.transform(prev_angle);

        updated = false;
    }
    render() {
        // context.fillStyle = "#1f51ff";
        // context.beginPath();
        // for(let point of this.points) {
        //     context.lineTo(point.x, point.y);
        // }
        // context.fill();

        // context.fillStyle = "#ff1818";
        // context.beginPath();
        // for(let point of this.blue_points) {
        //     context.lineTo(point.x, point.y);
        // }
        // context.fill();

        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(this.points[0].x, this.points[0].y);
        context.lineTo(this.points[3].x, this.points[3].y);
        context.stroke();

        context.beginPath();
        context.moveTo(this.points[1].x, this.points[1].y);
        context.lineTo(this.points[2].x, this.points[2].y);
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

        for(let point of this.blue_points) {
            point.x -= this.x;
            point.y -= this.y;
            old_x = point.x;

            point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
            point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

            point.x += this.x;
            point.y += this.y; 
        }
    }
    makeRects() {
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

        this.blue_points = [
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
                y: this.y,
            },
            {
                x: this.x - this.width / 2,
                y: this.y
            }
        ];
    }
}