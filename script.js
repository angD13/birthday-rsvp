const API_URL = "https://script.google.com/a/macros/code.org/s/AKfycbyS8M_WOz4_vsTcNMS7AI2ohyoNoYOBCDATNJSKt3qEjVt_CmnHNb4BOMtDFVUSfevG/exec";


function toggleDetails(id) {
	const el = document.getElementById(id);
	el.style.display = el.style.display === "block" ? "none" : "block";
}

function submitRSVP() {
	const data = {
		name: document.getElementById("name").value,
		dinner: document.getElementById("dinner").checked,
		karaoke: document.getElementById("karaoke").checked,
		comment: document.getElementById("comment").value
	};

	if (!data.name) {
		alert("Please enter your name.");
		return;
	}

	fetch(API_URL, {
  		method: "POST",
  		headers: { "Content-Type": "application/json" },
  		body: JSON.stringify({
    			action: "saveRSVP",
    			payload: data
  		})
	})
	.then(res => res.json())
	.then(() => {
	  // Show success pulse
	  const animation = document.getElementById("success-animation");
	  animation.style.display = "block";
	  void animation.offsetWidth;
	  animation.classList.add("pulse");
	  setTimeout(() => {
	    animation.style.display = "none";
	    animation.classList.remove("pulse");
	  }, 2000);

	  // Launch confetti
	  launchConfetti();

	  // Reset form
	  document.getElementById("name").value = "";
	  document.getElementById("dinner").checked = false;
	  document.getElementById("karaoke").checked = false;
	  document.getElementById("comment").value = "";

	  updateAttendeeCounts();
	});


}

function launchConfetti() {
	const container = document.getElementById("confetti-container");
        for (let i = 0; i < 25; i++) { // 25 pieces
          const confetti = document.createElement("div");
          confetti.className = "confetti";
          confetti.style.left = Math.random() * 100 + "%";
          confetti.style.backgroundColor = "#d4af37";
          confetti.style.animationDuration = (1 + Math.random() * 0.5) + "s"; // 1-1.5s
          confetti.style.width = (4 + Math.random() * 6) + "px"; // 4-10px
          confetti.style.height = confetti.style.width;
          container.appendChild(confetti);

          // Remove after animation
          confetti.addEventListener("animationend", () => {
            confetti.remove();
          });
        }
}

function updateAttendeeCounts() {
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getCounts"
    })
  })
  .then(res => res.json())
  .then(counts => {
    document.getElementById("dinner-count").textContent = counts.dinner;
    document.getElementById("karaoke-count").textContent = counts.karaoke;
  });
}




document.addEventListener("DOMContentLoaded", () => {
        updateAttendeeCounts();
});



   