/* Module 4 - Taxes - Using absolute API path for consistency */

const API_URL = "http://localhost:5000/api";
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
      <h2>What Are Taxes?</h2>
      <p>A <b>tax</b> is a compulsory contribution to the government. It is used to fund public services and infrastructure.</p>
      <p><b>Types of Taxes:</b></p>
      <ul>
        <li><b>Direct Tax</b> – Paid directly to the government (e.g., Income Tax)</li>
        <li><b>Indirect Tax</b> – Added to the price of goods/services (e.g., GST)</li>
      </ul>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 2) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>Which of the following is a direct tax?</p>
      <div class="option" onclick="answer(true)">Income Tax</div>
      <div class="option" onclick="answer(false,'GST is an indirect tax added to goods and services.')">GST</div>
      <div class="option" onclick="answer(false,'Sales tax is an indirect tax charged at the point of sale.')">Sales Tax</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 3) {
    content.innerHTML = `
      <h2>Why Do Governments Collect Tax?</h2>
      <p>Tax revenue funds essential public services:</p>
      <ul>
        <li>🏥 <b>Healthcare</b> – Public hospitals and health programs</li>
        <li>🏫 <b>Education</b> – Government schools and universities</li>
        <li>🛣️ <b>Infrastructure</b> – Roads, bridges, railways</li>
        <li>🛡️ <b>Defense</b> – Army, navy, air force</li>
        <li>👮 <b>Law & Order</b> – Police, courts, public safety</li>
      </ul>
      <p>Without taxes, these services would not exist.</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 4) {
    content.innerHTML = `
      <h2>Income Tax Basics</h2>
      <p><b>Income tax</b> is a percentage of your earnings paid to the government annually.</p>
      <div class="tax-calculator">
        <p><b>New Tax Regime (India 2024-25):</b></p>
        <ul>
          <li>Up to ₹3,00,000 → <b>No tax</b></li>
          <li>₹3,00,001 – ₹6,00,000 → <b>5%</b></li>
          <li>₹6,00,001 – ₹9,00,000 → <b>10%</b></li>
          <li>₹9,00,001 – ₹12,00,000 → <b>15%</b></li>
          <li>₹12,00,001 – ₹15,00,000 → <b>20%</b></li>
          <li>Above ₹15,00,000 → <b>30%</b></li>
        </ul>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 5) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>If someone earns ₹2,50,000 per year, how much income tax do they pay?</p>
      <div class="option" onclick="answer(true)">₹0 (No tax)</div>
      <div class="option" onclick="answer(false,'Income up to ₹3,00,000 is tax-free under the new regime.')">₹12,500</div>
      <div class="option" onclick="answer(false,'Check the tax slabs again — this income falls in the zero-tax bracket.')">₹25,000</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 6) {
    content.innerHTML = `
      <h2>GST – Goods & Services Tax</h2>
      <p><b>GST</b> is an indirect tax applied to the sale of goods and services in India.</p>
      <p><b>GST Slabs:</b></p>
      <ul>
        <li><b>0%</b> – Essential items (milk, fruits, vegetables)</li>
        <li><b>5%</b> – Basic necessities (sugar, tea, edible oil)</li>
        <li><b>12%</b> – Standard goods (processed food, mobile phones)</li>
        <li><b>18%</b> – Most services (restaurants, IT services)</li>
        <li><b>28%</b> – Luxury items (cars, tobacco, aerated drinks)</li>
      </ul>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 7) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>What GST rate applies to luxury items like cars?</p>
      <div class="option" onclick="answer(false,'5% is for basic necessities.')">5%</div>
      <div class="option" onclick="answer(false,'18% applies to most regular services.')">18%</div>
      <div class="option" onclick="answer(true)">28%</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 8) {
    content.innerHTML = `
      <h2>🧾 Mini Tax Calculator</h2>
      <p>Enter your annual income to see an approximate tax calculation (New Regime):</p>
      <div class="tax-calculator">
        <p>Annual Income (₹): <input type="number" id="taxIncome" value="500000"></p>
        <button onclick="calcTax()" style="background:#16a34a;">Calculate Tax</button>
        <p id="taxResult"></p>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 9) {
    content.innerHTML = `
      <h2>Final Quiz</h2>
      <p>What is the difference between direct and indirect tax?</p>
      <div class="option" onclick="answer(true)">Direct tax is paid directly to the government; indirect tax is added to goods/services</div>
      <div class="option" onclick="answer(false,'Both types of taxes are collected by the government.')">Direct tax goes to companies; indirect tax goes to the government</div>
      <div class="option" onclick="answer(false,'There is a clear difference between the two.')">There is no difference</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 10) {
    content.innerHTML = `
      <h2>🎉 Lesson Complete!</h2>
      <p>You finished the Taxes module.</p>
      <button onclick="showBadge()">Continue</button>`;
  }
}

function calcTax() {
  let income = parseFloat(document.getElementById("taxIncome").value);
  let tax = 0;
  if (income > 1500000) tax += (income - 1500000) * 0.3;
  if (income > 1200000) tax += (Math.min(income, 1500000) - 1200000) * 0.2;
  if (income > 900000) tax += (Math.min(income, 1200000) - 900000) * 0.15;
  if (income > 600000) tax += (Math.min(income, 900000) - 600000) * 0.1;
  if (income > 300000) tax += (Math.min(income, 600000) - 300000) * 0.05;
  document.getElementById("taxResult").innerHTML =
    "📊 Estimated Tax: ₹" +
    tax.toFixed(0) +
    " | Effective Rate: " +
    ((tax / income) * 100).toFixed(1) +
    "%";
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
      <div class="badge">🧾</div>
      <p class="glow">Tax Ninja</p>
      <p>You completed the Taxes module.</p>
      <button onclick="unlockNext()">Continue</button>
    </div>`;
}

function unlockNext() {
  document.getElementById("lessonContent").innerHTML = `
    <div class="center-screen">
      <h2>🔓 Next Module Unlocked!</h2>
      <p>You can now start the <b>Financial Scams & Safety</b> module.</p>
      <button onclick="completeModule()">Return to Dashboard</button>
    </div>`;
}

function completeModule() {
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
      module_id: 4,
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
          badge_name: "🧾 Tax Ninja",
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
