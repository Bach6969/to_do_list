document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    const taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.forEach(addTaskToDOM);
}

function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        const task = { text: taskText, status: 'incomplete' }; // default status
        addTaskToDOM(task);
        saveTask(task);
        taskInput.value = '';
    }
}

function addTaskToDOM(task) {
    const taskList = document.getElementById('task-list');
    const taskRow = document.createElement('tr');
    taskRow.classList.add(task.status);

    // Task Description
    const taskTextCell = document.createElement('td');
    taskTextCell.textContent = task.text;
    taskRow.appendChild(taskTextCell);

    // Status
    const statusCell = document.createElement('td');
    statusCell.textContent = capitalize(task.status);
    taskRow.appendChild(statusCell);

    // Actions
    const actionsCell = document.createElement('td');
    
    if (task.status === 'incomplete') {
        addActionButton(actionsCell, 'Start', 'start-btn', () => startTask(task, taskRow, statusCell));
    } else if (task.status === 'started') {
        addActionButton(actionsCell, 'In Progress', 'in-progress-btn', () => inProgressTask(task, taskRow, statusCell));
    } else if (task.status === 'in-progress') {
        addActionButton(actionsCell, 'Complete', 'complete-btn', () => completeTask(task, taskRow, statusCell));
    }
    addActionButton(actionsCell, 'Delete', 'delete-btn', () => deleteTask(task, taskRow));

    taskRow.appendChild(actionsCell);
    taskList.appendChild(taskRow);
}

function addActionButton(parent, text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = onClick;
    parent.appendChild(button);
}

function startTask(task, taskRow, statusCell) {
    task.status = 'started';
    taskRow.className = 'started';
    statusCell.textContent = 'Started';
    updateTasksInStorage();
    refreshActions(taskRow, task);
}

function inProgressTask(task, taskRow, statusCell) {
    task.status = 'in-progress';
    taskRow.className = 'in-progress';
    statusCell.textContent = 'In Progress';
    updateTasksInStorage();
    refreshActions(taskRow, task);
}

function completeTask(task, taskRow, statusCell) {
    task.status = 'completed';
    taskRow.className = 'completed';
    statusCell.textContent = 'Completed';
    updateTasksInStorage();
    refreshActions(taskRow, task);
}

function deleteTask(task, taskRow) {
    taskRow.remove();
    let taskList = JSON.parse(localStorage.getItem('tasks'));
    taskList = taskList.filter(t => t.text !== task.text);
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

function saveTask(task) {
    const taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    taskList.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

function updateTasksInStorage() {
    const taskList = [];
    document.querySelectorAll('#task-list tr').forEach(taskRow => {
        const taskText = taskRow.cells[0].textContent;
        const status = taskRow.classList.contains('completed') ? 'completed' :
                       taskRow.classList.contains('in-progress') ? 'in-progress' :
                       taskRow.classList.contains('started') ? 'started' : 'incomplete';
        taskList.push({ text: taskText, status });
    });
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

function refreshActions(taskRow, task) {
    const actionsCell = taskRow.cells[2];
    actionsCell.innerHTML = '';
    
    if (task.status === 'incomplete') {
        addActionButton(actionsCell, 'Start', 'start-btn', () => startTask(task, taskRow, taskRow.cells[1]));
    } else if (task.status === 'started') {
        addActionButton(actionsCell, 'In Progress', 'in-progress-btn', () => inProgressTask(task, taskRow, taskRow.cells[1]));
    } else if (task.status === 'in-progress') {
        addActionButton(actionsCell, 'Complete', 'complete-btn', () => completeTask(task, taskRow, taskRow.cells[1]));
    }
    addActionButton(actionsCell, 'Delete', 'delete-btn', () => deleteTask(task, taskRow));
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Export Function
function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let csvContent = "data:text/csv;charset=utf-8,Task,Status\n";

    tasks.forEach(task => {
        const row = `${task.text},${task.status}`;
        csvContent += row + "\n";
    });

    // Create a downloadable link and click it to trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "todo_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
