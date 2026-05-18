function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(220);

  // Knob parameters
  const x = 200;
  const y = 200;
  const knobRadius = 70;
  const shadowOffset = 12;

  // Draw shadow
  push();
  fill(60, 60, 60, 60);
  ellipse(x + shadowOffset, y + shadowOffset, knobRadius * 1.1);
  pop();

  // Main knob gradient
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(x, y, knobRadius, knobRadius, 0, 2 * Math.PI);
  drawingContext.clip();
  let grad = drawingContext.createRadialGradient(x, y - knobRadius * 0.3, knobRadius * 0.3, x, y, knobRadius);
  grad.addColorStop(0, '#f6e9d7');
  grad.addColorStop(0.5, '#e2c6a7');
  grad.addColorStop(1, '#c9a47a');
  drawingContext.fillStyle = grad;
  drawingContext.fillRect(x - knobRadius, y - knobRadius, knobRadius * 2, knobRadius * 2);
  drawingContext.restore();
  pop();

  // Inner shadow
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(x, y, knobRadius, knobRadius, 0, 2 * Math.PI);
  drawingContext.clip();
  let grad2 = drawingContext.createRadialGradient(x, y, knobRadius * 0.7, x, y, knobRadius);
  grad2.addColorStop(0, 'rgba(0,0,0,0)');
  grad2.addColorStop(1, 'rgba(0,0,0,0.18)');
  drawingContext.fillStyle = grad2;
  drawingContext.fillRect(x - knobRadius, y - knobRadius, knobRadius * 2, knobRadius * 2);
  drawingContext.restore();
  pop();

  // Highlight
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.arc(x, y, knobRadius, knobRadius, 0, 2 * Math.PI);
  drawingContext.clip();
  let grad3 = drawingContext.createRadialGradient(x - knobRadius * 0.3, y - knobRadius * 0.3, knobRadius * 0.1, x, y, knobRadius);
  grad3.addColorStop(0, 'rgba(255,255,255,0.7)');
  grad3.addColorStop(1, 'rgba(255,255,255,0)');
  drawingContext.fillStyle = grad3;
  drawingContext.fillRect(x - knobRadius, y - knobRadius, knobRadius * 2, knobRadius * 2);
  drawingContext.restore();
  pop();

  // Knob indicator (value pointer)
  push();
  stroke(80, 60, 40);
  strokeWeight(6);
  const angle = map(mouseX, 0, width, -PI * 0.75, PI * 0.75);
  const pointerLen = knobRadius * 0.7;
  line(x, y, x + pointerLen * cos(angle), y + pointerLen * sin(angle));
  pop();

  // Value markings
  push();
  stroke(80, 60, 40, 120);
  strokeWeight(2);
  for (let i = 0; i <= 10; i++) {
    let markAngle = map(i, 0, 10, -PI * 0.75, PI * 0.75);
    let markLen = knobRadius * 0.85;
    let markStart = knobRadius * 0.72;
    line(
      x + markStart * cos(markAngle),
      y + markStart * sin(markAngle),
      x + markLen * cos(markAngle),
      y + markLen * sin(markAngle)
    );
  }
  pop();

  // Knob center
  push();
  fill(200, 180, 140);
  ellipse(x, y, knobRadius * 0.3);
  pop();

  // Value text
  fill(80, 60, 40);
  textAlign(CENTER, CENTER);
  textSize(18);
  let value = int(map(mouseX, 0, width, 0, 100));
  text(value, x, y + knobRadius * 0.5);
}