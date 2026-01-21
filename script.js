const API_URL = "https://script.google.com/a/macros/code.org/s/AKfycbyS8M_WOz4_vsTcNMS7AI2ohyoNoYOBCDATNJSKt3qEjVt_CmnHNb4BOMtDFVUSfevG/exec";


function toggleDetails(id) {
	const el = document.getElementById(id);
	el.style.display = el.style.display === "block" ? "none" : "block";
}

// ---- REPLACE the submitRSVP() function in script.js with this entire block ----
function submitRSVP() {
  // read values
  const name = document.getElementById("name").value.trim();
  const dinner = document.getElementById("dinner").checked;
  const karaoke = document.getElementById("karaoke").checked;
  const comment = document.getElementById("comment").value.trim();

  // simple client-side validation
  if (!name) {
    alert("Please enter your name.");
    return;
  }

  // prepare payload expected by the Apps Script endpoint
  const body = {
    action: "saveRSVP",
    payload: {
      name: name,
      dinner: dinner,
      karaoke: karaoke,
      comment: comment
    }
  };

  // optional: UI immediate feedback while request runs
  // (you can leave this or remove)
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
  }

  // POST as JSON using fetch() so the browser does NOT navigate
  fetch(API_URL, {
    method: "POST",
    mode: "cors", // keep this; if CORS blocks you later, we'll handle it
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
    .then(response => {
      // if server returns application/json, use res.json()
      const ct = response.headers.get("content-type") || "";
      if (ct.indexOf("application/json") !== -1) {
        return response.json();
      }
      // if server returned text (older behaviour), return text and try to parse JSON
      return response.text().then(t => {
        try { return JSON.parse(t); }
        catch { return { success: false, raw: t }; }
      });
    })
    .then(result => {
      // handle success / failure
      if (result && result.success) {
        // YOUR existing success UI actions:
        launchConfetti && launchConfetti(); // safe conditional call
        const animation = document.getElementById("success-animation");
        if (animation) {
          animation.style.display = "block";
          void animation.offsetWidth; // restart animation
          animation.classList.add("pulse");
          setTimeout(() => {
            animation.style.display = "none";
            animation.classList.remove("pulse");
          }, 2000);
        }

        // clear form
        document.getElementById("name").value = "";
        document.getElementById("dinner").checked = false;
        document.getElementById("karaoke").checked = false;
        document.getElementById("comment").value = "";
      } else {
        // failure: show server-provided message if present, otherwise fallback
        const msg = result && result.error ? result.error : (result && result.raw ? "Server returned unexpected response." : "Save failed.");
        alert("Error: " + msg);
        console.error("submitRSVP result:", result);
      }
    })
    .catch(err => {
      console.error("Network error in submitRSVP:", err);
      alert("Network error — check console for details.");
    })
    .finally(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }
    });

  // Important: DO NOT call form.submit() anywhere — fetch() keeps user on the page.
}
// ---- end replacement ----


/*
function submitRSVP() {
  const name = document.getElementById("name").value;
  const dinner = document.getElementById("dinner").checked;
  const karaoke = document.getElementById("karaoke").checked;
  const comment = document.getElementById("comment").value;

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = API_URL;
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "data";
  input.value = JSON.stringify({
    action: "saveRSVP",
    payload: { name, dinner, karaoke, comment }
  });

  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();

  // Immediate UI feedback (no waiting on network)
  launchConfetti();

  const animation = document.getElementById("success-animation");
  animation.style.display = "block";
  void animation.offsetWidth;
  animation.classList.add("pulse");

  setTimeout(() => {
    animation.style.display = "none";
    animation.classList.remove("pulse");
  }, 2000);

  // Reset form
  document.getElementById("name").value = "";
  document.getElementById("dinner").checked = false;
  document.getElementById("karaoke").checked = false;
  document.getElementById("comment").value = "";
}
*/

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

/*
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
*/


/*
document.addEventListener("DOMContentLoaded", () => {
        updateAttendeeCounts();
});
*/




   


