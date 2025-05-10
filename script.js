document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Navigation items mapping
    const pageToButtonMap = {
        'index.html': ['home-btn', 'mobile-home-btn'],
        'fincancial-calculators.html': ['financial-btn', 'mobile-financial-btn'],
        'health-and-physical-calculators.html': ['health-btn', 'mobile-health-btn'],
        'math-calculators.html': ['math-btn', 'mobile-math-btn'],
        'science-calculators.html': ['science-btn', 'mobile-science-btn'],
        // Add mappings for all calculator pages that should show Financial as active
        'compound-interest-calculator.html': ['financial-btn', 'mobile-financial-btn'],
        'loan-calculator.html': ['financial-btn', 'mobile-financial-btn'],
        // Add more financial calculators here as needed
    };

    // Cache DOM elements
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Set active navigation item based on current page
    function setActiveNavItem() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Reset all buttons first
        navLinks.forEach(link => {
            link.classList.remove('currency-active');
            link.classList.add('text-[#a1a9a9]');
        });

        // Find which button should be active
        for (const [page, buttonIds] of Object.entries(pageToButtonMap)) {
            if (currentPage === page) {
                buttonIds.forEach(id => {
                    const button = document.getElementById(id);
                    if (button) {
                        const link = button.querySelector('.nav-link');
                        if (link) {
                            link.classList.add('currency-active');
                            link.classList.remove('text-[#a1a9a9]');
                        }
                    }
                });
                break;
            }
        }
    }

    // Handle page navigation without artificial delays
    function navigateTo(url) {
        // Update active button immediately for instant feedback
        const currentPage = url.split('/').pop() || 'index.html';
        for (const [page, buttonIds] of Object.entries(pageToButtonMap)) {
            if (currentPage === page) {
                buttonIds.forEach(id => {
                    const button = document.getElementById(id);
                    if (button) {
                        const link = button.querySelector('.nav-link');
                        if (link) {
                            // Update active state immediately
                            setActiveNavItem();
                        }
                    }
                });
                break;
            }
        }
        
        // Navigate immediately without fade effects
        window.location.href = url;
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function() {
        setActiveNavItem();
    });

    // Add click event listeners to all navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const link = this.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href && (href.startsWith(window.location.origin) || href.endsWith('.html'))) {
                    e.preventDefault();
                    navigateTo(href);
                }
            }
        });
    });

    // Initialize active state
    setActiveNavItem();
});