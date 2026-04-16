/* Dashboard - Using absolute API path for consistency */

const API_URL = "http://localhost:5000/api";
let userId = localStorage.getItem("userId");
let user = localStorage.getItem("loggedInUser");
let completedModules = parseInt(
  localStorage.getItem("completedModules") || "0",
);

// Debug info
console.log("Dashboard init - userId:", userId, "user:", user, "completedModules:", completedModules);

// Check if user is logged in
if (!user || !userId) {
  window.location.href = "auth.html";
}

// Display welcome message
if (user) {
  document.getElementById("welcomeUser").innerText = "Welcome, " + user + " 👋";
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("userId");
  localStorage.removeItem("completedModules");
  window.location.href = "auth.html";
}

// Load user progress from server or localStorage
async function loadProgress() {
  console.log("loadProgress called with userId:", userId);
  try {
    const endpoint = `${API_URL}/progress/${userId}`;
    console.log("Fetching from:", endpoint);
    const response = await fetch(endpoint);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const progressData = await response.json();
    console.log("Progress data from server:", progressData);

    // Calculate completed modules - explicitly check for truthy values
    completedModules = progressData.filter((p) => {
      const isCompleted = p.completed === true || p.completed === 1 || p.completed === "1";
      console.log(`Module ${p.module_id}: completed=${p.completed} (isCompleted: ${isCompleted})`);
      return isCompleted;
    }).length;
    localStorage.setItem("completedModules", completedModules);
    console.log("Progress loaded from server:", completedModules, "modules completed");
  } catch (error) {
    console.error("Error loading progress from server:", error);
    // Use localStorage if server is down
    completedModules = parseInt(
      localStorage.getItem("completedModules") || "0",
    );
    console.log("Falling back to localStorage:", completedModules);
  }

  // Update progress bar
  let progress = completedModules * 20;
  document.querySelector(".progress-fill").style.width = progress + "%";
  document.getElementById("progressText").innerText =
    "Progress: " + progress + "% Completed";

  // Unlock modules based on completed modules
  for (let i = 2; i <= 5; i++) {
    if (i <= completedModules + 1) {
      document.getElementById("status" + i).innerText = "Unlocked ✅";
      document.getElementById("status" + i).style.color = "#228B22";
    }
  }

  // Load badges
  await loadBadges();
}

// Load badges from server or localStorage
async function loadBadges() {
  let badgeContainer = document.getElementById("badgeContainer");
  badgeContainer.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/badges/${userId}`);
    const badges = await response.json();

    if (badges.length === 0) {
      badgeContainer.innerHTML =
        "<p>No badges yet. Complete modules to unlock rewards!</p>";
    } else {
      badges.forEach((badge) => {
        badgeContainer.innerHTML += `<div class="dashboard-badge">${badge.badge_name}</div>`;
      });
    }
  } catch (error) {
    console.log("Loading badges from localStorage");
    // Fallback to local display based on completedModules
    if (completedModules >= 1) {
      badgeContainer.innerHTML +=
        '<div class="dashboard-badge">🏆 Budget Boss</div>';
    }
    if (completedModules >= 2) {
      badgeContainer.innerHTML +=
        '<div class="dashboard-badge">💰 Smart Investor</div>';
    }
    if (completedModules >= 3) {
      badgeContainer.innerHTML +=
        '<div class="dashboard-badge">🛡️ Risk Manager</div>';
    }
    if (completedModules >= 4) {
      badgeContainer.innerHTML +=
        '<div class="dashboard-badge">🧾 Tax Ninja</div>';
    }
    if (completedModules >= 5) {
      badgeContainer.innerHTML +=
        '<div class="dashboard-badge">🛡️ Scam Shield</div>';
    }

    if (completedModules === 0) {
      badgeContainer.innerHTML =
        "<p>No badges yet. Complete modules to unlock rewards!</p>";
    }
  }
}

function startModule(moduleNumber) {
  if (moduleNumber <= completedModules + 1) {
    window.location.href = "modules/module" + moduleNumber + ".html";
  } else {
    alert("Complete previous modules first! 📚");
  }
}

/* Finance Tracker */
function openTracker() {
  window.location.href = "tracker.html";
}

// Load progress when page loads
loadProgress();
