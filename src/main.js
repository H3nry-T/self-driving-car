const carCanvas = document.getElementById("myCanvas");
carCanvas.width = 400;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 100;
const cars = generateCars(N);
function randomLane() {
  const randomLane = Math.floor(Math.random() * 3);
  return randomLane;
}

let prevYPosition;

function randomYPosition() {
  let newYPosition = -Math.random() * 1000;

  while (prevYPosition && Math.abs(newYPosition - prevYPosition) <= 120) {
    newYPosition = -Math.random() * 1000;
  }

  prevYPosition = newYPosition;
  return newYPosition;
}

// Usage example

const traffic = [
  new Car(road.getLaneCenter(randomLane()), -100, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -100, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -600, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -600, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -1000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -1000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -1500, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -1500, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -2000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -2000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -2500, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -2500, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -3000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -3000, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -3500, 60, 120, "DUMMY", 5),
  new Car(road.getLaneCenter(randomLane()), -3500, 60, 120, "DUMMY", 5),
];

let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i !== 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.4);
    }
  }
}

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 60, 120, "AI", 6));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }

  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
