let miniCanvas;
let width = 640;
let height = 640;

let paused = false;
let clearPending = false;

let movingCenterRot;

let fixedRadius, fixedVisible, fixedColor;
let movingRadius, movingPosition, movingVisible, movingColor1, movingColor2;
let highlightVisible,
  highlightRadius,
  highlightColor,
  penColor,
  penDistance,
  penSize,
  penVisible,
  penAttached;
let speedMul, backgroundColor;

fixedRadius = document.getElementById("fixed-radius");
fixedVisible = document.getElementById("fixed-visible");
fixedColor = document.getElementById("fixed-color");

movingRadius = document.getElementById("moving-radius");
movingPosition = document.getElementById("moving-position");
movingVisible = document.getElementById("moving-visible");
movingColor1 = document.getElementById("moving-color-1");
movingColor2 = document.getElementById("moving-color-2");

highlightVisible = document.getElementById("pen-highlight-visible");
highlightRadius = document.getElementById("pen-highlight-radius");
highlightColor = document.getElementById("pen-highlight-color");
penColor = document.getElementById("pen-color");
penDistance = document.getElementById("pen-distance");
penSize = document.getElementById("pen-size");
penVisible = document.getElementById("pen-visible");
penAttached = document.getElementById("pen-attached");

speedMul = document.getElementById("speed");
backgroundColor = document.getElementById("background-color");

let pausebutton = document.getElementById("pause-button");

function togglePaused() {
  if (paused) {
    pausebutton.innerHTML = "Pause";
  } else {
    pausebutton.innerHTML = "Play";
  }
  paused = !paused;
}

function clearCanvas() {
  clear();
  miniCanvas.clear();
  background(backgroundColor.value);
  movingCenterRot = 0;
  paused = false;
  draw();
  togglePaused();
}

function updateCanvas() {
  if (paused) {
    draw(true);
  }
}

function setup() {
  var mycanvas = createCanvas(width, height);
  mycanvas.parent("canvas-container");
  background(0, 0, 0);
  miniCanvas = createGraphics(width, height);

  fixedRadius.value = 90;
  fixedVisible.checked = true;
  fixedColor.value = "#ffffff";

  movingRadius.value = 30;
  movingVisible.checked = true;
  movingPosition.value = "in";
  movingColor1.value = "#ff1e1e";
  movingColor2.value = "#1eff1e";

  highlightVisible.checked = true;
  highlightRadius.value = 4;
  highlightColor.value = "#1eff1e";
  penColor.value = "#800080";
  penDistance.value = movingRadius.value / 10;
  penSize.value = 2;
  penVisible.checked = true;
  penAttached.checked = false;

  speedMul.value = 1;
  backgroundColor.value = "#000000";

  movingCenterRot = 0;

  clearPending = false;
  paused = false;
  draw();
  togglePaused();
  pausebutton.innerHTML = "Play";
}

function draw(forced = false) {
  if (paused && !forced) {
    return;
  }
  if (!forced) {
    movingCenterRot += speedMul.value / 100;
  }

  background(backgroundColor.value);

  let sign = movingPosition.value == "out" ? 1 : -1;

  let x =
    320 +
    (int(fixedRadius.value) + int(movingRadius.value) * sign) *
      cos(movingCenterRot);
  let y =
    320 -
    (int(fixedRadius.value) + int(movingRadius.value) * sign) *
      sin(movingCenterRot);

  let movingCircleRot =
    (fixedRadius.value / (movingRadius.value * sign) + 1) * movingCenterRot;
  let drawPointX = x - penDistance.value * cos(movingCircleRot);
  let drawPointY = y + penDistance.value * sin(movingCircleRot);

  //   console.log("x: " + x + ", y: " + y);

  fill(0, 0, 0, 0);

  stroke((fixedVisible.checked && fixedColor.value) || color(0, 0, 0, 0));
  circle(320, 320, 2 * fixedRadius.value);

  stroke((movingVisible.checked && movingColor1.value) || color(0, 0, 0, 0));
  circle(x, y, 2 * movingRadius.value * sign);

  stroke((movingVisible.checked && movingColor2.value) || color(0, 0, 0, 0));
  arc(
    x,
    y,
    2 * movingRadius.value * sign,
    2 * movingRadius.value * sign,
    0 - movingCircleRot,
    PI - movingCircleRot
  );

  stroke(
    (highlightVisible.checked && highlightColor.value) || color(0, 0, 0, 0)
  );
  // fill(30,255, 30);
  circle(drawPointX, drawPointY, highlightRadius.value);

  if (penAttached.checked) {
    line(drawPointX, drawPointY, x, y);
  }
  if (forced) {
    return;
  }
  miniCanvas.stroke(
    (penVisible.checked && penColor.value) || color(0, 0, 0, 0)
  );
  miniCanvas.strokeWeight(penSize.value);
  miniCanvas.point(drawPointX, drawPointY);
  image(miniCanvas, 0, 0);
}
