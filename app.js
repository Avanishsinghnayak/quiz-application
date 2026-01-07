/* Quiz App - Plain JS */

const QUESTIONS = [
  {
    category: "Web Basics",
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlink and Text Markup Language",
      "Home Tool Markup Language",
    ],
    answerIndex: 0,
  },
  {
    category: "CSS",
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    answerIndex: 2,
  },
  {
    category: "JavaScript",
    question: "Which keyword is used to declare a block-scoped variable?",
    options: ["var", "let", "define", "static"],
    answerIndex: 1,
  },
  {
    category: "General",
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
    answerIndex: 2,
  },
  {
    category: "Computer Science",
    question: "What is the time complexity of binary search in a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answerIndex: 1,
  },
  {
    category: "Networking",
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "HyperText Transmission Program",
      "High Transfer Text Protocol",
      "Hyper Transfer Text Process",
    ],
    answerIndex: 0,
  },
];

const appState = {
  idx: 0,
  selectedByIndex: new Array(QUESTIONS.length).fill(null),
  score: 0,
};

// Elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const nextBtn = document.getElementById("nextBtn");

const categoryPill = document.getElementById("categoryPill");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const hintText = document.getElementById("hintText");

const progressLabel = document.getElementById("progressLabel");
const progressMeta = document.getElementById("progressMeta");
const progressFill = document.getElementById("progressFill");
const progressBar = progressFill?.parentElement;

const resultSummary = document.getElementById("resultSummary");
const scoreNumber = document.getElementById("scoreNumber");
const scoreOutOf = document.getElementById("scoreOutOf");
const scoreMeta = document.getElementById("scoreMeta");

function showScreen(screen) {
  startScreen.classList.add("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");

  screen.classList.remove("hidden");
}

function answeredCount() {
  return appState.selectedByIndex.filter((v) => v !== null).length;
}

function setProgress() {
  const total = QUESTIONS.length;
  const current = appState.idx + 1;
  const answered = answeredCount();
  const percent = Math.round((answered / total) * 100);

  progressLabel.textContent = `Question ${current} of ${total}`;
  progressMeta.textContent = `${answered} answered`;
  progressFill.style.width = `${percent}%`;
  if (progressBar) progressBar.setAttribute("aria-valuenow", String(percent));
}

function renderQuestion() {
  const q = QUESTIONS[appState.idx];
  categoryPill.textContent = q.category;
  questionText.textContent = q.question;

  optionsEl.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  const selected = appState.selectedByIndex[appState.idx];

  q.options.forEach((opt, optIdx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", "false");
    btn.dataset.optionIndex = String(optIdx);

    btn.innerHTML = `
      <div class="badge" aria-hidden="true">${letters[optIdx] ?? "?"}</div>
      <div class="text">${escapeHtml(opt)}</div>
    `;

    btn.addEventListener("click", () => selectOption(optIdx));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(optIdx);
      }
    });

    if (selected === optIdx) {
      btn.classList.add("selected");
      btn.setAttribute("aria-checked", "true");
    }

    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = selected === null;
  hintText.textContent = selected === null ? "Select one option to enable Next." : "Nice — click Next.";

  // Focus first option for better keyboard flow
  const firstOption = optionsEl.querySelector(".option");
  if (firstOption) firstOption.focus({ preventScroll: true });

  setProgress();
  nextBtn.textContent = appState.idx === QUESTIONS.length - 1 ? "Finish" : "Next";
}

function selectOption(optIdx) {
  appState.selectedByIndex[appState.idx] = optIdx;

  const optionButtons = Array.from(optionsEl.querySelectorAll(".option"));
  optionButtons.forEach((btn) => {
    const idx = Number(btn.dataset.optionIndex);
    const isSelected = idx === optIdx;
    btn.classList.toggle("selected", isSelected);
    btn.setAttribute("aria-checked", isSelected ? "true" : "false");
  });

  nextBtn.disabled = false;
  hintText.textContent = "Nice — click Next.";
  setProgress();
}

function calculateScore() {
  let score = 0;
  for (let i = 0; i < QUESTIONS.length; i++) {
    if (appState.selectedByIndex[i] === QUESTIONS[i].answerIndex) score += 1;
  }
  return score;
}

function finishQuiz() {
  appState.score = calculateScore();
  const total = QUESTIONS.length;
  const pct = Math.round((appState.score / total) * 100);

  scoreNumber.textContent = String(appState.score);
  scoreOutOf.textContent = `/ ${total}`;
  scoreMeta.textContent = `${pct}% correct`;
  resultSummary.textContent = `You scored ${appState.score} out of ${total}.`;

  showScreen(resultScreen);
}

function goNext() {
  if (appState.selectedByIndex[appState.idx] === null) return;

  if (appState.idx >= QUESTIONS.length - 1) {
    finishQuiz();
    return;
  }

  appState.idx += 1;
  renderQuestion();
}

function startQuiz() {
  appState.idx = 0;
  appState.selectedByIndex = new Array(QUESTIONS.length).fill(null);
  appState.score = 0;

  showScreen(quizScreen);
  renderQuestion();
}

function restartQuiz() {
  showScreen(startScreen);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Wire up
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", restartQuiz);
playAgainBtn.addEventListener("click", startQuiz);

// Keyboard shortcuts: left/right arrow to move between options; enter to select; N to next
document.addEventListener("keydown", (e) => {
  if (quizScreen.classList.contains("hidden")) return;

  const optionButtons = Array.from(optionsEl.querySelectorAll(".option"));
  if (optionButtons.length === 0) return;

  const active = document.activeElement;
  const currentIdx = optionButtons.indexOf(active);

  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    e.preventDefault();
    const next = optionButtons[Math.min(optionButtons.length - 1, Math.max(0, currentIdx + 1))];
    next?.focus();
  } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    e.preventDefault();
    const prev = optionButtons[Math.max(0, currentIdx - 1)];
    prev?.focus();
  } else if (e.key.toLowerCase() === "n") {
    if (!nextBtn.disabled) goNext();
  }
});


