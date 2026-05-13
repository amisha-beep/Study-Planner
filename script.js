// 🌙 DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// 🔔 TOAST
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1500);

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

// ➕ ADD TASK
async function addTask() {
    let task = document.getElementById("taskInput").value;
    let date = document.getElementById("dateInput").value;
    let priority = document.getElementById("priorityInput").value;

    if (!task || !date) {
        showToast("Fill all fields ❗");
        return;
    }

    await fetch("https://study-planner-backend-p03g.onrender.com/add-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: task, date, priority })
    });

    showToast("Task added ✅");

    document.getElementById("taskInput").value = "";
    document.getElementById("dateInput").value = "";

    loadTasks();
}

// 📥 LOAD TASKS
async function loadTasks() {
    let res = await fetch("https://study-planner-backend-p03g.onrender.com/tasks");
    let data = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    data.forEach(task => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.onchange = async () => {
            
            await fetch(`https://study-planner-backend-p03g.onrender.com/toggle-task/${task._id}`, {
                method: "PUT"
            });
            showToast("Updated ✔️");
            loadTasks();
        };

        const text = document.createElement("span");
        text.className = "task-text";
        text.innerText = `${task.text} (${task.date})`;

        if (task.priority === "High") text.style.color = "red";
        if (task.priority === "Medium") text.style.color = "orange";
        if (task.priority === "Low") text.style.color = "green";

        if (task.completed) {
            text.style.textDecoration = "line-through";
        }

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.className = "btn edit";

        editBtn.onclick = async () => {
            let newText = prompt("Edit task:", task.text);
            let newDate = prompt("Edit date:", task.date);

            if (newText && newDate) {
                await fetch(`https://study-planner-backend-p03g.onrender.com/update-task/${task._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: newText, date: newDate })
                });

                showToast("Updated ✏️");
                loadTasks();
            }
        };

        const delBtn = document.createElement("button");
        delBtn.innerText = "Delete";
        delBtn.className = "btn delete";

        delBtn.onclick = async () => {
            await fetch(`https://study-planner-backend-p03g.onrender.com/delete-task/${task._id}`, {
                method: "DELETE"
            });

            showToast("Deleted 🗑️");
            loadTasks();
        };

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(editBtn);
        li.appendChild(delBtn);

        list.appendChild(li);
    });
}

// 🔍 SEARCH
async function searchTasks() {
    let keyword = document.getElementById("searchInput").value.toLowerCase();

    let res = await fetch("http://localhost:3000/tasks");
    let data = await res.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    data
        .filter(task => task.text.toLowerCase().includes(keyword))
        .forEach(task => {
            const li = document.createElement("li");
            li.innerText = `${task.text} (${task.date})`;
            list.appendChild(li);
        });
}

// 🚀 START
loadTasks();