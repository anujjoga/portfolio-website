
class TodoApp {
    constructor() {
       
        this.todos = JSON.parse(localStorage.getItem('myTodos')) || [];
        
        
        this.currentFilter = 'all';
        
        
        this.initializeApp();
    }

   
    initializeApp() {
        this.setupEventListeners();
        this.renderTodoList();
        this.updateStats();
    }

    
    setupEventListeners() {
        
        const addButton = document.getElementById('add-todo');
        const todoInput = document.getElementById('todo-input');

        if (addButton && todoInput) {
            addButton.addEventListener('click', () => this.addNewTodo());
            
            
            todoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addNewTodo();
                }
            });
        }

        
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeFilter(btn.dataset.filter);
            });
        });

        
        const clearCompletedBtn = document.getElementById('clear-completed');
        const clearAllBtn = document.getElementById('clear-all');

        if (clearCompletedBtn) {
            clearCompletedBtn.addEventListener('click', () => this.clearCompletedTodos());
        }
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllTodos());
        }
    }

    
    addNewTodo() {
        const input = document.getElementById('todo-input');
        const todoText = input.value.trim();

        
        if (todoText === '') {
            this.showNotification('Please enter a task!', 'error');
            return;
        }

        
        const newTodo = {
            id: Date.now(), 
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        
        this.todos.unshift(newTodo);
        
        
        this.saveTodos();
        this.renderTodoList();
        this.updateStats();

       
        input.value = '';
        
        
        this.showNotification('Task added successfully!', 'success');
    }

    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.renderTodoList();
            this.updateStats();
        }
    }

    
    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.renderTodoList();
        this.updateStats();
        this.showNotification('Task deleted!', 'success');
    }

    
    editTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo && newText.trim() !== '') {
            todo.text = newText.trim();
            this.saveTodos();
            this.renderTodoList();
            this.showNotification('Task updated!', 'success');
        }
    }

    
    changeFilter(filter) {
        this.currentFilter = filter;
        
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        
        this.renderTodoList();
    }

    
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            default:
                return this.todos; // Show all
        }
    }

    
    clearCompletedTodos() {
        const completedCount = this.todos.filter(t => t.completed).length;
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.renderTodoList();
        this.updateStats();
        this.showNotification(`${completedCount} completed tasks cleared!`, 'success');
    }

    
    clearAllTodos() {
        if (this.todos.length === 0) {
            this.showNotification('No tasks to clear!', 'error');
            return;
        }

        
        if (confirm('Are you sure you want to delete all tasks?')) {
            const count = this.todos.length;
            this.todos = [];
            this.saveTodos();
            this.renderTodoList();
            this.updateStats();
            this.showNotification(`${count} tasks cleared!`, 'success');
        }
    }

    
    renderTodoList() {
        const todoList = document.getElementById('todo-list');
        if (!todoList) return;

        const filteredTodos = this.getFilteredTodos();

       
        if (filteredTodos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h4>No tasks found</h4>
                    <p>${this.currentFilter === 'all' ? 'Add a new task to get started!' : `No ${this.currentFilter} tasks.`}</p>
                </div>
            `;
            return;
        }

        
        todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text" contenteditable="${!todo.completed}">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        
        this.addTodoItemListeners();
    }

    
    addTodoItemListeners() {
        const todoList = document.getElementById('todo-list');
        if (!todoList) return;

        todoList.querySelectorAll('.todo-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const checkbox = item.querySelector('.todo-checkbox');
            const text = item.querySelector('.todo-text');
            const deleteBtn = item.querySelector('.delete-btn');

           
            checkbox.addEventListener('change', () => this.toggleTodo(id));

            
            text.addEventListener('blur', () => {
                this.editTodo(id, text.textContent);
            });

            
            text.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    text.blur(); 
                }
            });

            
            deleteBtn.addEventListener('click', () => this.deleteTodo(id));
        });
    }

   
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        
        const totalElement = document.getElementById('total-tasks');
        const completedElement = document.getElementById('completed-tasks');
        const pendingElement = document.getElementById('pending-tasks');

        if (totalElement) totalElement.textContent = `Total: ${total}`;
        if (completedElement) completedElement.textContent = `Completed: ${completed}`;
        if (pendingElement) pendingElement.textContent = `Pending: ${pending}`;
    }

    
    saveTodos() {
        localStorage.setItem('myTodos', JSON.stringify(this.todos));
    }

    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

   
    showNotification(message, type = 'info') {
       
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const iconClass = type === 'success' ? 'check-circle' : 
                         type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${iconClass}"></i>
            <span>${message}</span>
        `;

        
        this.addNotificationStyles();

        
        document.body.appendChild(notification);

        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    
    addNotificationStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            
            .notification-success {
                background: #28a745;
            }
            
            .notification-error {
                background: #dc3545;
            }
            
            .notification-info {
                background: #17a2b8;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification.fade-out {
                animation: slideOutRight 0.3s ease forwards;
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('todo-list')) {
        new TodoApp();
    }
}); 