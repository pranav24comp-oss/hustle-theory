/* Module 3 - Insurance - Using relative API path (works with or without server) */

let step = 0;

function updateProgress() {
  let percent = (step / 10) * 100;
  document.getElementById("lessonProgress").style.width = percent + "%";
}

function nextStep() {
  step++;
  updateProgress();
  let content = document.getElementById("lessonContent");

  if (step == 1) {
    content.innerHTML = `
      <h2>Why Does Insurance Exist?</h2>
      <p>Life is unpredictable. Insurance exists to <b>transfer risk</b> from you to an insurance company.</p>
      <p><b>How it works:</b></p>
      <ul>
        <li>You pay a small amount regularly called a <b>premium</b></li>
        <li>If a covered event happens, the company pays a large amount called a <b>claim</b></li>
        <li>Many people pay premiums, but only a few make claims — this is how insurance companies work</li>
      </ul>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 2) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>What is a premium in insurance?</p>
      <div class="option" onclick="answer(false,'A claim is what you receive, not what you pay.')">The money you receive from insurance</div>
      <div class="option" onclick="answer(true)">The money you pay regularly to the insurance company</div>
      <div class="option" onclick="answer(false,'Premium is what you pay, not bonus money.')">A bonus given by the company</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 3) {
    content.innerHTML = `
      <h2>Types of Insurance</h2>
      <p><b>Health Insurance</b> – Covers medical expenses like hospital bills, surgery, and treatment.</p>
      <p><b>Life Insurance</b> – Pays money to your family if you pass away, helping them stay financially secure.</p>
      <p><b>Term Insurance</b> – A type of life insurance that is affordable and covers you for a specific period.</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 4) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>Which insurance covers hospital bills?</p>
      <div class="option" onclick="answer(true)">Health Insurance</div>
      <div class="option" onclick="answer(false,'Life insurance pays after death, not for medical bills.')">Life Insurance</div>
      <div class="option" onclick="answer(false,'Vehicle insurance covers vehicles, not medical bills.')">Vehicle Insurance</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 5) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>Why is life insurance important?</p>
      <div class="option" onclick="answer(false,'Life insurance is for protection, not profit.')">To make money</div>
      <div class="option" onclick="answer(true)">To protect your family financially if you die</div>
      <div class="option" onclick="answer(false,'Life insurance is for family protection, not saving.')">To save money like a bank account</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 6) {
    content.innerHTML = `
      <h2>Other Types of Insurance</h2>
      <p><b>Vehicle Insurance</b> – Mandatory for all vehicle owners. Covers accident damage and third-party liability.</p>
      <p><b>Home Insurance</b> – Protects your house against fire, theft, and natural disasters.</p>
      <p><b>Travel Insurance</b> – Covers trip cancellations, medical emergencies abroad, and lost baggage.</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 7) {
    content.innerHTML = `
      <h2>🧠 Choose the Right Insurance</h2>
      <p>Read the scenario and pick the best insurance type:</p>
      <div class="scenario">
        <p><b>Scenario:</b> Ravi is 25 years old, just started working, and wants to ensure his parents are financially secure if anything happens to him. He has a limited budget.</p>
      </div>
      <p>What should Ravi get?</p>
      <div class="option" onclick="answer(false,'Vehicle insurance protects vehicles, not family members.')">Vehicle Insurance</div>
      <div class="option" onclick="answer(true)">Term Life Insurance</div>
      <div class="option" onclick="answer(false,'Travel insurance is for trips, not long-term family protection.')">Travel Insurance</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 8) {
    content.innerHTML = `
      <h2>🧠 Scenario 2</h2>
      <div class="scenario">
        <p><b>Scenario:</b> Priya's father had a heart attack and the hospital bill came to ₹3,00,000. The family had no insurance.</p>
      </div>
      <p>What type of insurance could have helped?</p>
      <div class="option" onclick="answer(true)">Health Insurance</div>
      <div class="option" onclick="answer(false,'Home insurance covers property damage, not medical bills.')">Home Insurance</div>
      <div class="option" onclick="answer(false,'Life insurance pays out on death, not for medical treatment.')">Life Insurance</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 9) {
    content.innerHTML = `
      <h2>Final Quiz</h2>
      <p>Why is insurance important?</p>
      <div class="option" onclick="answer(false,'Insurance is not an investment for profit.')">It helps you make money</div>
      <div class="option" onclick="answer(true)">It protects you from large unexpected financial losses</div>
      <div class="option" onclick="answer(false,'Insurance is useful for everyone, not just the wealthy.')">It is only for rich people</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 10) {
    content.innerHTML = `
      <h2>🎉 Lesson Complete!</h2>
      <p>You finished the Insurance module.</p>
      <button onclick="showBadge()">Continue</button>`;
  }
}

function answer(correct, hintText = "") {
  let feedback = document.getElementById("feedback");
  let hint = document.getElementById("hint");
  if (correct) {
    feedback.innerHTML = "✅ Correct!";
    hint.innerHTML = "";
    setTimeout(nextStep, 1000);
  } else {
    feedback.innerHTML = "❌ Incorrect. Try again.";
    hint.innerHTML = "Hint: " + hintText;
  }
}

function showBadge() {
  document.getElementById("lessonContent").innerHTML = `
    <div class="center-screen">
      <h2>🏅 New Badge Earned!</h2>
      <div class="badge">🛡️</div>
      <p class="glow">Risk Manager</p>
      <p>You completed the Insurance module.</p>
      <button onclick="unlockNext()">Continue</button>
    </div>`;
}

function unlockNext() {
  document.getElementById("lessonContent").innerHTML = `
    <div class="center-screen">
      <h2>🔓 Next Module Unlocked!</h2>
      <p>You can now start the <b>Taxes</b> module.</p>
      <button onclick="completeModule()">Return to Dashboard</button>
    </div>`;
}

function completeModule() {
  const API_URL = "http://localhost:5000/api";
  const userId = localStorage.getItem("userId");

  // Update completed modules in localStorage first
  let completed = parseInt(localStorage.getItem("completedModules") || "0");
  completed++;
  localStorage.setItem("completedModules", completed);

  // Try to save to server if available
  fetch(`${API_URL}/progress`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: parseInt(userId),
      module_id: 3,
      completed: true,
      score: 100,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Progress saved to server:", data);
      return fetch(`${API_URL}/badges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          badge_name: "🛡️ Risk Manager",
        }),
      });
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Badge awarded:", data);
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log("Server unavailable, using localStorage only");
      window.location.href = "../index.html";
    });
}
