const URL = "https://teachablemachine.withgoogle.com/models/zkop8Gj-0/"

// Global references to maintain state between functions
let model, webcam, labelContainer, maxPredictions

// Initialize only the click handler first - webcam access requires user interaction
document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("startButton").addEventListener("click", startModel)
})

async function startModel() {
	// UI transition: hide text, show webcam interface
	document.querySelector(".intro-content").classList.add("hidden")
	document.querySelector(".model-content").classList.remove("hidden")

	try {
		// Model initialization - these two files define the trained model
		const modelURL = URL + "model.json"
		const metadataURL = URL + "metadata.json"

		// tmImage.load() creates a TensorFlow.js model wrapper
		model = await tmImage.load(modelURL, metadataURL)
		maxPredictions = model.getTotalClasses() // Number of class labels

		// Webcam configuration
		const flip = true
		webcam = new tmImage.Webcam(400, 400, flip)
		await webcam.setup() // Request camera access
		await webcam.play() // Start video stream

		// Add webcam canvas to DOM - tmImage handles video rendering
		document.getElementById("webcam-container").appendChild(webcam.canvas)
		labelContainer = document.getElementById("label-container")

		// Reset previous session's predictions
		labelContainer.innerHTML = ""

		// Create DOM elements for each class label upfront
		for (let i = 0; i < maxPredictions; i++) {
			const predictionDiv = document.createElement("div")
			predictionDiv.className = "prediction-item"
			labelContainer.appendChild(predictionDiv)
		}

		// Start recursive prediction loop using browser animation timing
		window.requestAnimationFrame(loop)
	} catch (error) {
		console.error("Error initializing model:", error)
	}
}

// Main animation loop - tied to screen refresh rate (~60fps)
async function loop() {
	webcam.update() // Capture latest frame from webcam
	await predict() // Process frame through model
	window.requestAnimationFrame(loop) // Recursively schedule next frame
}

// Core classification function - runs model inference
async function predict() {
	// Get predictions array sorted by probability
	const prediction = await model.predict(webcam.canvas)

	// Update UI for each class probability
	for (let i = 0; i < maxPredictions; i++) {
		const confidence = prediction[i].probability.toFixed(2)
		const className = prediction[i].className

		// Build dynamic HTML template for visualization
		labelContainer.childNodes[i].innerHTML = `
            <span class="bar-span">${className}</span>
            <div class="confidence-container">
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${
											confidence * 100 // Convert to percentage for CSS
										}%"></div>
                </div>
                <span class="confidence-value">${(confidence * 100).toFixed(
									1 // Show one decimal place for readability
								)}%</span>
            </div>
        `
	}
}
