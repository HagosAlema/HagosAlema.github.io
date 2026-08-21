// Android Simulator (Playroom) Actions

document.addEventListener('DOMContentLoaded', () => {
  initPhoneClock();
  initPhoneNavigation();
  initGitHubApp();
  initComposeSandbox();
  initChatBot();
});

// 1. Live status bar clock
function initPhoneClock() {
  const timeDisplay = document.getElementById('status-time');
  const dateDisplay = document.getElementById('phone-date');

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Formatting
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    timeDisplay.textContent = `${hours}:${minutes}`;

    // Update Date on Home screen
    if (dateDisplay) {
      const options = { weekday: 'long', month: 'short', day: 'numeric' };
      dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
  }

  updateClock();
  setInterval(updateClock, 60000); // update every minute
}

// 2. Multi-App Navigation System
let navigationHistory = ['home'];

function initPhoneNavigation() {
  const appButtons = document.querySelectorAll('.app-icon-wrapper');
  const backBtn = document.getElementById('phone-back');
  const homeBtn = document.getElementById('phone-home-btn');
  const homeScreen = document.getElementById('phone-home');
  const appWindows = document.querySelectorAll('.phone-app-window');

  // Open App
  appButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const appName = btn.getAttribute('data-app');
      openApp(appName);
    });
  });

  // Back Button
  backBtn.addEventListener('click', () => {
    goBack();
  });

  // Home Button
  homeBtn.addEventListener('click', () => {
    goHome();
  });

  function openApp(appName) {
    const targetApp = document.getElementById(`app-${appName}`);
    if (targetApp) {
      // Hide other app windows first
      appWindows.forEach(win => win.classList.remove('active'));
      homeScreen.classList.remove('active');
      
      // Show target
      targetApp.classList.add('active');
      
      // Update history stack
      navigationHistory.push(appName);
    }
  }

  function goBack() {
    if (navigationHistory.length > 1) {
      const currentApp = navigationHistory.pop();
      const previousApp = navigationHistory[navigationHistory.length - 1];

      // Hide current
      const currentWindow = document.getElementById(`app-${currentApp}`);
      if (currentWindow) currentWindow.classList.remove('active');

      // Show previous
      if (previousApp === 'home') {
        homeScreen.classList.add('active');
      } else {
        const prevWindow = document.getElementById(`app-${previousApp}`);
        if (prevWindow) prevWindow.classList.add('active');
      }
    }
  }

  function goHome() {
    if (navigationHistory[navigationHistory.length - 1] !== 'home') {
      // Hide all windows
      appWindows.forEach(win => win.classList.remove('active'));
      homeScreen.classList.add('active');
      
      // Reset stack
      navigationHistory = ['home'];
    }
  }
}

// 3. GitHub Feed App Simulator
function initGitHubApp() {
  const commitsList = document.getElementById('commits-list');
  const mockCommits = [
    { message: "release: v0.1.0 LazyCanvas 2D virtualization engine", repo: "LazyCanvas", date: "Aug 10" },
    { message: "release: v0.1.0 habesha-names-android (names-core & names-compose)", repo: "habesha-names-android", date: "Aug 6" },
    { message: "feat: add viewport gesture transformation matrix & 2D culling", repo: "LazyCanvas", date: "Aug 6" },
    { message: "release: v0.2.0 per-row height virtualization & 48dp touch targets", repo: "compose-grid", date: "Aug 1" },
    { message: "feat: DataGrid joint row & column virtualization on custom LazyLayout", repo: "compose-grid", date: "Aug 1" },
    { message: "feat: Fidel script transliteration & patronymic fuzzy matching", repo: "habesha-names-android", date: "Aug 1" }
  ];

  if (commitsList) {
    commitsList.innerHTML = mockCommits.map(commit => `
      <li class="commit-item">
        <div class="commit-message">${commit.message}</div>
        <div class="commit-meta">HagosAlema/<strong>${commit.repo}</strong> • ${commit.date}</div>
      </li>
    `).join('');
  }
}

// 4. Jetpack Compose Sandbox Simulator
function initComposeSandbox() {
  const optionButtons = document.querySelectorAll('.compose-option-btn');
  const codeTarget = document.getElementById('compose-code');
  const renderTarget = document.getElementById('compose-render');

  const templates = {
    button: {
      code: `Button(\n  onClick = { /* clicked */ },\n  colors = ButtonDefaults.buttonColors()\n) {\n  Text("Click Me")\n}`,
      html: `<button class="simulated-android-btn">Click Me</button>`
    },
    profile: {
      code: `Card(\n  modifier = Modifier.padding(8.dp),\n  elevation = CardDefaults.cardElevation(4.dp)\n) {\n  Row(verticalAlignment = Alignment.CenterVertically) {\n    Avatar(initials = "HA")\n    Column {\n      Text("Hagos Alema", style = Bold)\n      Text("Android Specialist")\n    }\n  }\n}`,
      html: `
        <div class="simulated-profile-card">
          <div class="simulated-profile-avatar" style="display: flex; align-items: center; justify-content: center; color: white; font-size: 0.75rem; font-weight: 700;">HA</div>
          <div class="simulated-profile-info">
            <h6>Hagos Alema</h6>
            <p>Android Specialist</p>
          </div>
        </div>
      `
    },
    counter: {
      code: `var count by remember { mutableStateOf(0) }\nButton(onClick = { count++ }) {\n  Text("Count: $count")\n}`,
      html: `
        <div class="simulated-counter-container">
          <div class="simulated-counter-value" id="simulated-count-val">0</div>
          <button class="simulated-counter-btn" id="simulated-inc-btn">Increment</button>
        </div>
      `
    }
  };

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      optionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const templateKey = btn.getAttribute('data-template');
      if (templates[templateKey]) {
        codeTarget.textContent = templates[templateKey].code;
        renderTarget.innerHTML = templates[templateKey].html;

        if (templateKey === 'counter') {
          bindCounterApp();
        }
      }
    });
  });

  // Bind local count increments
  function bindCounterApp() {
    const incBtn = document.getElementById('simulated-inc-btn');
    const valDisplay = document.getElementById('simulated-count-val');
    let currentVal = 0;

    if (incBtn && valDisplay) {
      incBtn.addEventListener('click', () => {
        currentVal++;
        valDisplay.textContent = currentVal;
      });
    }
  }
}

// 5. Bot Recruiter Chat bot
function initChatBot() {
  const queryButtons = document.querySelectorAll('.chat-query-btn');
  const chatMessages = document.getElementById('chat-messages');

  const botResponses = {
    stack: "I specialize in native Android (Kotlin, Jetpack Compose, JNI C/C++, Edge AI with Gemini Nano & LiteRT) and Blockchain/Backend (Solidity, Rust, Node.js, Express, PostgreSQL, MongoDB, AWS). I focus on security-first, multi-module patterns.",
    availability: "I am currently an Android Engineer at LTCWare. I am open to consulting roles, senior Android engineering, or Web3 full stack positions. Drop me a message in the form below!",
    projects: "My primary production apps are Uniwaffle (C++ MPC crypto wallet with USB cold storage) and BOOM PLAY (prediction DApp in Solidity/Rust).",
    opensource: "I actively publish open-source libraries! Check out 'compose-grid' (published on Sonatype/Maven Central with 2D row/column virtualization) and 'LazyCanvas' (infinitely pannable 2D rendering canvas engine) on my GitHub @HagosAlema."
  };

  queryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const queryType = btn.getAttribute('data-query');
      const userText = btn.textContent;
      const botReply = botResponses[queryType] || "I'm not sure how to answer that. Feel free to contact Hagos directly using the contact form.";

      // 1. Append User Message
      appendMessage(userText, 'user');
      
      // Disable buttons temporarily while typing
      toggleQueryButtons(true);

      // 2. Append Bot Response with simulated typing delay
      setTimeout(() => {
        appendMessage(botReply, 'bot');
        toggleQueryButtons(false);
      }, 1000);
    });
  });

  function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    chatMessages.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: 'smooth'
    });
  }

  function toggleQueryButtons(disable) {
    queryButtons.forEach(btn => {
      btn.disabled = disable;
      btn.style.opacity = disable ? '0.6' : '1';
    });
  }
}
