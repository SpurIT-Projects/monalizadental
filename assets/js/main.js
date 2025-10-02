// Mona Lisa Dental - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    initializeNavigation();
    initializeScrollEffects();
    initializeSlider();
    initializeFormHandling();
    initializeModals();
    initializeScrollToTop();
    
    // Auto-scroll to top on page load/change
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.getElementById('header');
    
    // Mobile menu toggle
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navList) {
                navToggle.classList.remove('active');
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navToggle && navList && 
            !navToggle.contains(e.target) && 
            !navList.contains(e.target)) {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        lastScrollY = window.scrollY;
    });
    
    // Active navigation link highlighting
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.offsetHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling functionality
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.getElementById('header')?.offsetHeight || 80;
        const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Services slider functionality
function initializeSlider() {
    const sliderTrack = document.getElementById('slider-track');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const slides = document.querySelectorAll('.service-slide');
    
    if (!sliderTrack || !slides.length) return;
    
    let currentIndex = 0;
    const slidesToShow = getSlidesToShow();
    const maxIndex = Math.max(0, slides.length - slidesToShow);
    
    function getSlidesToShow() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    function updateSlider() {
        const slideWidth = slides[0].offsetWidth + 32; // Include gap
        const translateX = -currentIndex * slideWidth;
        sliderTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update button states
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });
    }
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    sliderTrack.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    sliderTrack.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            } else if (diff < 0 && currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }
        
        isDragging = false;
    });
    
    // Auto-play slider
    let autoPlayInterval = setInterval(() => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 5000);
    
    // Pause auto-play on hover
    sliderTrack.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    sliderTrack.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
    });
    
    // Responsive handling
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesToShow = getSlidesToShow();
            const newMaxIndex = Math.max(0, slides.length - newSlidesToShow);
            
            if (currentIndex > newMaxIndex) {
                currentIndex = newMaxIndex;
            }
            
            updateSlider();
        }, 250);
    });
    
    // Initial setup
    updateSlider();
}

// Form handling
function initializeFormHandling() {
    const appointmentForm = document.getElementById('appointment-form');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearFormErrors();
            
            // Validate form
            const isValid = validateAppointmentForm();
            
            if (isValid) {
                // Simulate form submission
                submitAppointmentForm();
            }
        });
        
        // Real-time validation
        const inputs = appointmentForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.startsWith('375')) {
                    value = value.substring(3);
                }
                
                if (value.length >= 2) {
                    value = `+375 (${value.substring(0, 2)}) ${value.substring(2, 5)}-${value.substring(5, 7)}-${value.substring(7, 9)}`;
                } else if (value.length > 0) {
                    value = `+375 (${value}`;
                }
                
                e.target.value = value;
            });
        }
        
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function validateAppointmentForm() {
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const consent = document.getElementById('consent');
    
    let isValid = true;
    
    // Name validation
    if (!name.value.trim()) {
        showFieldError(name, 'Имя обязательно для заполнения');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Имя должно содержать минимум 2 символа');
        isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;
    if (!phone.value.trim()) {
        showFieldError(phone, 'Телефон обязателен для заполнения');
        isValid = false;
    } else if (!phoneRegex.test(phone.value)) {
        showFieldError(phone, 'Введите корректный номер телефона');
        isValid = false;
    }
    
    // Consent validation
    if (!consent.checked) {
        showFieldError(consent, 'Необходимо согласие на обработку данных');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.getAttribute('name');
    
    switch (fieldName) {
        case 'name':
            if (!field.value.trim()) {
                showFieldError(field, 'Имя обязательно для заполнения');
            } else if (field.value.trim().length < 2) {
                showFieldError(field, 'Имя должно содержать минимум 2 символа');
            }
            break;
            
        case 'phone':
            const phoneRegex = /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/;
            if (!field.value.trim()) {
                showFieldError(field, 'Телефон обязателен для заполнения');
            } else if (!phoneRegex.test(field.value)) {
                showFieldError(field, 'Введите корректный номер телефона');
            }
            break;
            
        case 'consent':
            if (!field.checked) {
                showFieldError(field, 'Необходимо согласие на обработку данных');
            }
            break;
    }
}

function showFieldError(field, message) {
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    const inputElements = document.querySelectorAll('.form-input, .form-select, .form-textarea, .form-check');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
    });
}

function submitAppointmentForm() {
    const form = document.getElementById('appointment-form');
    const submitBtn = form.querySelector('.appointment-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Заявка успешно отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
        
        // Reset form
        form.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Clear any errors
        clearFormErrors();
    }, 2000);
}

// Modal functionality
function initializeModals() {
    // Create modal backdrop if it doesn't exist
    let modalBackdrop = document.getElementById('modal-backdrop');
    if (!modalBackdrop) {
        modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'modal-backdrop';
        modalBackdrop.className = 'modal-backdrop';
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        `;
        document.body.appendChild(modalBackdrop);
        
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }
    
    // ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openCallbackModal() {
    const modalContent = `
        <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 500px; width: 90%;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #333;">Заказать звонок</h3>
                <button onclick="closeModal()" class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <form id="callback-form">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Ваше имя *</label>
                    <input type="text" name="name" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Телефон *</label>
                    <input type="tel" name="phone" required style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Удобное время</label>
                    <select name="time" style="width: 100%; padding: 0.75rem; border: 2px solid #ddd; border-radius: 8px;">
                        <option value="">Выберите время</option>
                        <option value="9-12">9:00 - 12:00</option>
                        <option value="12-15">12:00 - 15:00</option>
                        <option value="15-18">15:00 - 18:00</option>
                        <option value="18-21">18:00 - 21:00</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%; background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: 500; cursor: pointer;">
                    Заказать звонок
                </button>
            </form>
        </div>
    `;
    
    showModal(modalContent);
    
    // Handle callback form submission
    document.getElementById('callback-form').addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Заявка принята! Мы перезвоним вам в указанное время.', 'success');
        closeModal();
    });
}

function openServiceModal(serviceType) {
    const services = {
        '3d-scan': {
            title: '3D снимок зубов',
            content: 'Современная диагностика с помощью компьютерной томографии. Позволяет получить детальное 3D изображение зубов и челюстных костей для точной диагностики.',
            price: 'От 30 рублей'
        },
        'safe-treatment': {
            title: 'Безопасное лечение',
            content: 'Максимальная защита пациентов и персонала. Все процедуры проводятся с соблюдением повышенных мер безопасности.',
            price: 'Безопасность - наш приоритет'
        },
        'whitening': {
            title: 'Отбеливание зубов Beyond',
            content: 'Профессиональное отбеливание зубов с использованием современной системы Beyond. Безопасно и эффективно.',
            price: '400 рублей за 2 челюсти'
        },
        'implantation': {
            title: 'Имплантация зубов',
            content: 'Высококачественная имплантация с пожизненной гарантией от производителя. Используем только проверенные системы имплантов.',
            price: 'От 905 рублей'
        },
        'microscope': {
            title: 'Лечение под микроскопом',
            content: 'Лечение зубов с использованием дентального микроскопа обеспечивает максимальную точность и качество.',
            price: 'От 250 рублей'
        },
        'pediatric': {
            title: 'Детская стоматология',
            content: 'Специализированный прием детей с особым подходом. Наши детские врачи создают комфортную атмосферу для маленьких пациентов.',
            price: 'Индивидуальный подход'
        }
    };
    
    const service = services[serviceType];
    if (!service) return;
    
    const modalContent = `
        <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 600px; width: 90%;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #333;">${service.title}</h3>
                <button onclick="closeModal()" class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">${service.content}</p>
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <strong style="color: #007bff;">${service.price}</strong>
                </div>
                <button onclick="scrollToSection('appointment'); closeModal();" class="btn btn-primary" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 500; cursor: pointer;">
                    Записаться на прием
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function openDoctorModal(doctorId) {
    // This would normally fetch doctor data from an API or database
    const doctors = {
        'shnip': {
            name: 'Евгений Васильевич Шнип',
            position: 'Врач-стоматолог-ортопед',
            experience: '15+ лет',
            specialization: 'Протезирование, коронки, мостовидные протезы'
        },
        'tavakolian': {
            name: 'Елизавета Эдуардовна Таваколиан', 
            position: 'Врач-стоматолог-терапевт (детский)',
            experience: '12+ лет',
            specialization: 'Детская стоматология, профилактика'
        }
        // Add more doctors as needed
    };
    
    const doctor = doctors[doctorId] || doctors['shnip'];
    
    const modalContent = `
        <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 600px; width: 90%;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #333;">${doctor.name}</h3>
                <button onclick="closeModal()" class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Должность:</strong> ${doctor.position}</p>
                <p><strong>Опыт работы:</strong> ${doctor.experience}</p>
                <p><strong>Специализация:</strong> ${doctor.specialization}</p>
                <button onclick="scrollToSection('appointment'); closeModal();" class="btn btn-primary" style="background: linear-gradient(135deg, #007bff, #0056b3); color: white; border: none; padding: 1rem 2rem; border-radius: 8px; font-weight: 500; cursor: pointer; margin-top: 1rem;">
                    Записаться к врачу
                </button>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function openPrivacyModal() {
    const modalContent = `
        <div class="modal-content" style="background: white; border-radius: 12px; padding: 2rem; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h3 style="margin: 0; color: #333;">Политика конфиденциальности</h3>
                <button onclick="closeModal()" class="modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
            </div>
            <div class="modal-body" style="color: #666; line-height: 1.6;">
                <h4>Обработка персональных данных</h4>
                <p>ООО "Мона Лиза Дентал" обязуется соблюдать конфиденциальность персональных данных пользователей и обеспечивать их защиту.</p>
                <h4>Цели сбора данных</h4>
                <ul>
                    <li>Запись на прием к врачу</li>
                    <li>Обратная связь с пациентами</li>
                    <li>Информирование о услугах клиники</li>
                </ul>
                <h4>Защита данных</h4>
                <p>Мы применяем современные методы защиты информации и не передаем данные третьим лицам без согласия пользователя.</p>
            </div>
        </div>
    `;
    
    showModal(modalContent);
}

function showModal(content) {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.innerHTML = content;
        backdrop.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const modal = backdrop.querySelector('.modal-content');
        if (modal) {
            modal.focus();
        }
    }
}

function closeModal() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-slide, .about-block, .doctor-card, .news-card, .feature-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add fade-in CSS class if it doesn't exist
    if (!document.querySelector('style[data-fade-in]')) {
        const style = document.createElement('style');
        style.setAttribute('data-fade-in', 'true');
        style.textContent = `
            .service-slide, .about-block, .doctor-card, .news-card, .feature-item {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; margin-left: auto;">&times;</button>
        </div>
    `;
    
    // Add animation keyframes if they don't exist
    if (!document.querySelector('style[data-notification-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification-animations', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization
const debouncedResize = debounce(() => {
    // Handle responsive changes
    updateActiveNavLink();
}, 250);

window.addEventListener('resize', debouncedResize);

// Service worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Global functions for onclick handlers
window.scrollToSection = scrollToSection;
window.openCallbackModal = openCallbackModal;
window.openServiceModal = openServiceModal;
window.openDoctorModal = openDoctorModal;
window.openNewsModal = openDoctorModal; // Reuse modal functionality
window.openPrivacyModal = openPrivacyModal;
window.openTermsModal = openPrivacyModal; // Reuse modal functionality
window.closeModal = closeModal;
window.showNotification = showNotification;