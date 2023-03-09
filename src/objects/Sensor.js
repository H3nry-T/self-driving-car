class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 19;
    this.rayLength = 150;
    this.raySpread = Math.PI / 2;

    this.rays = [];

    this.readings = [];
  }

  update(roadBorder) {
    this.#castRays();
    this.readings = [];
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorder));
    }
  }

  draw(context) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1];
      if (this.readings[i]) {
        end = this.readings[i];
      }

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "yellow";
      context.moveTo(this.rays[i][0].x, this.rays[i][0].y);
      context.lineTo(end.x, end.y);
      context.stroke();

      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.moveTo(this.rays[i][1].x, this.rays[i][1].y);
      context.lineTo(end.x, end.y);
      context.stroke();
    }
  }

  #castRays() {
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };
      this.rays.push([start, end]);
    }
  }

  //potential for bugs
  #getReading(ray, roadBorder) {
    let touches = [];

    for (let i = 0; i < roadBorder?.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorder[i][0],
        roadBorder[i][1]
      );

      if (touch) {
        touches.push(touch);
      }
    }

    if (touches.length === 0) {
      return null;
    } else {
      const offsets = touches.map((touch) => touch.offset);
      const minOffset = Math.min(...offsets);
      if (touches.length > 0) {
        // console.log(touches.find((touch) => touch.offset === minOffset));
      }
      return touches.find((touch) => touch.offset === minOffset);
    }
  }
}
