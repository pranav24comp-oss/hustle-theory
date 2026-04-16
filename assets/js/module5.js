/* Module 5 - Financial Scams & Safety - Using absolute API path for consistency */

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
      <h2>Phishing Scams</h2>
      <div class="scam-example">
        <p>🎣 <b>Phishing</b> is when scammers pretend to be a trusted organization (bank, government, company) to trick you into sharing personal information.</p>
      </div>
      <p><b>Common phishing methods:</b></p>
      <ul>
        <li>Fake emails that look like your bank</li>
        <li>SMS with links saying "Your account is blocked"</li>
        <li>Fake websites that copy real banking sites</li>
        <li>Phone calls pretending to be bank officials</li>
      </ul>
      <div class="scenario">
        <p>✅ <b>Rule:</b> Banks NEVER ask for your password, OTP, or PIN via call/SMS/email.</p>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 2) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>You receive an SMS: "Dear customer, your bank account will be blocked. Click this link to verify: bit.ly/xyz123". What should you do?</p>
      <div class="option" onclick="answer(false,'Never click links in suspicious messages!')">Click the link and enter your details</div>
      <div class="option" onclick="answer(false,'Replying confirms your number is active to scammers.')">Reply with your account number</div>
      <div class="option" onclick="answer(true)">Ignore it and contact your bank directly</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 3) {
    content.innerHTML = `
      <h2>OTP Scams</h2>
      <div class="scam-example">
        <p>🔢 <b>OTP scams</b> happen when someone tricks you into sharing your One-Time Password, which gives them access to your bank account or UPI.</p>
      </div>
      <p><b>How it works:</b></p>
      <ul>
        <li>Scammer calls pretending to be from your bank or UPI app</li>
        <li>They say "We need your OTP to process a refund/verify your account"</li>
        <li>Once you share the OTP, they transfer money from your account</li>
      </ul>
      <div class="scenario">
        <p>✅ <b>Rule:</b> NEVER share your OTP with anyone. No legitimate company will ever ask for it.</p>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 4) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>Someone calls you saying they're from your UPI app and need your OTP to "process a refund". What should you do?</p>
      <div class="option" onclick="answer(false,'This is exactly how OTP scams work!')">Give them the OTP since it's a refund</div>
      <div class="option" onclick="answer(true)">Hang up immediately – it's a scam</div>
      <div class="option" onclick="answer(false,'Sharing any personal info with unknown callers is risky.')">Ask them to call back and share it then</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 5) {
    content.innerHTML = `
      <h2>Fake Investment Schemes</h2>
      <div class="scam-example">
        <p>💸 <b>Ponzi schemes and fake investments</b> promise unrealistic returns like "Double your money in 30 days!" or "Guaranteed 50% monthly returns!"</p>
      </div>
      <p><b>Red flags:</b></p>
      <ul>
        <li>🚩 Guaranteed high returns with zero risk</li>
        <li>🚩 Pressure to invest quickly ("Limited time offer!")</li>
        <li>🚩 No proper registration with SEBI or RBI</li>
        <li>🚩 Returns paid from new investors' money, not actual profits</li>
        <li>🚩 Celebrity endorsements or social media hype</li>
      </ul>
      <div class="scenario">
        <p>✅ <b>Rule:</b> If it sounds too good to be true, it probably is.</p>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 6) {
    content.innerHTML = `
      <h2>Quiz</h2>
      <p>An Instagram ad says "Invest ₹10,000 and get ₹1,00,000 in just 7 days! 100% guaranteed!" What is this?</p>
      <div class="option" onclick="answer(false,'No legitimate investment can guarantee 10x returns in a week.')">A great investment opportunity</div>
      <div class="option" onclick="answer(true)">A scam / Ponzi scheme</div>
      <div class="option" onclick="answer(false,'This is clearly a fraudulent scheme.')">A government scheme</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 7) {
    content.innerHTML = `
      <h2>Digital Safety Tips</h2>
      <div class="scenario">
        <p>🔒 <b>Protect yourself online:</b></p>
        <ul>
          <li>Use <b>strong, unique passwords</b> for each account</li>
          <li>Enable <b>two-factor authentication (2FA)</b> everywhere</li>
          <li>Never use public Wi-Fi for banking</li>
          <li>Check for <b>https://</b> before entering details on any website</li>
          <li>Keep your apps and phone updated</li>
          <li>Don't store passwords in plain text</li>
        </ul>
      </div>
      <button onclick="nextStep()">Continue</button>`;
  } else if (step == 8) {
    content.innerHTML = `
      <h2>🚨 Spot the Scam!</h2>
      <p>Which of these messages is a SCAM?</p>
      <div class="scam-example">
        <p><b>Message A:</b> "Congrats! You've won ₹50 lakhs in the KBC lottery! Send ₹5,000 processing fee to claim your prize."</p>
      </div>
      <div class="scenario">
        <p><b>Message B:</b> "Your electricity bill of ₹1,250 is due on 25th March. Pay via the official portal."</p>
      </div>
      <div class="option" onclick="answer(true)">Message A is a scam</div>
      <div class="option" onclick="answer(false,'Message B uses an official portal and doesn\\'t ask for personal info.')">Message B is a scam</div>
      <div class="option" onclick="answer(false,'One of them has clear scam indicators.')">Both are legitimate</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 9) {
    content.innerHTML = `
      <h2>Final Quiz</h2>
      <p>What is the BEST way to protect yourself from financial scams?</p>
      <div class="option" onclick="answer(false,'Avoiding digital payments entirely isn\\'t practical. Being careful is key.')">Never use digital payments</div>
      <div class="option" onclick="answer(true)">Stay informed, verify before sharing info, and never share OTPs</div>
      <div class="option" onclick="answer(false,'Trusting all messages without verification is exactly how scams succeed.')">Trust all messages from banks</div>
      <p id="feedback"></p><p id="hint"></p>`;
  } else if (step == 10) {
    content.innerHTML = `
      <h2>🎉 Lesson Complete!</h2>
      <p>You finished the Financial Scams & Safety module.</p>
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
      <p class="glow">Scam Shield</p>
      <p>You completed the Financial Scams & Safety module.</p>
      <button onclick="unlockNext()">Continue</button>
    </div>`;
}

function unlockNext() {
  document.getElementById("lessonContent").innerHTML = `
    <div class="center-screen">
      <h2>🎖️ All Modules Complete!</h2>
      <div class="badge">🏆</div>
      <p class="glow">Hustle Master</p>
      <p>Congratulations! You have completed all 5 modules of Hustle Theory!</p>
      <p>You are now financially literate and ready to hustle smart. 💪</p>
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
      module_id: 5,
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
          badge_name: "🛡️ Scam Shield",
        }),
      });
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Badge awarded:", data);
      // Award final badge for completing all modules
      return fetch(`${API_URL}/badges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: parseInt(userId),
          badge_name: "🏆 Hustle Master",
        }),
      });
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Final badge awarded:", data);
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log("Server unavailable, using localStorage only");
      window.location.href = "../index.html";
    });
}
