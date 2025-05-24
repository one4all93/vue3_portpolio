<template>
    <canvas 
      id="myBarChart" 
      style="display: block; height: 100%; width: 100%;" 
      class="chartjs-render-monitor" 
      ref="chart">
    </canvas>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted , onBeforeUnmount, watch, computed } from 'vue';
  import { Chart, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js';

  import { emitter } from '@/utils/eventBus';

  import { useFacilityStore } from '@/stores/useFacilityStore';
  const facilityStore = useFacilityStore();
  const selectedGu = computed(() => facilityStore.getSelectedGu); // 선택된 구코드
  
  // Chart.js 컴포넌트 등록(chart.js v3.x 이상 부터는 Chart.register() 사용 ***)
  Chart.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);
  
  const chart = ref(null);
  let chartInstance = null;

  const selectedIndex = ref(null); // 클릭된 데이터 인덱스
  
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
        indexAxis: 'y', // x축을 수평으로
        responsive: true, // 반응형
        maintainAspectRatio: false,  // 높이 자유롭게
        responsive: true,
        plugins: {
          legend: { display: false }, // 범례 숨김 :: 데이터셋 첫번째 객체의 스타일을 따라감**
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            title: { display: true, text: '시설수'}
          },
          y: {
            title: { display: true, text: ''},
            //beginAtZero: true
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index; // 클릭한 데이터 인덱스
            const datasetIndex = elements[0].datasetIndex;
            const dataset = chartInstance.data.datasets[datasetIndex];

            // 기존 색 모두 초기화
            initColor(dataset);

            if(selectedIndex.value == null || index != selectedIndex.value || selectedGu.value == null){
              //console.log('선택된 구코드 :: selectedGu', selectedGu);
              //console.log('새로운 데이터 클릭' , dataset);
              // 클릭된 항목만 색 변경
              dataset.backgroundColor[index] = '#FF6384';
              dataset.borderColor[index] = '#c2185b'; 
              //console.log('선택된 구코드', props.labels[index]);
              facilityStore.setSelectedGu(props.labels[index]); // 클릭한 구코드 저장
            }else if(selectedIndex.value != null && index == selectedIndex.value){
              //console.log('같은 데이터 클릭', index , selectedIndex.value);
              initColor(dataset);
              facilityStore.setSelectedGu(null); // 빈값 구코드 저장
            }

            selectedIndex.value = index;
            chartInstance.update();
          }
        },
        //events: ['click'],
      },
      plugins: [noDataPlugin]
    });
  };

  // 차트 클릭 초기화 (클릭한 데이터)
  function initColor(dataset) {
    // 클릭된 데이터 색 초기화
    dataset.backgroundColor = dataset.data.map(() => '#36A2EB');
    dataset.borderColor = dataset.data.map(() => '#1e88e5');
  }

  // 데이터 없을때 사용
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

  // watch(selectedGu ,(newVal)=>{
  //   if(newVal != null){
  //     // 노원구 및 몇개의 구가 서울시XX구로 들어가서 indexOf로 찾을 수 없음 :: findIndex로 찾기
  //     const index = props.labels.findIndex(label => newVal.includes(label) );
  //     //const index = props.labels.indexOf(newVal);
  //     console.log('Chart :: selectedGu index', index);
  //     if(index != -1){
  //       chartInstance.setActiveElements([
  //         { datasetIndex: 0, index: index }
  //       ]);
  //       chartInstance.tooltip.setActiveElements([
  //         { datasetIndex: 0, index: index }
  //       ], { x: 0, y: 0 });
  //       selectedIndex.value = index;
  //     }else{
  //       chartInstance.setActiveElements([]);
  //       chartInstance.tooltip.setActiveElements([], { x: 0, y: 0 });
  //       selectedIndex.value = null; 
  //     }
  //   }
    
  //   chartInstance.update();
  // })

  // const clickData = {
  //   id: 'clickData',
  //   afterEvent(chart, args , pluginOptions) {
  //     const event = args.event;
  //     // 클릭 이벤트 아니면 리턴
  //     if(event.type !== 'click') return;

  //     console.log('clickData', event , chart);
  //   }
  // }

  const handleSelectGu = (selectGu) => {
    if(selectGu != null){
      const index = props.labels.findIndex(label => selectGu.includes(label) );
      //console.log('Chart.vue :: selectGu index', index);
      if(index != -1){
        chartInstance.setActiveElements([
          { datasetIndex: 0, index: index }
        ]);
        chartInstance.tooltip.setActiveElements([
          { datasetIndex: 0, index: index }
        ], { x: 0, y: 0 });
      }else{
        chartInstance.setActiveElements([]);
        chartInstance.tooltip.setActiveElements([], { x: 0, y: 0 });
      }
    }else{
      chartInstance.setActiveElements([]);
      chartInstance.tooltip.setActiveElements([], { x: 0, y: 0 });
    }
    chartInstance.update();
  };
  
  onMounted(()=> {
    // 차트 생성
    createChart();

    // NaverMap.vue :: selectGu 이벤트버스 on
    // watch로 값을 추적하면 한번 더 클릭시 반응 X => 이벤트버스로 차트 초기화 구현
    emitter.on('NaverMap.vue :: selectGu', handleSelectGu);
  });
  
  watch(
    () => [props.labels, props.datasets],
    createChart,
    { deep: true }
  );
  
  onBeforeUnmount(() => {
    if (chartInstance) chartInstance.destroy();
  });

  onUnmounted(() => {
    emitter.off('NaverMap.vue :: selectGu', handleSelectGu);
  });

  </script>
  