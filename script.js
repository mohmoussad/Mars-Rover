const roverImage = document.querySelector(".rover-image");
const playground = document.querySelector(".playground");
const statusContainer = document.querySelector(".status");
const gameScreen = document.querySelector(".game-screen");
const startScreen = document.querySelector(".start-screen");
const mapBuilderForm = document.querySelector(".map-builder");
const commandInput = document.querySelector(".command-input");
const scaleSizeInput = document.querySelector(".scale-input");
const executeBtn = document.querySelector(".execute-button");
const exitBtn = document.querySelector(".exit-button");
const respawnBtn = document.querySelector(".respawn-button");

// Constants objects to mitigate using a lot of IF/CASE conditions.
const constants = {
  dirs: ["N", "E", "S", "W"],
  angles: [0, 90, 180, 270],
  movementNumericalAmount: {
    F: 1,
    B: -1,
  },
  movementDirections: {
    N: "y",
    S: "y",
    E: "x",
    W: "x",
  },
  rotationNumericalDirection: { R: 1, L: -1 },
};

// Initial Rover and Map objects, they will be the source of the truth after any event
const map = {
  scaleSize: 0,
};
const rover = {
  xLocation: 0,
  yLocation: 0,
  // Virtual coordinates to enable rover to move outside the initial map scale
  xLocationVritual: 0,
  yLocationVritual: 0,
  direction: "N",
  angle: 0,
};


// The Map is constructued using grid depending on the scale size (user input)
const buildMap = () => {

  const { scaleSize } = map;
  playground.innerHTML = "";

  playground.style["grid-template-rows"] = `repeat(${scaleSize}, 1fr)`;
  for (let i = scaleSize - 1; i >= 0; i--) {
    const div = document.createElement("div");
    div.className = `row row-${i}`;
    playground.appendChild(div);
  }

  const rows = document.querySelectorAll(".row");
  rows.forEach((row, index) => {
    row.style["grid-template-columns"] = `repeat(${scaleSize}, 1fr)`;

    for (let i = 0; i <= scaleSize - 1; i++) {
      const div = document.createElement("div");
      div.className = `cell cell-${i}-${rows.length - index - 1}`;
      row.appendChild(div);
    }
  });

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    const span = document.createElement("span");
    span.className = `coordinates`;
    cell.appendChild(span);
  });
};
// The Rover is inserted into a random cell
const buildRover = () => {
  const { scaleSize } = map;
  roverImage.style.display = "block";
  const cellHeight = document.querySelector(".cell").getBoundingClientRect().height;
  roverImage.style.height = 0.8 * cellHeight + "px";

  const randomX = Math.floor(Math.random() * scaleSize);
  const randomY = Math.floor(Math.random() * scaleSize);
  const randomDirIndex = Math.floor(Math.random() * 4);
  const randomAngle = constants.angles[randomDirIndex];
  const randomDir = constants.dirs[randomDirIndex];

  Object.assign(rover, {
    xLocation: randomX,
    yLocation: randomY,
    xLocationVritual: randomX,
    yLocationVritual: randomY,
    direction: randomDir,
    angle: randomAngle,
  });

  locateRover(randomX, randomY, randomAngle);
  printStatus();
};

// Rendering rover on its new location after any event
// Rover's location is calculated dynamically based on the cell size, it's meant to be located in the center of the cell
const locateRover = (x, y, angle) => {
  const cell = document.querySelector(`.cell-${x}-${y}`);

  roverImage.style.top = String(cell.getBoundingClientRect().y + 0.5 * cell.getBoundingClientRect().height) + "px";
  roverImage.style.left = String(cell.getBoundingClientRect().x + 0.5 * cell.getBoundingClientRect().width) + "px";

  if (angle != undefined) {
    roverImage.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
  }
};

// Status window 
const printStatus = () => {
  statusContainer.innerHTML = `<span>X: ${rover.xLocation}, Y: ${rover.yLocation}, D: ${rover.direction}</span>`;
};

// Main rover functions
const move = (command) => {
  const { scaleSize } = map;

  const movementAmount =
    rover.direction == "N" || rover.direction == "E"
      ? constants.movementNumericalAmount[command]
      : -constants.movementNumericalAmount[command];

  const movementDirection = constants.movementDirections[rover.direction];

  rover[`${movementDirection}Location`] += movementAmount;
  rover[`${movementDirection}LocationVritual`] += movementAmount;

  // Handling rover movement after reaching map's edge
  ["yLocationVritual", "xLocationVritual"].forEach(virtualCoordinate => {
      rover[virtualCoordinate] = rover[virtualCoordinate] > scaleSize - 1 ? 0 : rover[virtualCoordinate];
      rover[virtualCoordinate] = rover[virtualCoordinate] < 0 ? scaleSize - 1 : rover[virtualCoordinate];
  });  

  locateRover(rover.xLocationVritual, rover.yLocationVritual);
  printStatus();
};
const rotate = (command) => {
  let currentRoverDirIndex = constants.dirs.indexOf(rover.direction);

  let newRoverDirIndex = currentRoverDirIndex + constants.rotationNumericalDirection[command];

  if (newRoverDirIndex == -1) newRoverDirIndex = 3;
  if (newRoverDirIndex == 4) newRoverDirIndex = 0;

  rover.direction = constants.dirs[newRoverDirIndex];

  rover.angle += constants.rotationNumericalDirection[command] * 90;
  roverImage.style.transform = `translate(-50%,-50%) rotate(${rover.angle}deg)`;
  printStatus();
};
const respawn = () => {
  Object.assign(rover, {
    xLocation: 0,
    yLocation: 0,
    xLocationVritual: 0,
    yLocationVritual: 0,
    direction: "N",
    angle: 0,
  });

  locateRover(0, 0, 0);
  printStatus();

  commandInput.value = "";
};

// Events handling
mapBuilderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const scaleSize = scaleSizeInput.value;

  if (isNaN(scaleSize)) return alert("Scale size should be a number.");
  if (scaleSize < 4) return alert("Scale size should be greater than or equal 4.");
  if (scaleSize > 10) return alert("Scale size should be less than or equal 10.");

  map.scaleSize = scaleSize;

  gameScreen.classList.remove("hidden");
  startScreen.classList.add("hidden");

  buildMap();
  buildRover();
});

exitBtn.addEventListener("click", (e) => {
  respawn();
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});

executeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const command = commandInput.value.toUpperCase().split("");
  command.forEach((commandUnit, i) => {
    setTimeout(() => {
      switch (commandUnit) {
        case "F":
        case "B":
          move(commandUnit);
          break;
        case "L":
        case "R":
          rotate(commandUnit);
          break;
        default:
          break;
      }
      printStatus();
    }, i * 300);
  });

  commandInput.value = "";
});

commandInput.addEventListener("input", (e) => {
  const acceptedCommands = ["F", "B", "L", "R", "f", "b", "l", "r"];
  if (!acceptedCommands.includes(e.data)) {
    commandInput.value = commandInput.value.replace(new RegExp(`[${e.data}]`, "g"), "");
  }
});

respawnBtn.addEventListener("click", (e) => {
  e.preventDefault();
  respawn();
});

window.addEventListener("resize", (e) => {
  locateRover(rover.xLocationVritual, rover.yLocationVritual);
});
