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
<h2>Income Types</h2>
<p><b>Active Income</b></p>
<p>Money earned by working and using your time or skills.
Examples include salaries, wages, freelancing, or tutoring.</p>
<p><b>Passive Income</b></p>
<p>Money earned with minimal effort, often from investments.
Examples include rental income, dividends, and bank interest.</p>
<button onclick="nextStep()">Continue</button>
`;
  } else if (step == 2) {
    content.innerHTML = `
<h2>Quiz</h2>
<p>Which of these is an example of passive income?</p>
<div class="option" onclick="answer(false,'Passive income usually comes from investments or assets.')">Monthly salary</div>
<div class="option" onclick="answer(true)">Rental income</div>
<div class="option" onclick="answer(false,'Think of money earned without actively working every day.')">Working overtime</div>
<p id="feedback"></p>
<p id="hint"></p>
`;
  } else if (step == 3) {
    content.innerHTML = `
<h2>Expense Types</h2>
<p><b>Mandatory Expenses</b></p>
<p>These are essential costs required for living such as rent,
electricity bills, groceries and transport.</p>
<p><b>Discretionary Expenses</b></p>
<p>These are optional expenses related to lifestyle and wants
like entertainment, gaming, dining out and shopping.</p>
<button onclick="nextStep()">Continue</button>
`;
  } else if (step == 4) {
    content.innerHTML = `
<h2>Quiz</h2>
<p>Which of these is a discretionary expense?</p>
<div class="option" onclick="answer(false,'Mandatory expenses are essential for daily living.')">Paying rent</div>
<div class="option" onclick="answer(true)">Watching a movie in theatre</div>
<div class="option" onclick="answer(false,'Think about something you need to survive.')">Electricity bill</div>
<p id="feedback"></p>
<p id="hint"></p>
`;
  } else if (step == 5) {
    content.innerHTML = `
<h2>Budgeting Basics</h2>
<p>Budgeting means planning how you spend and save money.</p>
<p>A popular budgeting strategy is the <b>50-30-20 rule</b>.</p>
<ul>
<li><b>50%</b> of income goes to Needs (rent, food, bills)</li>
<li><b>30%</b> goes to Wants (shopping, entertainment)</li>
<li><b>20%</b> goes to Savings and Investments</li>
</ul>
<button onclick="nextStep()">Continue</button>

`;
  } else if (step == 6) {
    content.innerHTML = `
<h2>Quiz</h2>
<p>According to the 50-30-20 rule, how much should go to savings?</p>
<div class="option" onclick="answer(false,'Savings is a smaller portion reserved for future goals.')">50%</div>
<div class="option" onclick="answer(false,'30% is usually used for wants.')">30%</div>
<div class="option" onclick="answer(true)">20%</div>
<p id="feedback"></p>
<p id="hint"></p>
`;
  } else if (step == 7) {
    content.innerHTML = `
<h2>Quiz</h2>
<p>If your monthly income is ₹10,000, how much should go to savings using the 50-30-20 rule?</p>
<div class="option" onclick="answer(false,'Calculate 20% of 10,000.')">₹1,000</div>
<div class="option" onclick="answer(true)">₹2,000</div>
<div class="option" onclick="answer(false,'That is too large according to the rule.')">₹5,000</div>
<p id="feedback"></p>
<p id="hint"></p>
`;
  } else if (step == 8) {
    content.innerHTML = `
<h2>Managing Your Money</h2>
<p><b>Track Spending</b> – Record daily expenses.</p>
<p><b>Prioritize Needs</b> – Pay essential expenses first.</p>
<p><b>Build Emergency Savings</b> – Save for unexpected situations.</p>
<p><b>Invest for the Future</b> – Investing helps grow wealth over time.</p>
<button onclick="nextStep()">Continue</button>
`;
  } else if (step == 9) {
    content.innerHTML = `
<h2>Final Quiz</h2>
<p>Why is budgeting important?</p>
<div class="option" onclick="answer(true)">It helps control spending and increase savings</div>
<div class="option" onclick="answer(false,'Budgeting is about managing money responsibly.')">It helps spend more money</div>
<div class="option" onclick="answer(false,'Saving money is actually one of the main purposes of budgeting.')">It removes the need to save</div>
<p id="feedback"></p>
<p id="hint"></p>
`;
  } else if (step == 10) {
    content.innerHTML = `
<h2>🎉 Lesson Complete!</h2>
<p>You finished the Income & Expenses module.</p>
<button onclick="showBadge()">Continue</button>
`;
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
  let content = document.getElementById("lessonContent");
  content.innerHTML = `
<div class="center-screen">
<h2>🏅 New Badge Earned!</h2>
<div class="lesson-badge">🏅</div>
<p class="glow">Budget Boss</p>
<p>You completed the Income & Expenses module.</p>
<button onclick="unlockNext()">Continue</button>
</div>
`;
}
function unlockNext() {
  let content = document.getElementById("lessonContent");
  content.innerHTML = `
<div class="center-screen">
<h2>🔓 Next Module Unlocked!</h2>
<p>You can now start the <b>Investments</b> module.</p>
<button onclick="completeModule()">Return to Dashboard</button>
</div>
`;
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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: parseInt(userId),
      module_id: 1,
      completed: true,
      score: 100,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Progress saved to server:", data);

      // Award badge
      return fetch(`${API_URL}/badges`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          badge_name: "🏆 Budget Boss",
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
      // Redirect anyway since localStorage was updated
      window.location.href = "../index.html";
    });
}
