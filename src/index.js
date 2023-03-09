const canvas = document.querySelector("canvas");

canvas.height = window.innerHeight;
canvas.width = 400;

// CONTEXT:
const context = canvas.getContext("2d");
// Car(x, y, width, height)
const road = new Road(canvas.width / 2, canvas.width * 0.95, 2);
const car = new Car(road.getLaneCenter(0), 700, 50, 100);

//START ANIMATING GAME
animate();
