/* 🔐 LOGIN */
function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (user && pass) {
    localStorage.setItem("user", user);
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    showWelcome();
  } else {
    alert("Enter details");
  }
}

/* 👤 SHOW USER */
function showWelcome() {
  let user = localStorage.getItem("user");
  if (user) {
    let title = document.querySelector("#app h2");
    title.innerText = "📚 Study Planner - " + user;
  }
}

/* 🌙 DARK MODE */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

/* ➕ ADD TASK */
function addTask() {
  let text = document.getElementById("taskInput").value;
  let date = document.getElementById("dateInput").value;

  if (!text || !date) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.push({
    text,
    date,
    completed: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";

  loadTasks();
}

/* 📥 LOAD TASKS */
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((t, i) => {
    let li = document.createElement("li");

    // 🔄 DRAG SETUP
    li.setAttribute("draggable", true);
    li.setAttribute("data-index", i);
    li.ondragstart = dragStart;
    li.ondragover = dragOver;
    li.ondrop = drop;

    li.innerHTML = `
      <div>
        <input type="checkbox" ${t.completed ? "checked" : ""}
          onchange="toggleTask(${i})">
        <span style="${t.completed ? 'text-decoration:line-through; color:gray;' : ''}">
          ${t.text} (${t.date})
        </span>
      </div>
      <button onclick="deleteTask(${i})">❌</button>
    `;

    list.appendChild(li);
  });
}

/* ☑️ TOGGLE TASK */
function toggleTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* ❌ DELETE TASK */
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* 🔄 DRAG & DROP */
let draggedIndex = null;

function dragStart(e) {
  draggedIndex = e.target.getAttribute("data-index");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  let target = e.target.closest("li");
  if (!target) return;

  let targetIndex = target.getAttribute("data-index");

  let tasks = JSON.parse(localStorage.getItem("tasks"));

  let draggedItem = tasks.splice(draggedIndex, 1)[0];
  tasks.splice(targetIndex, 0, draggedItem);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

/* 🚀 INIT */
showWelcome();
loadTasks();