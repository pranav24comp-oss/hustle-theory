/* Module 2 - Investments - Using relative API path (works with or without server) */

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
      <h2>What is Investing?</h2>
      <p><b>Investing</b> is the act of allocating money into assets with the expectation of generating profit or income over time.</p>
      <p>Unlike saving (which preserves money), investing aims to <b>grow</b> your wealth. However, all investments carry some level of risk.</p>
      <p>Key principle: <b>Higher risk = Higher potential return</b></p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 2) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>What is the main goal of investing?</p>
      <div class="option" onclick="answer(false,'Investing is about growth, not just keeping money safe.')">To keep money safe under a mattress</div>
      <div class="option" onclick="answer(true)">To grow wealth over time</div>
      <div class="option" onclick="answer(false,'Investing is the opposite of spending.')">To spend money faster</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 3) {
    content.innerHTML = `
      <h2>Types of Investments</h2>
      <p><b>Stocks</b> – Buying a small ownership share in a company. High risk, high reward.</p>
      <p><b>Mutual Funds</b> – A pool of money from many investors, managed by professionals. Medium risk.</p>
      <p><b>Fixed Deposits (FDs)</b> – Money deposited in a bank for a fixed period at guaranteed interest. Low risk.</p>
      <p><b>Gold</b> – A traditional investment that tends to hold value over time.</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 4) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>Which investment type is generally considered the lowest risk?</p>
      <div class="option" onclick="answer(false,'Stocks can be very volatile and risky.')">Stocks</div>
      <div class="option" onclick="answer(false,'Mutual funds carry medium risk depending on the type.')">Mutual Funds</div>
      <div class="option" onclick="answer(true)">Fixed Deposits</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 5) {
    content.innerHTML = `
      <h2>Risk vs Return</h2>
      <p>Every investment has a balance between <b>risk</b> (chance of losing money) and <b>return</b> (profit earned).</p>
      <ul>
        <li><b>Low Risk, Low Return:</b> Fixed Deposits, Savings Accounts</li>
        <li><b>Medium Risk, Medium Return:</b> Mutual Funds, Gold</li>
        <li><b>High Risk, High Return:</b> Stocks, Cryptocurrency</li>
      </ul>
      <p>A smart investor <b>diversifies</b> – spreading money across different types to reduce overall risk.</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 6) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>What does "diversification" mean in investing?</p>
      <div class="option" onclick="answer(false,'Putting all money in one place increases risk.')">Putting all money in one stock</div>
      <div class="option" onclick="answer(true)">Spreading investments across different asset types</div>
      <div class="option" onclick="answer(false,'Avoiding investing means missing out on growth.')">Avoiding all investments</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 7) {
    content.innerHTML = `
      <h2>Compound Interest</h2>
      <p>Compound interest is <b>interest earned on interest</b>. It's the most powerful concept in investing.</p>
      <p>Formula: <b>A = P × (1 + r)ⁿ</b></p>
      <ul>
        <li><b>P</b> = Principal (initial amount)</li>
        <li><b>r</b> = Annual interest rate</li>
        <li><b>n</b> = Number of years</li>
        <li><b>A</b> = Final amount</li>
      </ul>
      <p>Example: ₹10,000 at 10% for 5 years = ₹16,105</p>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 8) {
    content.innerHTML = `
      <h2>💰 Investment Simulator</h2>
      <p>Try it yourself! Enter values to see how your money grows.</p>
      <div class="simulator">
        <p>Principal (₹): <input type="number" id="simPrincipal" value="10000"></p>
        <p>Annual Rate (%): <input type="number" id="simRate" value="10"></p>
        <p>Years: <input type="number" id="simYears" value="5"></p>
        <button onclick="simulate()" style="background:#16a34a;">Calculate</button>
        <p id="simResult"></p>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 9) {
    content.innerHTML = `
      <h2>Final Quiz</h2>
      <p>If you invest ₹1,000 at 10% compound interest for 2 years, approximately how much will you have?</p>
      <div class="option" onclick="answer(false,'With compound interest, you earn interest on interest too.')">₹1,100</div>
      <div class="option" onclick="answer(true)">₹1,210</div>
      <div class="option" onclick="answer(false,'That would require a much higher rate.')">₹1,500</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 10) {
    content.innerHTML = `
      <h2>🎉 Lesson Complete!</h2>
      <p>You finished the Investments module.</p>
      <button onclick="showBadge()">Continue</button>`;
  }
}

function simulate() {
  let p = parseFloat(document.getElementById("simPrincipal").value);
  let r = parseFloat(document.getElementById("simRate").value) / 100;
  let n = parseInt(document.getElementById("simYears").value);
  let a = p * Math.pow(1 + r, n);
  document.getElementById("simResult").innerHTML =
    "Final Amount: ₹" + a.toFixed(2) + " (Profit: ₹" + (a - p).toFixed(2) + ")";
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
      <div class="badge">💰</div>
      <p class="glow">Smart Investor</p>
      <p>You completed the Investments module.</p>
      <button onclick="unlockNext()">Continue</button>
    </div>`;
}

function unlockNext() {
  document.getElementById("lessonContent").innerHTML = `
    <div class="center-screen">
      <h2>🔓 Next Module Unlocked!</h2>
      <p>You can now start the <b>Insurance</b> module.</p>
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
      module_id: 2,
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
          badge_name: "💰 Smart Investor",
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
