// ==========================================================================
// 1. STRUKTUR DATA & INITIALIZATION (Local Storage)
// ==========================================================================
let todos = JSON.parse(localStorage.getItem("dashboard_todos")) || [];
let quickLinks = JSON.parse(localStorage.getItem("dashboard_links")) || [];
let username = localStorage.getItem("dashboard_username") || "";
let currentTheme = localStorage.getItem("dashboard_theme") || "light"; // Default tema light

let timerInterval = null;
let defaultMinutes = 25;
let timeLeft = defaultMinutes * 60;

document.addEventListener("DOMContentLoaded", () => {
  initClock();
  renderTodos();
  renderQuickLinks();
  initUsername();
  updateTimerDisplay();
  initTheme(); 
});

// ==========================================================================
// 2. FITUR GREETING & CUSTOM NAME (Challenge 1)
// ==========================================================================
function initClock() {
  setInterval(() => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    document.getElementById("clock").textContent =
      `${hours}:${minutes}:${seconds}`;

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("date").textContent = now.toLocaleDateString(
      "en-US",
      options,
    );

    let greeting = "Good Night";
    const currentHour = now.getHours();
    if (currentHour >= 5 && currentHour < 12) greeting = "Good Morning";
    else if (currentHour >= 12 && currentHour < 17) greeting = "Good Afternoon";
    else if (currentHour >= 17 && currentHour < 21) greeting = "Good Evening";

    if (username) {
      document.getElementById("greeting-text").textContent =
        `${greeting}, ${username}!`;
    } else {
      document.getElementById("greeting-text").textContent = greeting;
    }
  }, 1000);
}

const usernameInput = document.getElementById("username-input");
const saveNameBtn = document.getElementById("save-name-btn");

saveNameBtn.addEventListener("click", () => {
  const inputVal = usernameInput.value.trim();
  if (inputVal !== "") {
    username = inputVal;
    localStorage.setItem("dashboard_username", username);
    usernameInput.value = "";
    alert(`Nama berhasil disimpan! Halo ${username}.`);
  }
});

function initUsername() {
  if (username) usernameInput.placeholder = `Ganti nama (${username})...`;
}

// ==========================================================================
// 3. FOCUS TIMER & CHANGE TIME (Challenge 2)
// ==========================================================================
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const timeOptButtons = document.querySelectorAll(".time-opt-btn");

function updateTimerDisplay() {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${mins}:${secs}`;
}

startBtn.addEventListener("click", () => {
  if (timerInterval !== null) return;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Waktu fokus selesai! Istirahatlah sejenak.");
      timeLeft = defaultMinutes * 60;
      updateTimerDisplay();
    }
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = defaultMinutes * 60;
  updateTimerDisplay();
});

timeOptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    defaultMinutes = parseInt(button.getAttribute("data-time"));
    timeLeft = defaultMinutes * 60;
    updateTimerDisplay();
  });
});

// ==========================================================================
// 4. TO-DO LIST, PREVENT DUPLICATE (Challenge 3) & SORT (Challenge 4)
// ==========================================================================
const todoInput = document.getElementById("todo-input");
const addTodoBtn = document.getElementById("add-todo-btn");
const todoListElement = document.getElementById("todo-list");

function renderTodos() {
  todoListElement.innerHTML = "";
  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = `todo-item ${todo.completed ? "completed" : ""}`;
    li.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="toggleTodo(${index})">
                <span class="todo-text">${todo.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
        `;
    todoListElement.appendChild(li);
  });
}

addTodoBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();
  if (taskText === "") return;

  // Challenge 3: Mencegah Duplikasi
  const isDuplicate = todos.some(
    (todo) => todo.text.toLowerCase() === taskText.toLowerCase(),
  );
  if (isDuplicate) {
    alert("⚠️ Tugas ini sudah ada di dalam daftar!");
    return;
  }

  todos.push({ text: taskText, completed: false });
  localStorage.setItem("dashboard_todos", JSON.stringify(todos));
  todoInput.value = "";
  renderTodos();
});

function toggleTodo(index) {
  todos[index].completed = !todos[index].completed;
  localStorage.setItem("dashboard_todos", JSON.stringify(todos));
  renderTodos();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  localStorage.setItem("dashboard_todos", JSON.stringify(todos));
  renderTodos();
}

// ==========================================================================
// Challenge 4: Menyortir Tugas (Sort Tasks)
// ==========================================================================
function sortTasks(type) {
    if (type === 'alpha') {
        todos.sort((a, b) => a.text.localeCompare(b.text));
    } else if (type === 'status') {
        todos.forEach(todo => {
            todo.completed = true;
        });
        alert("Semua tugas telah ditandai selesai! 🎉");
    }
    localStorage.setItem('dashboard_todos', JSON.stringify(todos));
    renderTodos();
}

// ==========================================================================
// 5. FITUR QUICK LINKS
// ==========================================================================
const linkNameInput = document.getElementById("link-name");
const linkUrlInput = document.getElementById("link-url");
const addLinkBtn = document.getElementById("add-link-btn");
const linksContainer = document.getElementById("links-container");

function renderQuickLinks() {
  linksContainer.innerHTML = "";
  quickLinks.forEach((link, index) => {
    const a = document.createElement("a");
    a.href = link.url;
    a.target = "_blank";
    a.className = "link-btn";
    a.innerHTML = `
            ${link.name} 
            <span class="delete-link-x" onclick="event.preventDefault(); deleteLink(${index});">×</span>
        `;
    linksContainer.appendChild(a);
  });
}

addLinkBtn.addEventListener("click", () => {
  const name = linkNameInput.value.trim();
  let url = linkUrlInput.value.trim();

  if (name === "" || url === "") {
    alert("Isi nama link dan URL terlebih dahulu!");
    return;
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  quickLinks.push({ name: name, url: url });
  localStorage.setItem("dashboard_links", JSON.stringify(quickLinks));
  linkNameInput.value = "";
  linkUrlInput.value = "";
  renderQuickLinks();
});

function deleteLink(index) {
  quickLinks.splice(index, 1);
  localStorage.setItem("dashboard_links", JSON.stringify(quickLinks));
  renderQuickLinks();
}

// ==========================================================================
// 6. LIGHT / DARK MODE (Versi Ikon Animasi)
// ==========================================================================
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeIcon = document.getElementById("theme-icon");

themeToggleBtn.addEventListener("click", () => {
  if (document.body.classList.contains("dark-mode")) {
    document.body.classList.remove("dark-mode");
    currentTheme = "light";
    themeIcon.className = "fas fa-moon";
  } else {
    document.body.classList.add("dark-mode");
    currentTheme = "dark";
    themeIcon.className = "fas fa-sun";
  }
  localStorage.setItem("dashboard_theme", currentTheme);
});

function initTheme() {
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.className = "fas fa-sun";
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.className = "fas fa-moon";
  }
}
