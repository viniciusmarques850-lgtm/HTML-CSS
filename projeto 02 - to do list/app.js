// app.js

// -------------- Seleções do DOM ----------------
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const countEl = document.getElementById('task-count');
const clearBtn = document.getElementById('clear-btn');

// -------------- Estado (array de tarefas) ----------------
// Cada tarefa será um objeto: { id, text, completed }
let tasks = [];

// -------------- Funções utilitárias ----------------
function saveTasks() {
  // Salva no localStorage como string JSON
  localStorage.setItem('tasks_vinicius', JSON.stringify(tasks));
}

function loadTasks() {
  // Carrega, se tiver, retorna array; se não, []
  const data = localStorage.getItem('tasks_vinicius');
  return data ? JSON.parse(data) : [];
}

function updateCount() {
  const total = tasks.length;
  const remaining = tasks.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} de ${total} tarefas ativas`;
}

// Cria um elemento DOM para a tarefa
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task';
  if (task.completed) li.classList.add('completed');

  // checkbox (ou botão de concluir)
  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.title = 'Marcar como concluída';
  completeBtn.innerHTML = task.completed ? '⟲' : '✓';

  // label com texto
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = task.text;

  // botão deletar
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.title = 'Remover tarefa';
  delBtn.textContent = '🗑';

  // eventos
  completeBtn.addEventListener('click', () => {
    toggleTask(task.id);
  });

  delBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  // montar li
  li.appendChild(completeBtn);
  li.appendChild(label);
  li.appendChild(delBtn);

  return li;
}

// Renderiza toda a lista
function render() {
  // limpa lista
  list.innerHTML = '';

  // cria e anexa elementos
  tasks.forEach(task => {
    const el = createTaskElement(task);
    list.appendChild(el);
  });

  // atualiza contador e salva
  updateCount();
  saveTasks();
}

// Gera ID simples (timestamp + random)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2,7);
}

// -------------- CRUD de tarefas ----------------
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return; // evita tarefas vazias

  const newTask = {
    id: generateId(),
    text: trimmed,
    completed: false
  };
  tasks.unshift(newTask); // adiciona no começo
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  render();
}

// -------------- Eventos do UI ----------------
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
  input.focus();
});

clearBtn.addEventListener('click', () => {
  clearCompleted();
});

// -------------- Inicialização ----------------
function init() {
  tasks = loadTasks();
  render();
  // foco no input ao abrir
  input.focus();
}

init();
