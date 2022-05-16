class Magnet {
	constructor(x, y, width, height) {
		this.mass = 0.012;

		this.x = x;
		this.y = y;

		this.radius = 1;

		this.angle = 0;

		this.width = width / scaling_factor;
		this.height = height / scaling_factor;

		this.velocity = 0;
		this.acceleration = 0;

		this.on_ground = false;

		this.points = [];
		this.blue_points = [];
		this.makeRects();

		this.selected = false;
		this.initial_x = 0;
		this.initial_y = 0;
		this.selected_x = 0;
		this.selected_y = 0;

		this.backup_x = this.x;
		this.backup_y = this.y;
		this.backup_angle = this.angle;

		this.current_k = 0;
		this.segment_x0 = this.x;
		this.segment_y0 = this.y;
		this.segment_t0 = time;
		this.segment_v0y = 0;

		this.angle = 0;
	}
	update() {
		if (!falling) {
			if (shift_key_pressed) {
				this.x = this.initial_x + click_x - this.selected_x;
			}
			else if (cntrl_key_pressed) {
				this.y = this.initial_y + click_y - this.selected_y;
			}
			else {
				this.x = this.initial_x + click_x - this.selected_x;
				this.y = this.initial_y + click_y - this.selected_y;
			}
			this.makeRects();
			let prev_angle = this.angle;
			this.angle = 0;
			this.transform(prev_angle);

			self.checkOnGround();
			updated = false;
		}
	}

	updateonarrowkeys() {
		if (!falling) {
			this.makeRects();
			let prev_angle = this.angle;
			this.angle = 0;
			this.transform(prev_angle);
			updated = false;
		}
	}
	render() {
		context.fillStyle = "#1f51ff";
		context.beginPath();
		for (let point of this.points) {
			context.lineTo(point.x, point.y);
		}
		context.fill();

		context.fillStyle = "#ff1818";
		context.beginPath();
		for (let point of this.blue_points) {
			context.lineTo(point.x, point.y);
		}
		context.fill();
		//border
		context.strokeStyle = "#000000";
		context.beginPath();
		for (let point of this.points) {
			context.lineTo(point.x, point.y);
		}
		context.lineTo(this.points[0].x, this.points[0].y);
		context.stroke();
		context.beginPath();
		for (let point of this.blue_points) {
			context.lineTo(point.x, point.y);
		}
		context.lineTo(this.blue_points[0].x, this.blue_points[0].y);
		context.stroke();
		context.fillStyle = "#000000";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		context.fill();
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
		for (let point of this.points) {
			point.x -= this.x;
			point.y -= this.y;
			old_x = point.x;

			point.x = point.x * Math.cos(toRadian(transform_angle)) - point.y * Math.sin(toRadian(transform_angle));
			point.y = old_x * Math.sin(toRadian(transform_angle)) + point.y * Math.cos(toRadian(transform_angle));

			point.x += this.x;
			point.y += this.y;
		}

		for (let point of this.blue_points) {
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
		this.points = [{
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

		this.blue_points = [{
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
	backupPosition() {
		this.backup_x = this.x;
		this.backup_y = this.y;
		this.backup_angle = this.angle;

		this.current_k = -1;
		this.segment_x0 = this.x;
		this.segment_y0 = this.y;
		this.segment_t0 = time;
		this.segment_v0y = 0;

	}
	resetPosition() {
		this.acceleration = 0;
		this.velocity = 0;
		this.angle = 0;
		this.x = this.backup_x;
		this.y = this.backup_y;
		this.checkOnGround();
		this.makeRects();
		this.transform(this.backup_angle);
		updated = false;
	}
	insidePipe() {
		if (this.x > pipe.points[0].x && this.x < pipe.points[1].x) {
			if (pipe.points[0].y < this.y && this.y < pipe.points[0].y + 3 * pipe.height / 12) {
				return 1;
			} else if (pipe.points[0].y + 3 * pipe.height / 12 < this.y && this.y < pipe.points[0].y + 7 * pipe.height / 12) {
				return 2;
			} else if (pipe.points[0].y + 7 * pipe.height / 12 < this.y && this.y < pipe.points[0].y + pipe.height) {
				return 3;
			}
		}
		return 0;
	}
	colliding() {
		let y_min = 10000;
		let y_max = -10000;
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].y < y_min) y_min = this.points[i].y;
			if (this.points[i].y > y_max) y_max = this.points[i].y;
		}
		for (let i = 0; i < this.points.length; i++) {
			if (this.blue_points[i].y < y_min) y_min = this.blue_points[i].y;
			if (this.blue_points[i].y > y_max) y_max = this.blue_points[i].y;
		}
		if (y_min > pipe.points[2].y || y_max < pipe.points[1].y) return false;
		let x_min = 10000;
		let x_max = -10000;
		for (let i = 0; i < this.points.length; i++) {
			if (this.points[i].x < x_min) x_min = this.points[i].x;
			if (this.points[i].x > x_max) x_max = this.points[i].x;
		}
		for (let i = 0; i < this.points.length; i++) {
			if (this.blue_points[i].x < x_min) x_min = this.blue_points[i].x;
			if (this.blue_points[i].x > x_max) x_max = this.blue_points[i].x;
		}
		if (pipe.points[0].x > x_min && pipe.points[0].x < x_max) return true;
		if (pipe.points[1].x > x_min && pipe.points[1].x < x_max) return true;
		return false;
	}

// This section has been added by Charu
//=========================================================

	freeFall_distance(t0, y0, v0, t1)
	{
		let dt = t1 - t0;
		return y0 + (1 / 2 * gravity * dt * dt + v0 * dt)/scaling_factor;
	}
	freeFall_velocity(t0, y0, v0, t1)
	{
		let dt = t1 - t0;
		return v0 +  gravity * dt;
	}
	freeFall_time(t0, y0, v0, y1){
		return t0 + (1 / gravity) * (Math.sqrt(v0*v0 + 2 * gravity * (y1 - y0) * scaling_factor)-v0);
	}

	dampedFall_distance(k, t0, y0, v0, t1)
	{
		let dt = t1 - t0;
		let temp = (k * dt / this.mass > 40 ? 0 : Math.exp(-k * dt / this.mass));
		return y0 + (this.mass * gravity * dt / k + this.mass / k * (v0 - this.mass * gravity / k) * (1-temp)) / scaling_factor;
	}
	dampedFall_velocity(k, t0, y0, v0, t1)
	{
		let dt = t1 - t0;
		let temp = (k * dt / this.mass > 40 ? 0 : Math.exp(-k * dt / this.mass));
		return (v0 - this.mass * gravity / k) * temp + this.mass * gravity / k;
	}
	dampedFall_time(k, t0, y0, v0, y1, ta, tb){
		let tmid = (ta + tb)/2;
		let fa = this.dampedFall_distance(k,t0,y0,v0,ta) - y1;
		let fb = this.dampedFall_distance(k,t0,y0,v0,tb) - y1;
		let fmid = this.dampedFall_distance(k,t0,y0,v0,tmid) - y1;
		while (tb - ta > 10**(-6))
		{
			if (fa * fmid > 0 ) {
				fa = fmid;
				ta = tmid;
			}
			else{
				fb = fmid;
				tb = tmid;
			}
			tmid = (ta + tb)/2;
			fmid = this.dampedFall_distance(k,t0,y0,v0,tmid) - y1;
		}
		return tb;		// Want to cross the boundary.
	}


	// Method fall: Modified By Charu
	initFall()
	{
		let inside_pipe = this.insidePipe();
		let colliding = this.colliding();
		let p = 0;
		if (1 <= inside_pipe && inside_pipe < 4 && !colliding) {
			if (inside_pipe == 1) {
				p = 1.96;
			} else if (inside_pipe == 3) {
				p = 5.88;
			}
		}

		this.segment_x0 = this.x;
		this.segment_y0 = this.y;
		this.current_k = p;
		this.segment_t0 = time;
		this.segment_v0y = 0;
		this.velocity = 0;  // Not required, I think.

	}

	fall() {
		let new_y, boundary_y, ddt, new_vy, t2;
		let old_y = this.y;
		let inside_pipe = this.insidePipe();
		let colliding = this.colliding();

		if (!colliding) {
			let k = this.current_k;
			if (k !== 0) {
				new_y = this.dampedFall_distance(k, this.segment_t0, this.segment_y0, this.segment_v0y, time);
				new_vy = this.dampedFall_velocity(k, this.segment_t0, this.segment_y0, this.segment_v0y, time);
			} else {
				new_y = this.freeFall_distance(this.segment_t0, this.segment_y0, this.segment_v0y, time);
				new_vy = this.freeFall_velocity(this.segment_t0, this.segment_y0, this.segment_v0y, time);
			}

			let new_inside_pipe = this.isInsidePipe(this.x,new_y);
			if ( new_inside_pipe !== inside_pipe )
			{
				// alert("Changing regions: " + inside_pipe.toString());
				if (inside_pipe == 0 ) boundary_y = pipe.points[0].y;
				else if (inside_pipe == 1 ) boundary_y = (pipe.points[0].y + 3 * pipe.height /12);
				else if (inside_pipe == 2 ) boundary_y = (pipe.points[0].y + 7 * pipe.height /12);
				else if (inside_pipe == 3 ) boundary_y = (pipe.points[0].y +  pipe.height);
				// alert("Computing t2");
				// Find the boundary, and time to reach boundary
				if ( k != 0 ){
					t2 = this.dampedFall_time(k, this.segment_t0, this.segment_y0, this.segment_v0y, boundary_y, time-1/fps, time);
				}
				else {
					t2 = this.freeFall_time(this.segment_t0, this.segment_y0, this.segment_v0y, boundary_y);
				}
				// alert("Stopped with t2 = "+t2.toString()+" time = "+time.toString())
				// Step1: To boundary
				if (k !== 0) {
					new_y = this.dampedFall_distance(k, this.segment_t0, this.segment_y0, this.segment_v0y, t2);
					new_vy = this.dampedFall_velocity(k, this.segment_t0, this.segment_y0, this.segment_v0y, t2);
				} else {
					new_y = this.freeFall_distance(this.segment_t0, this.segment_y0, this.segment_v0y, t2);
					new_vy = this.freeFall_velocity(this.segment_t0, this.segment_y0, this.segment_v0y, t2);
				}
				
				// Step2: To next point.
				this.segment_t0 = t2;
				this.segment_x0 = this.x;
				this.segment_y0 = new_y;
				this.segment_v0y = new_vy;
				inside_pipe = new_inside_pipe
				k = 0;
				if (1 <= inside_pipe && inside_pipe < 4 && !colliding) {
					if (inside_pipe == 1) {
						k = 1.96;
					} else if (inside_pipe == 3) {
						k = 5.88;
					}
				}
				this.current_k = k;
				if (k !== 0) {
					new_y = this.dampedFall_distance(k, this.segment_t0, this.segment_y0, this.segment_v0y, time);
					new_vy = this.dampedFall_velocity(k, this.segment_t0, this.segment_y0, this.segment_v0y, time);
				} else {
					new_y = this.freeFall_distance(this.segment_t0, this.segment_y0, this.segment_v0y, time);
					new_vy = this.freeFall_velocity(this.segment_t0, this.segment_y0, this.segment_v0y, time);
				}
			}

			// update y position and velocity

		} else {
			falling = false;
			new_y = this.y;
			new_vy = 0;
		}

		this.y = new_y;
		this.velocity = new_vy;


		if (this.y + this.height / 2 > canvas_height) {
			this.y = canvas_height - this.height / 2;
			this.on_ground = true;
			this.velocity=0;
			this.segment_v0y=0;
			falling=false;
		} else {
			this.on_ground = false;
		}
		for (let point of this.points) point.y += this.y - old_y;
		for (let point of this.blue_points) point.y += this.y - old_y;
		updated = false;
	}

	// Method isInsidePipe: Added by Charu
	isInsidePipe(x, y) {
		if (x > pipe.points[0].x && x < pipe.points[1].x) {
			if (pipe.points[0].y < y && y < pipe.points[0].y + 3 * pipe.height / 12) {
				return 1;
			} else if (pipe.points[0].y + 3 * pipe.height / 12 < y && y < pipe.points[0].y + 7 * pipe.height / 12) {
				return 2;
			} else if (pipe.points[0].y + 7 * pipe.height / 12 < y && y < pipe.points[0].y + pipe.height) {
				return 3;
			}
		}
		return 0;
	}

	// Method: checkOnGround: Added by Chandan
	// Required for determining if the drop button should be disabled or not
	checkOnGround() {
		if (this.y + this.height / 2 > canvas_height) {
			this.on_ground = true;
		} else {
			this.on_ground = false;
		}
	}
}	
