const URL = "https://teachablemachine.withgoogle.com/models/zkop8Gj-0/"

let model, webcam, labelContainer, maxPredictions

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const modelURL = URL + "model.json"
    const metadataURL = URL + "metadata.json"

    model = await tmImage.load(modelURL, metadataURL)
    maxPredictions = model.getTotalClasses()

    const flip = true
    webcam = new tmImage.Webcam(400, 400, flip)
    await webcam.setup()
    await webcam.play()

    document.getElementById("webcam-container").appendChild(webcam.canvas)
    labelContainer = document.getElementById("label-container")

    for (let i = 0; i < maxPredictions; i++) {
      const predictionDiv = document.createElement("div")
      predictionDiv.className = "prediction-item"
      labelContainer.appendChild(predictionDiv)
    }

    window.requestAnimationFrame(loop)
  } catch (error) {
    console.error("Error initializing model:", error)
  }
})

async function loop() {
  webcam.update()
  await predict()
  window.requestAnimationFrame(loop)
}

async function predict() {
  const prediction = await model.predict(webcam.canvas)
  for (let i = 0; i < maxPredictions; i++) {
    const confidence = prediction[i].probability.toFixed(2)
    const className = prediction[i].className
    labelContainer.childNodes[i].innerHTML = `
      <span class="bar-span">${className}</span>
      <div class="confidence-container">
          <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${
                confidence * 100
              }%"></div>
          </div>
          <span class="confidence-value">${(confidence * 100).toFixed(
            1
          )}%</span>
      </div>
    `
  }
}
