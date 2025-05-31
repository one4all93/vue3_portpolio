<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="sb-nav-fixed">
    <!-- 안내페이지 -->
    <Intro />
    <!-- TopMenu :: 상단 메뉴바 -->
    <TopMenu />
    <div id="layoutSidenav">  
      <div id="layoutSidenav_nav">
        <!-- Lnb :: 왼쪽 메뉴바 -->
        <Lnb :facilitys="facilitys"/>
      </div>
      <div id="layoutSidenav_content">
        <main>
          <Main />
        </main>
      </div>
    </div>
    <InputPop />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';
// import HelloWorld from './components/HelloWorld.vue';
// import NaverMap from './components/NaverMap.vue';
import Lnb from '@/components/Lnb.vue';
import Main from '@/components/Main.vue';
import TopMenu from '@/components/TopMenu.vue';
import InputPop from './components/inputPop.vue';
import Intro from './components/intro.vue'; // 안내 페이지 컴포넌트

import axios from 'axios';

const facilityStore = useFacilityStore(); // 시설정보 스토어


//console.log('APP component setup');
// const facilitys = ref({
//   "서울공공도서관": [],
//   "서울공공체육시설": [],
// });  // 데이터의 변화를 감지하기 위해 ref를 사용*

const dbData = ref({}); // ref([])로 초기화해야 함

// 적재된 api 서비스 목록
const serviceList = computed(()=> facilityStore.getServiceList);

onMounted(() => {
    //console.log('Composition API :: App component mounted');
    /**
     * 1. 서울 공공도서관 데이터 읽어와서 / json 변환 / facilitys에 담기 / 스토어에 데이터 넣기
     */
    // fetch("/example/seoul_public_lib.json")
    // .then(res => res.json())
    // .then(data => {
    //     //console.log('facilitys', facilitys.value)
    //     //console.log('Main component mounted data', data.DATA);
    //     facilitys.value['서울공공도서관'].push(...data.DATA);
    //     // 시설 스토어에 데이터 넘겨주기
    //     facilityStore.setFacilities(facilitys.value);
    //     //console.log('facilitys', facilitys.value);
    // });

    const one4all93Url = 'http://13.124.148.205:8080/api/fetch/';

    // 여러데이터 동시 호출
    const promises = [];
    // 서비스명 반복 돌리면서 api요청 후 담아주기**
    for (const serviceName of serviceList.value) {
      const promise = axios.get(one4all93Url + serviceName)
        .then(response => {
          const jsonData = response.data;
          //console.log('jsonData', jsonData);
          dbData.value[serviceName] = jsonData;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
        // 요청 한번씩 돌아가면서 promises 배열에 담기
      promises.push(promise);
    }

    // 여러 데이터 동시 호출 후 완료된 후, 스토어에 담기
    Promise.all(promises)
      .then(() => {
        console.log('모든 db데이터 조회 완료 :: ' , dbData.value);
        facilityStore.setFacilities(dbData.value);
      })
      .catch(error => {
        console.error('db데이터 조회 완료 :: ', error);
      });
  });

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
