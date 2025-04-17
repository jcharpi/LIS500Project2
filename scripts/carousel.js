// =====================================================================
// Carousel controller (Project 3 ‑ statement slider)
// ---------------------------------------------------------------------
//  • Keyboard‑ and button‑accessible navigation
//  • No wrap‑around: arrows disappear at ends
//  • Live counter updates: "Slide X of Y"
// =====================================================================

/* ---------- DOM references ---------- */
const carousel = document.getElementById("statement-carousel") // wrapper div
const slides = carousel.querySelectorAll(".slide") // all slide panels
const prevBtn = carousel.querySelector(".prev") // ◀ button
const nextBtn = carousel.querySelector(".next") // ▶ button
const slideCounter = document.getElementById("slide-counter") // "Slide X of Y"

/* Active‑slide index (0‑based) */
let index = 0

/* -------------------------------------------------------------------
   renderUI() — show / hide arrows & refresh counter text
   ------------------------------------------------------------------- */
function renderUI() {
	// hide the ◀ button on first slide, ▶ button on last slide
	prevBtn.style.display = index === 0 ? "none" : ""
	nextBtn.style.display = index === slides.length - 1 ? "none" : ""

	// update counter text (1‑based for humans)
	slideCounter.textContent = `Slide ${index + 1} of ${slides.length}`
}

/* -------------------------------------------------------------------
   updateSlides(newIndex) — navigate if within bounds
   ------------------------------------------------------------------- */
function updateSlides(newIndex) {
	if (newIndex < 0 || newIndex >= slides.length) return // stop at ends

	slides[index].classList.remove("active") // hide current slide
	index = newIndex // update pointer
	slides[index].classList.add("active") // show new slide
	renderUI() // refresh UI
}

/* -------------------------------------------------------------------
   Event listeners — buttons & arrow keys
   ------------------------------------------------------------------- */
prevBtn.addEventListener("click", () => updateSlides(index - 1))
nextBtn.addEventListener("click", () => updateSlides(index + 1))

// Allow ← / → navigation when carousel has focus (tabindex="0" in HTML)
carousel.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") updateSlides(index - 1)
	if (e.key === "ArrowRight") updateSlides(index + 1)
})

/* ---------- initial paint ---------- */
renderUI()
