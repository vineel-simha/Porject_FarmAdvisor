document.addEventListener('DOMContentLoaded', () => {
    // 0. Auth & Session Logic
    const userJson = localStorage.getItem('farmadvisor_user');
    
    // Protect specific routes
    const protectedPages = ['market.html', 'schemes.html', 'kisan-pool.html', 'expert-chat.html'];
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    if (protectedPages.includes(currentPath) && !userJson) {
        alert("🔒 Please sign up or login to access this feature.");
        window.location.href = 'signup.html?redirect=' + currentPath;
        return; // Stop execution of the rest of the scripts
    }

    const navActionsOriginal = document.querySelector('.nav-actions');

    if(userJson && navActionsOriginal) {
        const user = JSON.parse(userJson);
        const firstName = user.name.split(' ')[0];
        
        const langSwitcher = navActionsOriginal.querySelector('.lang-switcher');
        const langSwitcherHTML = langSwitcher ? langSwitcher.outerHTML : '';
        
        const loggedInHTML = `
            ${langSwitcherHTML}
            <div class="user-dropdown" style="position: relative; display: inline-block; margin-left: 10px;">
                <button class="btn btn-green user-dropdown-btn" style="display: flex; align-items: center; gap: 5px;">👤 ${firstName} ▾</button>
                <div class="dropdown-content" style="display: none; position: absolute; top: 100%; left: 0; background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 150px; overflow: hidden; z-index: 100;">
                    <a href="#" style="display: block; padding: 12px 16px; color: var(--text-brown); text-decoration: none; border-bottom: 1px solid #eee;">My Profile</a>
                    <a href="#" style="display: block; padding: 12px 16px; color: var(--text-brown); text-decoration: none; border-bottom: 1px solid #eee;">My Crops</a>
                    <a href="#" class="logout-btn" style="display: block; padding: 12px 16px; color: #d00000; text-decoration: none;">Logout</a>
                </div>
            </div>
        `;
        navActionsOriginal.innerHTML = loggedInHTML;
        
        // Auto-fill state on Crop advice
        const stateSelect = document.getElementById('rec-state');
        if(stateSelect && user.state) {
            stateSelect.value = user.state;
        }
    } else if (navActionsOriginal) {
        const loginBtn = navActionsOriginal.querySelector('.nav-login');
        if(loginBtn) loginBtn.href = "login.html";
        const signupBtn = navActionsOriginal.querySelector('.btn-green');
        if(signupBtn) signupBtn.href = "signup.html";
    }

    // Event Delegation for dropdown and logout
    document.addEventListener('click', (e) => {
        // Toggle dropdown
        if (e.target.closest('.user-dropdown-btn')) {
            e.preventDefault();
            const dropdown = e.target.closest('.user-dropdown').querySelector('.dropdown-content');
            const isVisible = dropdown.style.display === 'block';
            document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
            dropdown.style.display = isVisible ? 'none' : 'block';
        } else if (!e.target.closest('.user-dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(d => d.style.display = 'none');
        }

        // Logout
        if (e.target.closest('.logout-btn')) {
            e.preventDefault();
            localStorage.removeItem('farmadvisor_user');
            window.location.href = 'index.html';
        }
    });

    // Toast Logic
    const toastMsg = sessionStorage.getItem('farmadvisor_toast');
    if(toastMsg) {
        const toast = document.createElement('div');
        toast.textContent = toastMsg;
        toast.style.cssText = "position: fixed; bottom: 20px; right: 20px; background: var(--primary-green); color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 9999; font-family: 'DM Sans', sans-serif; font-weight: 500; transform: translateY(100px); opacity: 0; transition: all 0.3s ease;";
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        
        setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
        sessionStorage.removeItem('farmadvisor_toast');
    }

    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.createElement('div');
    mobileMenu.classList.add('nav-mobile-menu');
    
    // Copy nav links to mobile menu
    const navLinks = document.querySelector('.nav-links').cloneNode(true);
    const navActions = navActionsOriginal ? navActionsOriginal.cloneNode(true) : null;
    
    mobileMenu.appendChild(navLinks);
    if(navActions) mobileMenu.appendChild(navActions);
    document.body.appendChild(mobileMenu);

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');
        
        // Hamburger animation
        const spans = hamburger.querySelectorAll('span');
        if (isActive) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('glass');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('glass');
        }
    });

    // Initialize navbar state
    if (window.scrollY <= 50) {
        navbar.classList.add('glass');
    }

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Home Page Specific Logic ---
    
    // 1. Live Clock
    const clockElement = document.getElementById('hero-clock');
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            clockElement.textContent = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // 2. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetElement = entry.target;
                    const target = +targetElement.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            targetElement.innerText = Math.ceil(current).toLocaleString('en-IN') + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            targetElement.innerText = target.toLocaleString('en-IN') + '+';
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(targetElement);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // 3. Testimonials Carousel
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length > 0) {
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        let slideInterval = setInterval(nextSlide, 4000);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                currentSlide = index;
                showSlide(currentSlide);
                slideInterval = setInterval(nextSlide, 4000);
            });
        });
    }
});
