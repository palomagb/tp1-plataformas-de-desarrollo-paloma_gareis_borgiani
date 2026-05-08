// elementos del DOM
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const searchInput = document.querySelector('#search-input');

let tasks = JSON.parse(localStorage.getItem('petTasks')) || [];

// persistencia
const syncStorage = () => {
    localStorage.setItem('petTasks', JSON.stringify(tasks));
};

const showToast = (message) => {
    const toast = document.querySelector('#toast');
    const toastMsg = document.querySelector('#toast-message');

    toastMsg.textContent = message;

    toast.classList.remove('opacity-0', 'pointer-events-none');
    toast.classList.add('opacity-100', '-translate-y-2');

    setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
        toast.classList.remove('opacity-100', '-translate-y-2');
    }, 3000);
};


const renderTasks = (filter = '') => {
    // se limpia el contenedor
    taskList.innerHTML = '';

    const filtered = tasks.filter(t => t.text.toLowerCase().includes(filter.toLowerCase()));

    // mensaje si no hay resultados
    if (filtered.length === 0) {
        taskList.innerHTML = `
            <div class="p-10 text-center flex flex-col items-center">
                <img src="img/logo-patita.png" alt="Sin tareas" class="h-20 w-20 mb-4 opacity-20 grayscale">
                <p class="text-[#9cb49a] font-medium italic">No hay cuidados registrados por aquí.</p>
            </div>`;
        return;
    }

    filtered.forEach((task) => {
        const li = document.createElement('li');
        li.className = `flex items-center justify-between p-5 rounded-2xl border border-[#9cb49a]/30 transition-all ${task.completed ? 'bg-white/50 grayscale opacity-60' : 'bg-white shadow-sm hover:shadow-md'
            }`;

        // contenedor para el checkbox completado y texto
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex items-center gap-4';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'h-6 w-6 cursor-pointer accent-[#9cb49a]';

        checkbox.addEventListener('change', () => {
            task.completed = !task.completed;
            syncStorage();
            renderTasks(searchInput.value);
        });

        const span = document.createElement('span');
        span.className = `${task.completed ? 'line-through text-gray-400' : 'text-[#333333]'} font-semibold`;
        span.textContent = task.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        // boton "eliminar"
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'p-2 rounded-full hover:bg-red-50 transition-all duration-300 group';
        deleteBtn.innerHTML = `<img src="img/eliminar.png" alt="Borrar" class="h-5 w-5 opacity-80 group-hover:opacity-100 transition-opacity">`;

        deleteBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => t !== task); // filtra el array 
            syncStorage();
            renderTasks(searchInput.value);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (text === '') return;

    // evitar duplicados
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        showToast("¡Ups! Este cuidado ya está en la lista.");
        return;
    }

    tasks.push({ text, completed: false });
    taskInput.value = '';
    syncStorage();
    renderTasks();
});

searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});

renderTasks();