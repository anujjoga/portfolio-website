
class ProjectPortfolio {
    constructor() {
        
        this.myProjects = [
            {
                id: 1,
                name: "React Task Manager",
                description: "Built a task management app using React and Node.js. It has real-time updates, drag-and-drop features, and team collaboration tools.",
                category: "web",
                rating: 4.8,
                dateAdded: "2024-01-15",
                icon: "fas fa-tasks"
            },
            {
                id: 2,
                name: "Mobile Fitness App",
                description: "Created a fitness tracking app with React Native. Users can track workouts, monitor progress, and connect with friends.",
                category: "mobile",
                rating: 4.6,
                dateAdded: "2024-01-10",
                icon: "fas fa-dumbbell"
            },
            {
                id: 3,
                name: "E-commerce Dashboard",
                description: "Developed a comprehensive dashboard for online stores. Includes analytics, inventory management, and order processing.",
                category: "web",
                rating: 4.9,
                dateAdded: "2024-01-20",
                icon: "fas fa-shopping-cart"
            },
            {
                id: 4,
                name: "UI Design System",
                description: "Designed a complete UI system with reusable components, style guides, and documentation for consistent designs.",
                category: "design",
                rating: 4.7,
                dateAdded: "2024-01-05",
                icon: "fas fa-palette"
            },
            {
                id: 5,
                name: "API Development Tool",
                description: "Built a tool for creating and testing REST APIs. Features automatic documentation and performance monitoring.",
                category: "tools",
                rating: 4.5,
                dateAdded: "2024-01-12",
                icon: "fas fa-code"
            }
        ];

        
        this.selectedCategory = 'all';
        this.sortBy = 'name';
        
        
        this.setupEventListeners();
        this.displayProjects();
    }

   
    setupEventListeners() {
        
        const categoryDropdown = document.getElementById('category-filter');
        if (categoryDropdown) {
            categoryDropdown.addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.displayProjects();
            });
        }

        
        const sortDropdown = document.getElementById('sort-select');
        if (sortDropdown) {
            sortDropdown.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.displayProjects();
            });
        }
    }

    
    getFilteredAndSortedProjects() {
        let filteredProjects = this.myProjects;

        
        if (this.selectedCategory !== 'all') {
            filteredProjects = filteredProjects.filter(project => project.category === this.selectedCategory);
        }

        
        filteredProjects.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating; 
                case 'date':
                    return new Date(b.dateAdded) - new Date(a.dateAdded); 
                default:
                    return 0;
            }
        });

        return filteredProjects;
    }

    
    displayProjects() {
        const projectsContainer = document.getElementById('products-grid');
        if (!projectsContainer) return;

        const projectsToShow = this.getFilteredAndSortedProjects();

       
        if (projectsToShow.length === 0) {
            projectsContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h4>No projects found</h4>
                    <p>Try changing your filter settings.</p>
                </div>
            `;
            return;
        }

       
        const projectsHTML = projectsToShow.map(project => `
            <div class="product-card" data-aos="fade-up">
                <div class="product-image">
                    <i class="${project.icon}"></i>
                </div>
                <div class="product-content">
                    <span class="product-category">${this.getCategoryDisplayName(project.category)}</span>
                    <h3 class="product-title">${project.name}</h3>
                    <p class="product-description">${project.description}</p>
                    <div class="product-meta">
                        <div class="product-rating">
                            <div class="stars">
                                ${this.createStarRating(project.rating)}
                            </div>
                            <span class="rating-text">${project.rating}</span>
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="projectPortfolio.showProjectDetails(${project.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        <button class="btn btn-secondary" onclick="projectPortfolio.openProject(${project.id})">
                            <i class="fas fa-external-link-alt"></i> View Project
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        projectsContainer.innerHTML = projectsHTML;
    }

    
    getCategoryDisplayName(categoryCode) {
        const categoryNames = {
            'web': 'Web Development',
            'mobile': 'Mobile Apps',
            'design': 'UI/UX Design',
            'tools': 'Development Tools'
        };
        return categoryNames[categoryCode] || categoryCode;
    }

    
    createStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let starsHTML = '';
        
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    
    showProjectDetails(projectId) {
        const project = this.myProjects.find(p => p.id === projectId);
        if (!project) return;

        this.createAndShowModal(project);
    }

    
    openProject(projectId) {
        const project = this.myProjects.find(p => p.id === projectId);
        if (project) {
            this.showMessage(`Opening ${project.name} project!`, 'success');
        }
    }

    
    createAndShowModal(project) {
        const modalHTML = `
            <div class="project-modal" id="project-modal">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <button class="modal-close" onclick="projectPortfolio.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-body">
                        <div class="modal-image">
                            <i class="${project.icon}"></i>
                        </div>
                        <div class="modal-info">
                            <span class="product-category">${this.getCategoryDisplayName(project.category)}</span>
                            <h2>${project.name}</h2>
                            <p>${project.description}</p>
                            <div class="modal-meta">
                                <div class="rating-section">
                                    <div class="product-rating">
                                        <div class="stars">
                                            ${this.createStarRating(project.rating)}
                                        </div>
                                        <span class="rating-text">${project.rating} out of 5</span>
                                    </div>
                                </div>
                                <div class="project-details">
                                    <p><strong>Category:</strong> ${this.getCategoryDisplayName(project.category)}</p>
                                    <p><strong>Date Added:</strong> ${new Date(project.dateAdded).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="modal-actions">
                                <button class="btn btn-primary" onclick="projectPortfolio.openProject(${project.id}); projectPortfolio.closeModal();">
                                    <i class="fas fa-external-link-alt"></i> View Project
                                </button>
                                <button class="btn btn-secondary" onclick="projectPortfolio.closeModal()">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        
        this.addModalStyles();

        
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        
        this.setupModalEvents();
    }

    
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            
            .modal-close {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
                z-index: 1;
                padding: 5px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .modal-image {
                text-align: center;
                margin-bottom: 1.5rem;
            }
            
            .modal-image i {
                font-size: 4rem;
                color: #4a90e2;
            }
            
            .modal-info h2 {
                margin-bottom: 1rem;
                color: #333;
            }
            
            .modal-info p {
                color: #666;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .modal-meta {
                margin-bottom: 2rem;
            }
            
            .rating-section {
                margin-bottom: 1rem;
            }
            
            .project-details p {
                margin: 0.5rem 0;
                color: #666;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 20px;
                }
                
                .modal-body {
                    padding: 1.5rem;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    
    setupModalEvents() {
        
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

       
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    
    closeModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.remove();
        }
    }

    
    showMessage(message, type = 'info') {
        
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


let projectPortfolio;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('products-grid')) {
        projectPortfolio = new ProjectPortfolio();
    }
}); 