<template>
    <canvas 
      id="myBarChart" 
      width="1288" 
      height="514" 
      style="display: block; height: 340px; width: 644px;" 
      class="chartjs-render-monitor" 
      ref="chart">
    </canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
  import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';
  
  // Chart.js 컴포넌트 등록(chart.js v3.x 이상 부터는 Chart.register() 사용 ***)
  Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
  
  const chart = ref(null);
  let chartInstance = null;
  
  const props = defineProps({
    type: { type: String, required: true },
    labels: { type: Array, required: true },
    datasets: { type: Array, required: true }
  });
  
  // Chart 생성 함수
  const createChart = () => {
    if (chartInstance) {
      chartInstance.destroy(); // 기존 차트 제거
    }
  
    chartInstance = new Chart(chart.value, {
      type: props.type,
      data: {
        labels: props.labels,
        datasets: props.datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            title: { display: true, text: '구이름' }
          },
          y: {
            title: { display: true, text: '시설수' },
            beginAtZero: true
          }
        }
      },
      plugins: [noDataPlugin]
    });
  };

  const noDataPlugin = {
    id: 'noDataMessage',
    beforeDraw(chart) {
        const { data } = chart;
        const hasData = data.datasets.some(dataset => dataset.data.length > 0);

        if (!hasData) {
        const ctx = chart.ctx;
        const { width, height } = chart;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#666';
        ctx.fillText('선택된 데이터가 없습니다.', width / 2, height / 2);
        ctx.restore();
        }
    }
  };

  
  onMounted(createChart);
  
  watch(
    () => [props.labels, props.datasets],
    createChart,
    { deep: true }
  );
  
  onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
  });

  </script>
  