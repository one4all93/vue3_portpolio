<template>
    <div class="col-xl-5">
        <div class="card h-50">
            <div class="card-header">
                <svg class="svg-inline--fa fa-chart-bar me-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-bar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></svg>
                {{ makeFacName('chart') }}
            </div>
            <div class="card-body" style="width: 100%; height: 500px; overflow: auto;">

                <Chart 
                    :type="'bar'" 
                    :labels="labels" 
                    :datasets="datasets"
                />

            </div>
        </div>
        <!-- <div class="card h-50">
            <div class="card-header">
                <svg class="svg-inline--fa fa-chart-bar me-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-bar" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zm96 96c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-192 0c-17.7 0-32-14.3-32-32zm32 64H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path></svg>
                Bar Chart Example
            </div>
            <div class="card-body"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div><canvas id="myBarChart" width="1288" height="514" style="display: block; height: 257px; width: 644px;" class="chartjs-render-monitor"></canvas></div>
        </div> -->
        <DataTable />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';
// 차트 공용 컴포넌트
import Chart from '@/components/Chart.vue';
import DataTable from './DataTable.vue';

const facilityStore = useFacilityStore();

const facName = computed(() => facilityStore.getFacName); // 선택된 시설명
const facData = computed(() => facilityStore.getFacilities); // 시설정보
const dataColumn = computed(()=> facilityStore.dataColumn); // 데이터별 컬럼명 매핑
const makeFacName = computed(()=> facilityStore.makeFacName); // 선택된 시설명

// 차트 데이터 :: 라벨(x축)
const labels = computed(() => {
    if(!facData.value[facName.value]) return;
    // console.log('facData', facData.value[facName.value]);
    // console.log('dataColumn',dataColumn.value);
    return Array.from(new Set(facData.value[facName.value].map(facility => facility[dataColumn.value['guCode'].val])));
    //return facilityStore.getFacilities.map(facility => facility.facName);
});

// 차트 데이터 :: 데이터셋(y축)
const datasets = computed(() => {
    if(!facData.value[facName.value]) return;
    // 갯수만 필요하다고 생각해서 갯수만 담아주는 방식으로 변경**
    const map = new Map();
    //console.log('facData', facData.value[facName.value]);
    //console.log("'dataColumn['guCode'].val' ", dataColumn.value['guCode'].val)
    facData.value[facName.value].forEach(facility => {
        const guCode = facility[dataColumn.value['guCode'].val]; // 구 코드
        //console.log('guCode', guCode);
        map.set(guCode, (map.get(guCode) || 0) + 1); // 구 코드가 있으면 카운트를 증가시킴
    });
    //console.log('map', map);
    const countsByGu = labels.value.map(label => map.get(label) || 0);
    //console.log('countsByGu', countsByGu);
    return [{
        label: facName.value,
        data: countsByGu,
        backgroundColor: '#36A2EB',
        borderColor: '#1e88e5',
        hoverBackgroundColor: '#FF6384',
        hoverBorderColor: '#c2185b',
        borderWidth: 1
    }];

    // return new Set(facData.value[facName.value].reduce((data, facility) => {
    //     // 해당하는 구코드키값 없으면 구코드배열새로 생성
    //     if(!data[facility.code_value]) {
    //         data[facility.code_value] = [];
    //     }
    //     // 구코드배열에 시설값 추가
    //     data[facility.code_value].push(facility.value);
    //     return data;
    // }, []));
});

// 차트 데이터 :: 데이터셋 갯수(그룹바이한 데이터가 부담스러울거 같아서 갯수만 카운트)
// const datasetsCount = computed(() => {
//     if(!datasets) return;
//     console.log('datasetsCount', datasets.value);
//     //return Array.from(new Set(facData.value[facName.value].map(facility => facility.code_value === labels).length));
// });



</script>

<style>
.chart-container {
  height: 500px;
  overflow-y: auto;
}
</style>