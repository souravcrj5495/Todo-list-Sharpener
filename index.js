const axios = require('axios'); // Import Axios library

const todoList = document.getElementById("todo-list");
const taskInput = document.getElementById("task");
const addButton = document.getElementById("add-task");

// Function to get the list of tasks from the server
function getTasks() {
    axios.get('https://crud/tasks')
        .then(response => {
            // Clear the existing list
            todoList.innerHTML = '';

            // Add each task to the list
            response.data.forEach(task => {
                addTaskToList(task);
            });
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Function to add a task to the list
function addTaskToList(task) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <span>${task.text}</span>
        <button class="edit-button">Edit</button>
        <button class="delete-button">Delete</button>
    `;

    listItem.querySelector(".delete-button").addEventListener("click", () => {
        deleteTask(task.id);
    });

    listItem.querySelector(".edit-button").addEventListener("click", () => {
        editTask(task.id);
    });

    todoList.appendChild(listItem);
}

// Function to create a new task on the server
function createTask(text) {
    axios.post('https://crud/tasks', { text })
        .then(response => {
            addTaskToList(response.data); // Add the new task to the list
        })
        .catch(error => {
            console.error('Error creating task:', error);
        });
}

// Function to delete a task on the server
function deleteTask(taskId) {
    axios.delete(`https://crud/tasks/${taskId}`)
        .then(() => {
            // Remove the task from the list
            const taskItem = document.querySelector(`[data-id="${taskId}"]`);
            taskItem.remove();
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
}

// Function to edit a task on the server
function editTask(taskId) {
    const newText = prompt("Edit task:", "");
    if (newText !== null) {
        axios.put(`https://crud/tasks/${taskId}`, { text: newText })
            .then(response => {
                // Update the task in the list
                const taskItem = document.querySelector(`[data-id="${taskId}"]`);
                taskItem.querySelector("span").textContent = response.data.text;
            })
            .catch(error => {
                console.error('Error editing task:', error);
            });
    }
}

// Event listener for adding a new task
addButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        createTask(taskText);
        taskInput.value = "";
    }
});

// Initial load of tasks
getTasks();