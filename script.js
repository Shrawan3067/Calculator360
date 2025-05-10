// Navigation items mapping
const pageToButtonMap = {
    'index.html': ['home-btn', 'mobile-home-btn'],
    'fincancial-calculators.html': ['financial-btn', 'mobile-financial-btn'],
    'health-and-physical-calculators.html': ['health-btn', 'mobile-health-btn'],
    'math-calculators.html': ['math-btn', 'mobile-math-btn'],
    'science-calculators.html': ['science-btn', 'mobile-science-btn'],
    'compound-interest-calculator.html': ['financial-btn', 'mobile-financial-btn'],
    'loan-calculator.html': ['financial-btn', 'mobile-financial-btn']
};

// Chart initialization
function updateChart(principal, contributions, interest) {
    const ctx = document.getElementById('compoundChart').getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Initial Investment', 'Contributions', 'Interest'],
            datasets: [{
                data: [principal, contributions, interest],
                backgroundColor: [
                    'rgba(77, 187, 143, 0.8)',
                    'rgba(61, 179, 166, 0.8)',
                    'rgba(141, 224, 166, 0.8)'
                ],
                borderColor: [
                    'rgba(77, 187, 143, 1)',
                    'rgba(61, 179, 166, 1)',
                    'rgba(141, 224, 166, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.raw !== null) {
                                label += '$' + context.raw.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                });
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Compound Interest Calculator with proper contribution timing
function calculateCompoundInterest() {
    // Get input values
    const initial = parseFloat(document.getElementById('principal').value.replace(/[^0-9.-]/g, '')) || 0;
    const annual = parseFloat(document.getElementById('annual-contrib').value.replace(/[^0-9.-]/g, '')) || 0;
    const monthly = parseFloat(document.getElementById('monthly-contrib').value.replace(/[^0-9.-]/g, '')) || 0;
    const rate = parseFloat(document.getElementById('interest-rate').value.replace(/[^0-9.-]/g, '')) / 100 || 0;
    const freq = parseInt(document.getElementById('compounding-frequency').value) || 12;
    const contribTiming = document.getElementById('contrib-timing').value;
    const years = parseInt(document.getElementById('investment-years').value) || 0;
    const months = parseInt(document.getElementById('investment-months').value) || 0;
    const taxRate = parseFloat(document.getElementById('tax-rate').value.replace(/[^0-9.-]/g, '')) / 100 || 0;
    const inflationRate = parseFloat(document.getElementById('inflation-rate').value.replace(/[^0-9.-]/g, '')) / 100 || 0;

    // Calculate total months
    const totalMonths = years * 12 + months;
    
    // Initialize variables
    let balance = initial;
    let totalContribution = initial;
    let totalInterest = 0;
    let totalTaxPaid = 0;
    let totalGrossInterest = 0;

    // Monthly calculation loop
    for (let month = 1; month <= totalMonths; month++) {
        let deposit = 0;
        let contributionThisMonth = 0;

        // Handle contributions based on timing
        if (contribTiming === 'beginning') {
            // Add contributions at beginning of period
            if (monthly > 0) {
                deposit += monthly;
                contributionThisMonth += monthly;
            }
            
            // Add annual contribution at beginning of year
            if (month % 12 === 1 || month === 1) {
                deposit += annual;
                contributionThisMonth += annual;
            }
            
            // Add to balance before interest calculation
            balance += deposit;
            totalContribution += contributionThisMonth;
        }

        // Calculate interest for the period
        const periodicRate = Math.pow(1 + (rate/freq), (freq * 1) / 12) - 1;
        let interest = balance * periodicRate;
        totalGrossInterest += interest;
        
        // Calculate and deduct tax
        let tax = interest * taxRate;
        let netInterest = interest - tax;
        totalInterest += netInterest;
        totalTaxPaid += tax;
        balance += netInterest;

        if (contribTiming === 'end') {
            // Add contributions at end of period
            if (monthly > 0) {
                deposit += monthly;
                contributionThisMonth += monthly;
            }
            
            // Add annual contribution at end of year
            if (month % 12 === 0) {
                deposit += annual;
                contributionThisMonth += annual;
            }
            
            // Add to balance after interest calculation
            balance += deposit;
            totalContribution += contributionThisMonth;
        }

        // Adjust for inflation (monthly adjustment)
        if (inflationRate > 0) {
            balance /= (1 + (inflationRate / 12));
            // Also adjust the totals to reflect inflation-adjusted values
            totalContribution /= (1 + (inflationRate / 12));
            totalInterest /= (1 + (inflationRate / 12));
            totalTaxPaid /= (1 + (inflationRate / 12));
            totalGrossInterest /= (1 + (inflationRate / 12));
        }
    }

    // Format currency function
    const formatCurrency = (amount) => {
        return '$' + amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Update all output fields
    document.getElementById('initial-principal').textContent = formatCurrency(initial);
    document.getElementById('total-contributions').textContent = formatCurrency(totalContribution - initial);
    document.getElementById('total-interest').textContent = formatCurrency(totalGrossInterest);
    document.getElementById('estimated-tax').textContent = formatCurrency(totalTaxPaid);
    document.getElementById('end-balance').textContent = formatCurrency(balance);

    // Update chart with new values
    if (window.compoundChart) {
        window.compoundChart.destroy();
    }
    window.compoundChart = updateChart(initial, totalContribution - initial, totalGrossInterest);

    // Only show tax-related elements if tax is greater than 0
    const taxElements = [
        document.getElementById('estimated-tax'),
        document.getElementById('estimated-tax-label')
    ];
    
    taxElements.forEach(el => {
        if (el) el.style.display = taxRate > 0 ? "block" : "none";
    });

    // Add animation for the results
    const results = document.querySelectorAll('.text-center p:last-child');
    results.forEach(result => {
        result.style.opacity = '0';
        setTimeout(() => {
            result.style.opacity = '1';
        }, 100);
    });
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Navigation event delegation
    document.addEventListener('click', handleNavigationClick);

    // Handle browser back/forward
    window.addEventListener('popstate', setActiveNavItem);

    // Initialize active state
    setActiveNavItem();
    
    // Ensure body is visible
    document.body.style.opacity = '1';

    // Initialize calculator if on calculator page
    if (window.location.pathname.includes('compound-interest-calculator.html')) {
        // Add event listeners to all input fields
        const inputs = document.querySelectorAll(`
            #principal, #annual-contrib, #monthly-contrib, 
            #interest-rate, #compounding-frequency, #contrib-timing,
            #investment-years, #investment-months, 
            #tax-rate, #inflation-rate
        `);
        
        inputs.forEach(input => {
            input.addEventListener('input', calculateCompoundInterest);
            input.addEventListener('change', calculateCompoundInterest);
        });

        // Format currency inputs
        document.getElementById('principal').addEventListener('blur', function() {
            const value = parseFloat(this.value.replace(/[^0-9.-]/g, '')) || 0;
            this.value = '$' + value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });

        document.getElementById('annual-contrib').addEventListener('blur', function() {
            const value = parseFloat(this.value.replace(/[^0-9.-]/g, '')) || 0;
            this.value = '$' + value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });

        document.getElementById('monthly-contrib').addEventListener('blur', function() {
            const value = parseFloat(this.value.replace(/[^0-9.-]/g, '')) || 0;
            this.value = '$' + value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });

        // Initialize chart
        const initialInvestment = parseFloat(document.getElementById('principal').value.replace(/[^0-9.-]/g, '')) || 0;
        const totalContributions = parseFloat(document.getElementById('annual-contrib').value.replace(/[^0-9.-]/g, '')) || 0;
        const totalInterest = parseFloat(document.getElementById('interest-rate').value.replace(/[^0-9.-]/g, '')) || 0;
        
        // Create initial chart
        window.compoundChart = updateChart(initialInvestment, totalContributions, totalInterest);

        // Calculate initial values
        calculateCompoundInterest();
    }
});

// Set active navigation item
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Reset all buttons
    navLinks.forEach(link => {
        link.classList.remove('currency-active');
        link.classList.add('text-[#a1a9a9]');
    });

    // Activate current page button
    const buttonIds = pageToButtonMap[currentPage];
    if (buttonIds) {
        buttonIds.forEach(id => {
            const button = document.getElementById(id);
            const link = button?.querySelector('.nav-link');
            if (link) {
                link.classList.add('currency-active');
                link.classList.remove('text-[#a1a9a9]');
            }
        });
    }
}

// Handle page navigation
function navigateTo(url) {
    const currentPage = url.split('/').pop() || 'index.html';
    
    // Update active state
    setActiveNavItem();
    
    // Preserve theme during navigation
    const currentTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply theme immediately without transition
    document.documentElement.style.transition = 'none';
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update logos immediately
    const lightLogos = document.querySelectorAll('.light-logo');
    const darkLogos = document.querySelectorAll('.dark-logo');
    
    if (currentTheme === 'dark') {
        lightLogos.forEach(logo => logo.style.display = 'none');
        darkLogos.forEach(logo => logo.style.display = 'block');
    } else {
        lightLogos.forEach(logo => logo.style.display = 'block');
        darkLogos.forEach(logo => logo.style.display = 'none');
    }
    
    // Force layout recalculation
    document.documentElement.offsetHeight;
    
    // Restore transition
    document.documentElement.style.transition = 'none';
    
    // Smooth transition
    document.body.style.opacity = '0';
    window.location.href = url;
}

// Event delegation for navigation
function handleNavigationClick(e) {
    const link = e.target.closest('.nav-button')?.querySelector('a');
    if (link) {
        const href = link.getAttribute('href');
        if (href && (href.startsWith(window.location.origin) || href.endsWith('.html'))) {
            e.preventDefault();
            navigateTo(href);
        }
    }
}