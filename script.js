let model;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let drawing = false;

// vẽ bằng chuột
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(e.offsetX, e.offsetY, 10, 0, Math.PI * 2);
  ctx.fill();
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerText = "Prediction: ?";
}

// Load pretrained MNIST model
async function loadModel() {
  model = await tf.loadLayersModel(
    "https://storage.googleapis.com/tfjs-models/tfjs/mnist/model.json"
  );
  console.log("Model loaded");
}

loadModel();

// chuyển canvas → tensor
function preprocessCanvas() {
  let img = tf.browser.fromPixels(canvas, 1);
  img = tf.image.resizeBilinear(img, [28, 28]);
  img = img.div(255.0);
  img = img.reshape([1, 28, 28, 1]);
  return img;
}

async function predict() {
  const tensor = preprocessCanvas();
  const prediction = model.predict(tensor);
  const data = await prediction.data();

  let max = Math.max(...data);
  let index = data.indexOf(max);

  document.getElementById("result").innerText =
    "Prediction: " + index;
}