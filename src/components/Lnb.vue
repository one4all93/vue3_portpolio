<template>
    <!-- <div id="layoutSidenav_nav"> -->
        <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav">
                    <div class="sb-sidenav-menu-heading">시설데이터</div>

                    <a :class="'nav-link ' + ((selectedFacName == facName) ? 'active' : '')" 
                       href="javascript.void(0);" @click.prevent="clickLnb(facName)"
                       v-for="(facName, index) in Object.keys(facilitys)" :key="index"
                       >
                        <div class="sb-nav-link-icon">
                            <!-- <i class="fas fa-tachometer-alt"></i> -->
                            <!-- <i class="fas fa-regular fa-book"></i> -->
                        </div>
                        {{ menuNameMap[facName] || facName }}
                    </a>

                    <div class="sb-sidenav-menu-heading">도움말</div>
                    <a class="nav-link" href="javascript.void(0);">
                        <div class="sb-nav-link-icon"><i class="fas fa-solid fa-circle-info"></i></div>
                        Help
                    </a>
            
                </div>
            </div>

            <!-- <div class="sb-sidenav-footer d-grid p-3">
                <button @click="openAddPopup" class="btn btn-outline-light btn-sm w-100">
                    + 데이터 항목 추가
                </button>
                <div class="small mt-2">custom by One4All93</div>
            </div> -->
            
            <div class="sb-sidenav-footer">
                <div class="small"> custom by One4All93 </div>
                sdadsadsa
            </div>
        </nav>
    <!-- </div> -->
</template>

<script setup>    
import { computed, defineProps, ref } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';

// props 정의
// const facilitys = defineProps({
//   facilitys: Object // 또는 정확한 타입 명시 (예: Record<string, any> 또는 특정 타입)
// })
//const { facilitys } = defineProps(['facilitys']);

const facilitys = computed(() => facilityStore.getFacilities); // 시설정보 스토어에서 데이터 가져오기

const clickOn = ref(false); // 클릭 상태

const facilityStore = useFacilityStore();
const selectedFacName = computed(() => facilityStore.getFacName); // 선택된 시설항목명

function clickLnb(facName) {
    //console.log('Lnb.vue :: clickLnb', facName , selectedFacName.value);
    // 한번 더 선택하면 값 초기화
    if (selectedFacName.value == facName) {
        facilityStore.selectFacName('');
    }else{
        // 스토어에 값 업데이트
        facilityStore.selectFacName(facName);
    }
    window.dispatchEvent(new CustomEvent('close-marker-popup')); // 마커 팝업 닫기
}

const menuNameMap = {
    'SeoulPublicLibraryInfo': '서울공공도서관',
    'SearchParkInfoService': '서울공공체육시설',
    'ListPublicReservationCulture': '서울시공원',
};

</script>

<style>

</style>