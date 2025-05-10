document.addEventListener('DOMContentLoaded', function() {
  // Get both theme toggle buttons
  const desktopToggle = document.getElementById('desktop-theme-toggle');
  const mobileToggle = document.getElementById('mobile-theme-toggle');
  const desktopIcon = document.querySelector('.desktop-theme-icon');
  const mobileIcon = document.querySelector('.mobile-theme-icon');
  const lightLogos = document.querySelectorAll('.light-logo');
  const darkLogos = document.querySelectorAll('.dark-logo');
  
  // Get theme from localStorage or system preference
  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply theme immediately on page load
  applyTheme(currentTheme);

  // Add click handlers to both toggle buttons
  desktopToggle.addEventListener('click', toggleTheme);
  mobileToggle.addEventListener('click', toggleTheme);

  function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyTheme(isDark ? 'dark' : 'light');
  }

  // Function to apply theme consistently
  function applyTheme(theme) {
    // Prevent transition during initial page load
    document.documentElement.style.transition = 'none';
    
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      desktopIcon.classList.replace('fa-sun', 'fa-moon');
      mobileIcon.classList.replace('fa-sun', 'fa-moon');
      lightLogos.forEach(logo => logo.style.display = 'block');
      darkLogos.forEach(logo => logo.style.display = 'none');
    } else {
      document.documentElement.classList.add('dark');
      desktopIcon.classList.replace('fa-moon', 'fa-sun');
      mobileIcon.classList.replace('fa-moon', 'fa-sun');
      lightLogos.forEach(logo => logo.style.display = 'none');
      darkLogos.forEach(logo => logo.style.display = 'block');
    }
    
    // Force synchronous layout update
    document.documentElement.offsetHeight;
    
    // Restore transitions after theme is applied
    document.documentElement.style.transition = '';
  }

  // Save theme to localStorage before page unload
  window.addEventListener('beforeunload', function() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  });
});