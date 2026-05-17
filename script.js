let user = localStorage.getItem("user");

if (!user) {
  user = prompt("Enter your name:");
  localStorage.setItem("user", user);
}

document.getElementById("welcome").innerText = "Welcome, " + user;

// 🌙 Dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ➕ Add task
function addTask() {
  let text = document.getElementById("taskInput").value;
  let date = document.getElementById("dateInput").value;
  let priority = document.getElementById("priorityInput").value;

  if (!text || !date) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, date, priority });

  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";

  loadTasks();
}

// 📥 Load tasks
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  document.getElementById("emptyMsg").style.display =
    tasks.length ? "none" : "block";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add(task.priority);
    li.setAttribute("draggable", true);
    li.setAttribute("data-index", index);

    li.innerHTML = `
      <span>${task.text} (${task.date})</span>
      <button onclick="deleteTask(${index})">❌</button>
    `;

    // drag events
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);

    list.appendChild(li);
  });
}

// ❌ Delete
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// 🧹 Clear
function clearTasks() {
  localStorage.removeItem("tasks");
  loadTasks();
}
let draggedIndex = null;

function dragStart(e) {
  draggedIndex = e.target.getAttribute("data-index");
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  let targetIndex = e.target.closest("li").getAttribute("data-index");

  let tasks = JSON.parse(localStorage.getItem("tasks"));

  let draggedItem = tasks.splice(draggedIndex, 1)[0];
  tasks.splice(targetIndex, 0, draggedItem);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// 🚀 Start
loadTasks();