// Financial Challenges - Learn by completing challenges

const API_BASE = 'http://localhost:5000/api';
let currentUserId = localStorage.getItem('userId');
let completedChallenges = [];
let currentChallenge = null;

if (!currentUserId) {
  window.location.href = 'auth.html';
}

// Challenge Database
const challenges = [
  {
    id: 1,
    title: 'Budget Your Month',
    icon: '📊',
    category: 'budgeting',
    description: 'Create a budget plan for the next month by dividing your expenses into categories.',
    learning: 'Learn how to allocate money wisely across needs, wants, and savings',
    reward: 50,
    instructions: 'Write down all your monthly expenses and categorize them. Practice the 50-30-20 rule.'
  },
  {
    id: 2,
    title: 'Understand Compound Interest',
    icon: '📈',
    category: 'investing',
    description: 'Calculate how much ₹1000 grows in 10 years with compound interest.',
    learning: 'Discover how money grows exponentially over time with compound interest',
    reward: 75,
    instructions: 'Use the formula or calculator: A = P(1 + r/n)^nt. Try different interest rates!'
  },
  {
    id: 3,
    title: 'Track Your Spending',
    icon: '💳',
    category: 'budgeting',
    description: 'Track all your expenses for one week and identify where you spend the most.',
    learning: 'Understand your spending patterns and find areas to save money',
    reward: 40,
    instructions: 'Write down every purchase for 7 days. Categorize and analyze your spending.'
  },
  {
    id: 4,
    title: 'Emergency Fund Goal',
    icon: '🏦',
    category: 'saving',
    description: 'Calculate how much emergency fund you need (3-6 months of expenses).',
    learning: 'Learn why emergency funds are crucial for financial safety',
    reward: 60,
    instructions: 'Calculate your monthly expenses and determine your emergency fund target.'
  },
  {
    id: 5,
    title: 'Compare Investment Options',
    icon: '💼',
    category: 'investing',
    description: 'Compare returns of savings account, mutual funds, and stocks.',
    learning: 'Understand different investment vehicles and their risk-return profiles',
    reward: 80,
    instructions: 'Research and compare interest rates, returns, and risks of different investments.'
  },
  {
    id: 6,
    title: 'Calculate Your Net Worth',
    icon: '💰',
    category: 'learning',
    description: 'Calculate your total assets minus liabilities to find your net worth.',
    learning: 'Learn how to measure your financial health with net worth',
    reward: 55,
    instructions: 'List all assets (savings, gadgets) and liabilities (loans, debts). Subtract to find net worth.'
  },
  {
    id: 7,
    title: 'Debt Payoff Plan',
    icon: '📋',
    category: 'saving',
    description: 'Create a strategic plan to pay off any debt in the shortest time.',
    learning: 'Learn strategies to become debt-free and build wealth',
    reward: 85,
    instructions: 'List debts, calculate interest, and plan a payment strategy.'
  },
  {
    id: 8,
    title: 'Understand Inflation',
    icon: '📉',
    category: 'learning',
    description: 'Research and explain how inflation affects your buying power.',
    learning: 'Learn why inflation matters and how to protect your savings',
    reward: 65,
    instructions: 'Research inflation rate in your country. Calculate how much ₹100 today will be worth in 10 years.'
  },
  {
    id: 9,
    title: 'Build a Shopping List Budget',
    icon: '🛒',
    category: 'budgeting',
    description: 'Plan groceries for a week and stick to a ₹2000 budget.',
    learning: 'Learn smart shopping habits and budget awareness',
    reward: 45,
    instructions: 'Plan weekly meals, list items, check prices, and stay within budget.'
  },
  {
    id: 10,
    title: 'Diversify Your Investments',
    icon: '🎯',
    category: 'investing',
    description: 'Create a diversified investment portfolio with different asset types.',
    learning: 'Understand why diversification reduces risk and increases returns',
    reward: 90,
    instructions: 'Allocate ₹10000 across stocks, bonds, mutual funds, and savings accounts.'
  },
  {
    id: 11,
    title: 'Identify Scams',
    icon: '🛡️',
    category: 'learning',
    description: 'Learn to recognize and avoid common financial scams and fraud.',
    learning: 'Protect yourself from phishing, fake calls, and financial fraud',
    reward: 70,
    instructions: 'Research common scams. Write down red flags and how to verify legitimacy.'
  },
  {
    id: 12,
    title: 'Calculate EMI',
    icon: '🧮',
    category: 'saving',
    description: 'Learn to calculate EMI (Equated Monthly Installment) for loans.',
    learning: 'Understand how loan EMI works before borrowing money',
    reward: 55,
    instructions: 'Calculate EMI for different loan amounts, interest rates, and time periods.'
  }
];

// Financial facts for mascot
const financialFacts = [
  '💡 Compound interest is the 8th wonder of the world!',
  '💰 The 50-30-20 rule: Spend 50% on needs, 30% on wants, and save 20%.',
  '📈 Time in the market beats timing the market. Start investing young!',
  '🎯 Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound.',
  '💳 Credit score matters! Build it by paying bills on time.',
  '🏦 Emergency fund: Save 3-6 months of expenses for unexpected situations.',
  '📚 Financial literacy is a superpower. Keep learning!',
  '🎁 Reward yourself for completing financial goals and challenges!',
  '💸 Track your spending to understand where your money goes.',
  '🚀 Diversify your investments to reduce risk and increase returns.'
];

document.addEventListener('DOMContentLoaded', function () {
  loadCompletedChallenges();
  renderChallenges();
  updateStats();
});

function loadCompletedChallenges() {
  const saved = localStorage.getItem('completedChallenges');
  completedChallenges = saved ? JSON.parse(saved) : [];
}

function renderChallenges() {
  const grid = document.getElementById('challengesGrid');
  grid.innerHTML = '';

  challenges.forEach(challenge => {
    const isCompleted = completedChallenges.includes(challenge.id);
    
    const card = document.createElement('div');
    card.className = `challenge-card ${isCompleted ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="challenge-icon">${challenge.icon}</div>
      <div class="challenge-content">
        <div class="challenge-title">${challenge.title}</div>
        <div class="challenge-description">${challenge.description}</div>
        <div class="challenge-reward">
          <span>Reward:</span>
          <span class="reward-amount">+₹${challenge.reward}</span>
        </div>
        <button 
          class="challenge-button ${isCompleted ? 'completed' : ''}"
          onclick="showChallenge(${challenge.id})"
        >
          ${isCompleted ? '✓ Completed' : 'Start Challenge'}
        </button>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

function showChallenge(id) {
  currentChallenge = challenges.find(c => c.id === id);
  const isCompleted = completedChallenges.includes(id);

  document.getElementById('detailIcon').textContent = currentChallenge.icon;
  document.getElementById('detailTitle').textContent = currentChallenge.title;
  document.getElementById('detailDescription').innerHTML = `
    <strong>Challenge:</strong><br>
    ${currentChallenge.description}
    <br><br>
    <strong>Instructions:</strong><br>
    ${currentChallenge.instructions}
  `;
  
  document.getElementById('detailLearning').innerHTML = `
    <h4>📚 What You'll Learn</h4>
    <p>${currentChallenge.learning}</p>
  `;
  
  document.getElementById('detailReward').innerHTML = `
    <p>Complete to earn ₹${currentChallenge.reward}!</p>
  `;

  const completeBtn = document.getElementById('completeBtn');
  if (isCompleted) {
    completeBtn.textContent = '✓ Already Completed';
    completeBtn.classList.add('completed');
    completeBtn.disabled = true;
  } else {
    completeBtn.textContent = 'Mark as Completed';
    completeBtn.classList.remove('completed');
    completeBtn.disabled = false;
  }

  document.getElementById('detailModal').style.display = 'flex';
}

function closeDetail() {
  document.getElementById('detailModal').style.display = 'none';
}

async function completeChallenge() {
  if (!currentChallenge) return;
  if (completedChallenges.includes(currentChallenge.id)) return;

  // Mark as completed locally
  completedChallenges.push(currentChallenge.id);
  localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));

  // Add money to wallet
  try {
    await fetch(`${API_BASE}/wallet/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: parseInt(currentUserId),
        amount: currentChallenge.reward,
        reason: `Completed challenge: ${currentChallenge.title}`
      })
    });
  } catch (error) {
    console.error('Error adding to wallet:', error);
  }

  // Show celebration
  showCelebration();

  // Update UI
  updateStats();
  renderChallenges();
  closeDetail();
}

function showCelebration() {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 2000;
    text-align: center;
    animation: popupAppear 0.5s ease;
  `;

  popup.innerHTML = `
    <div style="font-size: 3em; margin-bottom: 20px;">🎉</div>
    <h2 style="margin: 0 0 10px 0; font-size: 2em;">Challenge Completed!</h2>
    <p style="margin: 10px 0; font-size: 1.3em;">+₹${currentChallenge.reward}</p>
    <p style="margin: 10px 0;">Added to your wallet!</p>
  `;

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}

function updateStats() {
  const completed = completedChallenges.length;
  const totalEarned = completedChallenges.reduce((sum, id) => {
    const challenge = challenges.find(c => c.id === id);
    return sum + (challenge ? challenge.reward : 0);
  }, 0);

  document.getElementById('completedCount').textContent = completed;
  document.getElementById('totalEarned').textContent = '₹' + totalEarned;
  document.getElementById('learningPoints').textContent = completed * 10;
}

function showFinancialFact() {
  const randomFact = financialFacts[Math.floor(Math.random() * financialFacts.length)];
  document.getElementById('factText').textContent = randomFact;
  document.getElementById('factModal').style.display = 'block';
}

function closeFactModal() {
  document.getElementById('factModal').style.display = 'none';
}

window.onclick = function (event) {
  const modal = document.getElementById('factModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

function logout() {
  localStorage.removeItem('userId');
  localStorage.removeItem('loggedInUser');
  window.location.href = 'auth.html';
}
