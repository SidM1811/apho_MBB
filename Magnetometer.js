class Magnetometer {
    constructor(x, y) {
        this.relative_x = x / scaling_factor + mob.points[0].x - mob.x;
        this.relative_y = y / scaling_factor + mob.points[0].y - mob.y;
        this.x = 0;
        this.y = 0;
        this.radius = 1;

        this.update();
        this.angle = 0;
    }
    update() { 
        this.x = mob.x + this.relative_x;
        this.y = mob.y + this.relative_y;
    }
    transform(angle) {
        let transform_angle = angle - this.angle;
        this.angle = angle;

        let old_x = this.relative_x;

        this.relative_x = this.relative_x * Math.cos(toRadian(transform_angle)) - this.relative_y * Math.sin(toRadian(transform_angle));
        this.relative_y = old_x * Math.sin(toRadian(transform_angle)) + this.relative_y * Math.cos(toRadian(transform_angle));

        this.update();
    }
    render() {
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        context.fill();
    }
}