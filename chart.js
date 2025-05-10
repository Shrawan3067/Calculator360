// Chart.js configuration
const ctx = document.getElementById('compoundChart').getContext('2d');

function updateChart(initialInvestment, totalContributions, totalInterest) {
  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Initial Investment', 'Total Contributions', 'Total Interest'],
      datasets: [{
        data: [initialInvestment, totalContributions, totalInterest],
        backgroundColor: [
          'rgba(77, 187, 143, 0.9)',
          'rgba(107, 122, 133, 0.9)',
          'rgba(240, 230, 239, 0.9)'
        ],
        borderColor: [
          'rgba(77, 187, 143, 1)',
          'rgba(107, 122, 133, 1)',
          'rgba(240, 230, 239, 1)'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(77, 187, 143, 1)',
          'rgba(107, 122, 133, 1)',
          'rgba(240, 230, 239, 1)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      hover: {
        mode: false,
        animationDuration: 0
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'center',
          labels: {
            color: '#6b7a85',
            font: {
              family: 'Inter',
              size: 12,
              weight: '600'
            },
            padding: 10,
            boxWidth: 12,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(240, 230, 239, 0.95)',
          titleColor: '#6b7a85',
          bodyColor: '#4b4b4b',
          borderColor: '#e6e9e6',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          callbacks: {
            title: function(context) {
              return context[0].label;
            },
            label: function(context) {
              return 'Amount: $' + context.raw.toLocaleString();
            }
          }
        }
      },
      layout: {
        padding: {
          top: 20,
          bottom: 50,
          left: 20,
          right: 20
        }
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });

  return chart;
}
