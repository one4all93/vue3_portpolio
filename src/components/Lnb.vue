<template>
    <div id="layoutSidenav_nav">
        <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div class="sb-sidenav-menu">
                <div class="nav">

                    <a :class="'nav-link collapsed ' + (clickOn ? 'active' : '')" 
                       href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" 
                       aria-expanded="false" aria-controls="collapseLayouts"
                       @click.prevent="clickOn = !clickOn">
                        <div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                        시설 항목
                        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                    </a>
                    <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav class="sb-sidenav-menu-nested nav" v-for="(facName, index) in Object.keys(facilitys)" :key="index">
                            <a :class="'nav-link ' + (selectedFacName == facName ? 'active' : '')" @click.prevent="clickLnb(facName)" href="javascript.void(0);">{{ facName }}</a>
                        </nav>
                    </div>
            
                </div>
            </div>
            <div class="sb-sidenav-footer">
                <div class="small"> custom by One4All93 </div>
            </div>
        </nav>
    </div>
</template>

<script setup>    
import { computed, defineProps, ref } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';

// props 정의
// const facilitys = defineProps({
//   facilitys: Object // 또는 정확한 타입 명시 (예: Record<string, any> 또는 특정 타입)
// })
const { facilitys } = defineProps(['facilitys']);
//console.log('Lnb component setup', Object.keys(facilitys));

const clickOn = ref(false); // 클릭 상태

const facilityStore = useFacilityStore();
const selectedFacName = computed(() => facilityStore.getFacName); // 선택된 시설항목명

function clickLnb(facName) {
    console.log('Lnb.vue :: clickLnb', facName , selectedFacName.value);
    // 한번 더 선택하면 값 초기화
    if (selectedFacName.value == facName) {
        facilityStore.selectFacName('');
    }else{
        // 스토어에 값 업데이트
        facilityStore.selectFacName(facName);
    }
}
</script>

<style>

</style>