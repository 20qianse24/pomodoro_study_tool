/**
 * script.js - Refactored Pomodoro Timer Logic
 */

// --- Initial State ---
let state = {
    settings: {
        study: 50,
        short: 5,
        long: 15
    },
    currentMode: 'study', // 'study' | 'short' | 'long'
    timeLeft: 25 * 60,
    isRunning: false,
    timerInterval: null,
    tasks: [],
    selectedTaskId: null,
    session: {
        tasksCompleted: 0,
        pomodorosCompleted: 0
    }
};

// --- DOM Elements ---
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeBtns = document.querySelectorAll('.mode-btn');
const notificationSound = document.getElementById('notification-sound');

// Modals
const settingsModal = document.getElementById('settings-modal');
const taskModal = document.getElementById('task-modal');
const sessionModal = document.getElementById('session-modal');
const settingsBtn = document.getElementById('settings-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const sessionBtn = document.getElementById('session-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const closeTaskBtn = document.getElementById('close-task');
const closeSessionBtn = document.getElementById('close-session');
const saveSettingsBtn = document.getElementById('save-settings');
const saveTaskBtn = document.getElementById('save-task');

// Inputs
const studyInput = document.getElementById('study-duration');
const shortInput = document.getElementById('short-break');
const longInput = document.getElementById('long-break');
const themeSelect = document.getElementById('theme-select');
const taskInput = document.getElementById('task-input');

// Metrics Displays
const sessionTasksDisplay = document.getElementById('session-tasks-done');
const sessionPomodorosDisplay = document.getElementById('session-pomodoros-done');

// UI Elements
const modeTabs = document.getElementById('mode-tabs');
const actionBar = document.getElementById('action-bar');
const taskList = document.getElementById('task-list');
const currentTaskDisplay = document.getElementById('current-task-display');

// --- Theme Logic ---

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeSelect) themeSelect.value = theme;
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(defaultTheme);
}

// --- Timer Logic ---

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(state.timeLeft);
    renderTasks();
    updateCurrentTask();
}

function startTimer() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    toggleFocusMode(true);
    
    state.timerInterval = setInterval(() => {
        if (state.timeLeft > 0) {
            state.timeLeft--;
            timerDisplay.textContent = formatTime(state.timeLeft);
        } else {
            clearInterval(state.timerInterval);
            state.isRunning = false;
            toggleFocusMode(false);
            if (state.currentMode === 'study') {
                state.session.pomodorosCompleted++;
                updateSessionModal();
            }
            if (notificationSound) {
                notificationSound.play().catch(err => console.log('Audio play blocked:', err));
            }
            alert(`${state.currentMode.charAt(0).toUpperCase() + state.currentMode.slice(1)} session complete!`);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    toggleFocusMode(false);
}

function resetTimer() {
    pauseTimer();
    state.timeLeft = state.settings[state.currentMode] * 60;
    updateDisplay();
}

function switchMode(mode) {
    pauseTimer();
    state.currentMode = mode;
    
    // Update UI
    modeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    state.timeLeft = state.settings[mode] * 60;
    updateDisplay();
}

// --- Focus Mode ---

function toggleFocusMode(isFocus) {
    const toggleElements = [modeTabs, actionBar, taskList];
    const h2s = document.querySelectorAll('#tasks-section h2');
    
    if (isFocus) {
        toggleElements.forEach(el => el && el.classList.add('hidden'));
        h2s.forEach(h2 => h2.classList.add('hidden'));
    } else {
        toggleElements.forEach(el => el && el.classList.remove('hidden'));
        h2s.forEach(h2 => h2.classList.remove('hidden'));
    }
}

// --- Task Management ---

function renderTasks() {
    if (!taskList) return;
    taskList.innerHTML = '';
    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${state.selectedTaskId === task.id ? 'selected' : ''}`;
        
        const textSpan = document.createElement('span');
        textSpan.textContent = task.description;
        textSpan.style.flex = '1';
        textSpan.onclick = (e) => {
            e.stopPropagation();
            selectTask(task.id);
        };
        li.appendChild(textSpan);

        const actionsBtn = document.createElement('button');
        actionsBtn.className = 'task-actions-btn';
        actionsBtn.textContent = '⋮';
        actionsBtn.onclick = (e) => {
            e.stopPropagation();
            showTaskContextMenu(e, task.id);
        };
        li.appendChild(actionsBtn);
        
        taskList.appendChild(li);
    });
}

function showTaskContextMenu(event, taskId) {
    // Remove existing menus
    const existingMenu = document.querySelector('.task-context-menu');
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement('div');
    menu.className = 'task-context-menu';
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete Task';
    completeBtn.onclick = (e) => {
        e.stopPropagation();
        completeTask(taskId, { x: event.clientX, y: event.clientY });
        menu.remove();
    };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete Task';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(taskId);
        menu.remove();
    };
    
    menu.appendChild(completeBtn);
    menu.appendChild(deleteBtn);
    
    event.currentTarget.parentElement.appendChild(menu);

    // Close menu when clicking elsewhere
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    if (state.selectedTaskId === id) state.selectedTaskId = null;
    updateDisplay();
}

function completeTask(id, mousePos) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    if (state.selectedTaskId === id) state.selectedTaskId = null;
    state.session.tasksCompleted++;
    updateSessionModal();
    triggerConfetti(mousePos.x, mousePos.y);
    updateDisplay();
}

function triggerConfetti(x, y) {
    const colors = ['#E6A85C', '#A8C3A0', '#D6A5A5', '#A9B7C6', '#4DA3FF'];
    const count = 30;
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Randomize appearance
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const dx = (Math.random() - 0.5) * 200;
        const dy = (Math.random() - 0.5) * 200 + 100;
        const dr = Math.random() * 360;
        const duration = Math.random() * 1 + 0.5;

        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.left = `${x}px`;
        confetti.style.top = `${y}px`;
        confetti.style.setProperty('--dx', `${dx}px`);
        confetti.style.setProperty('--dy', `${dy}px`);
        confetti.style.setProperty('--dr', `${dr}deg`);
        confetti.style.animation = `confetti-fall ${duration}s forwards ease-out`;

        document.body.appendChild(confetti);
        
        // Cleanup
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

function selectTask(id) {
    if (state.isRunning) return; // Prevent selection while running
    state.selectedTaskId = id;
    updateDisplay();
}

function updateCurrentTask() {
    if (!currentTaskDisplay) return;
    const selectedTask = state.tasks.find(t => t.id === state.selectedTaskId);
    currentTaskDisplay.textContent = selectedTask ? selectedTask.description : 'No task selected';
}

function addTask() {
    const description = taskInput.value.trim();
    if (description) {
        const newTask = {
            id: Date.now(),
            description: description
        };
        state.tasks.push(newTask);
        if (!state.selectedTaskId) state.selectedTaskId = newTask.id;
        taskInput.value = '';
        taskModal.classList.add('hidden');
        updateDisplay();
    }
}

// --- Settings ---

function saveSettings() {
    state.settings.study = parseInt(studyInput.value) || 25;
    state.settings.short = parseInt(shortInput.value) || 5;
    state.settings.long = parseInt(longInput.value) || 15;
    
    // Update current time if timer isn't running
    if (!state.isRunning) {
        state.timeLeft = state.settings[state.currentMode] * 60;
    }
    
    settingsModal.classList.add('hidden');
    updateDisplay();
}

function updateSessionModal() {
    if (sessionTasksDisplay) sessionTasksDisplay.textContent = state.session.tasksCompleted;
    if (sessionPomodorosDisplay) sessionPomodorosDisplay.textContent = state.session.pomodorosCompleted;
}

// --- Event Listeners ---

if (startBtn) startBtn.addEventListener('click', startTimer);
if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
if (resetBtn) resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

if (addTaskBtn) addTaskBtn.addEventListener('click', () => taskModal.classList.remove('hidden'));
if (closeTaskBtn) closeTaskBtn.addEventListener('click', () => taskModal.classList.add('hidden'));
if (saveTaskBtn) saveTaskBtn.addEventListener('click', addTask);

if (sessionBtn) sessionBtn.addEventListener('click', () => {
    updateSessionModal();
    sessionModal.classList.remove('hidden');
});
if (closeSessionBtn) closeSessionBtn.addEventListener('click', () => sessionModal.classList.add('hidden'));

if (themeSelect) {
    themeSelect.addEventListener('change', (e) => setTheme(e.target.value));
}

// --- Initialization ---
initTheme();
updateDisplay();
