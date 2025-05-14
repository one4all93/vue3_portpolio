<script setup>
import { ref, onMounted } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';
// import HelloWorld from './components/HelloWorld.vue';
// import NaverMap from './components/NaverMap.vue';
import Lnb from '@/components/Lnb.vue';
import Main from '@/components/Main.vue';

const facilityStore = useFacilityStore(); // 시설정보 스토어

//console.log('APP component setup');
const facilitys = ref({
  "서울공공도서관": [],
  "서울공공체육시설": [],
});  // 데이터의 변화를 감지하기 위해 ref를 사용*

onMounted(() => {
    //console.log('Composition API :: App component mounted');
    /**
     * 1. 서울 공공도서관 데이터 읽어와서 / json 변환 / facilitys에 담기 / 스토어에 데이터 넣기
     */
    fetch("/example/seoul_public_lib.json")
    .then(res => res.json())
    .then(data => {
        //console.log('facilitys', facilitys.value)
        //console.log('Main component mounted data', data.DATA);
        facilitys.value['서울공공도서관'].push(...data.DATA);
        // 시설 스토어에 데이터 넘겨주기
        facilityStore.setFacilities(facilitys.value);
        //console.log('facilitys', facilitys.value);
    });
});
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="sb-nav-fixed">
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
  </div>
</template>

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
