/*
Task Service Module
Author : Azfar Ramdan
*/
const {
  addTask,
  listTasks,
  completeTask,
  deleteTask,
} = require("./src/taskService");

const args = process.argv.slice(2);
const command = args[0];

(async () => {
  switch (command) {
    case "add": {
      const title = args[1];
      const pIndex = args.indexOf("--priority");
      const priority = pIndex !== -1 ? args[pIndex + 1] : "medium";

      await addTask(title, priority);
      break;
    }

    case "list": {
      const filters = {
        completed: args.includes("--completed"),
        pending: args.includes("--pending"),
        priority: null,
      };

      const pIndex = args.indexOf("--priority");
      if (pIndex !== -1) filters.priority = args[pIndex + 1];

      await listTasks(filters);
      break;
    }

    case "done":
      await completeTask(Number(args[1]));
      break;

    case "delete":
      await deleteTask(Number(args[1]));
      break;

    default:
      console.log("Commands: add, list, done, delete");
  }
})();
