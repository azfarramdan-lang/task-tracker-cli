const fs = require("fs").promises;
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "tasks.json");

async function ensureFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.writeFile(dataPath, JSON.stringify([]));
  }
}

async function loadTasks() {
  await ensureFile();
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
}

async function saveTasks(tasks) {
  await fs.writeFile(dataPath, JSON.stringify(tasks, null, 2));
}

async function addTask(title, priority = "medium") {
  const tasks = await loadTasks();

  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await saveTasks(tasks);
  console.log("Task added");
}

async function listTasks(filters) {
  let tasks = await loadTasks();

  if (filters.completed) tasks = tasks.filter(t => t.completed);
  if (filters.pending) tasks = tasks.filter(t => !t.completed);
  if (filters.priority) tasks = tasks.filter(t => t.priority === filters.priority);

  if (!tasks.length) {
    console.log("No tasks found");
    return;
  }

  tasks.forEach(t => {
    console.log(`[${t.completed ? "✔" : " "}] ${t.id}. ${t.title} (${t.priority})`);
  });
}

async function completeTask(id) {
  const tasks = await loadTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) return console.log("Task not found");

  task.completed = true;
  await saveTasks(tasks);
  console.log("Task completed");
}

async function deleteTask(id) {
  const tasks = await loadTasks();
  const newTasks = tasks.filter(t => t.id !== id);

  await saveTasks(newTasks);
  console.log("Task deleted");
}

module.exports = {
  addTask,
  listTasks,
  completeTask,
  deleteTask,
};

