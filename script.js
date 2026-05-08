const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const searchInput = document.querySelector('#search-input');


let tasks = JSON.parse(localStorage.getItem('petTasks')) || [];

const saveToStorage = () => {
    localStorage.setItem('petTasks', JSON.stringify(tasks));
};


const renderTasks = (filterText = '') => {
    taskList.innerHTML = ''; 

    const filteredTasks = tasks.filter(task => 
        task.text.toLowerCase().includes(filterText.toLowerCase())
    );

    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li'); 
        li.className = `flex items-center justify-between p-4 ${task.completed ? 'bg-green-50' : ''}`;

        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    class="w-4 h-4 text-indigo-600" 
                    onchange="toggleTask(${index})">
                <span class="${task.completed ? 'line-through text-slate-400' : 'text-slate-700'} font-medium">
                    ${task.text}
                </span>
            </div>
            <button onclick="deleteTask(${index})" class="text-red-500 hover:text-red-700 text-sm font-semibold">
                Eliminar
            </button>
        `;
        
        taskList.appendChild(li); 
    });
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    
    if (text === '') return;
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert("¡Este cuidado ya está en la lista!");
        return;
    }

    tasks.push({ text, completed: false });
    
    taskInput.value = ''; // Limpiar input
    saveToStorage();
    renderTasks();
});

window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveToStorage();
    renderTasks();
};

window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveToStorage();
    renderTasks();
};

searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});

renderTasks();