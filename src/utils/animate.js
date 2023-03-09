function animate() {
  car.update();
  canvas.height = window.innerHeight;

  context.save();
  context.translate(0, -car.y + canvas.height * 0.8);

  road.draw(context);
  car.draw(context);

  context.restore();
  requestAnimationFrame(animate);
}
