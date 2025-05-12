// 차트 관련 유틸리티 함수들
import {
    Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend
  } from 'chart.js'
  
  Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)
  
  export function createBarChart(ctx, labels, datasets) {
    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    })
  }
  