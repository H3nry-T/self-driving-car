class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controls = new Controls();
    this.velocity = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 5;
    this.friction = 0.05;

    this.angle = 0;

    this.sensor = new Sensor(this);
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);

    context.beginPath();
    context.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    context.fill();
    context.restore();

    this.sensor.draw(context);
  }

  update(roadBorder) {

    this.sensor.update(roadBorder); 

    if (this.controls.forward) {
      this.velocity += this.acceleration;
    }
    if (this.controls.reverse) {
      this.velocity -= this.acceleration;
    }

    this.#carVelocity();
    this.#carAngle();
    this.sensor.update();
  }

  #carVelocity() {
    if (this.velocity > this.maxSpeed) {
      this.velocity = this.maxSpeed;
    }

    if (this.velocity < -this.maxSpeed / 2) {
      this.velocity = -this.maxSpeed / 2;
    }

    if (this.velocity > 0) {
      this.velocity -= this.friction;
    }

    if (this.velocity < 0) {
      this.velocity += this.friction;
    }

    if (Math.abs(this.velocity) < this.friction) {
      this.velocity = 0;
    }

    this.x -= Math.sin(this.angle) * this.velocity;
    this.y -= Math.cos(this.angle) * this.velocity;
  }

  #carAngle() {
    if (this.velocity !== 0 && Math.abs(this.velocity) > 1) {
      const flip = this.velocity > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }
  }
}
