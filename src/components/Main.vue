<template>
    <div class="container-fluid">            
        <div class="row mb-4">
            <div class="col-xl-7">
                <div class="card map-card">
                    <!-- NaverMap -->
                    <NaverMap class="w-100 h-100"/>

                    <div
                    v-if="selectedFacName.length == 0"
                    style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 10;
                        background-color: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        pointer-events: auto;
                    "
                    >
                    <!-- <div style="color: white; font-size: 1.25rem; font-weight: 600; text-align: center;">
                        먼저 좌측에서 시설 항목을 선택해주세요.
                    </div> -->
                    <div class="guide-text pc-only">
                      먼저 좌측에서 시설 항목을 선택해주세요.
                    </div>
                    <div class="guide-text mobile-only">
                      먼저 상단(☰ 메뉴)에서 시설 항목을 선택해주세요.
                    </div>
                    </div>
                </div>
            </div>
            <!-- charts -->
            <Charts />
        </div>
        <!-- DataList -->
        <!-- <DataTable />            -->
    </div>
</template>

<script setup>
import { onMounted , ref , computed } from 'vue';
import NaverMap from '@/components/NaverMap.vue';
import Charts from '@/components/Charts.vue';
import DataTable from '@/components/DataTable.vue';
import { useFacilityStore } from '@/stores/useFacilityStore';

const facilityStore = useFacilityStore();
const selectedFacName = computed(() => facilityStore.getFacName); // 선택된 시설항목명



</script>

<style>

.guide-text {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  padding: 1rem;
}

/* PC 전용 (min-width 기준) */
.pc-only {
  display: block;
}
.mobile-only {
  display: none;
}

@media screen and (max-width: 768px) {
  .pc-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }
}

.map-card {
  position: relative;
  height: 95%; /* 데스크탑 기준 */
  display: flex;
  flex-direction: column;
}

/* 모바일 ~ 중형 디바이스에 대해 height 재지정 */
@media (max-width: 576px) {
  .map-card {
    height: 250px;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .map-card {
    height: 300px;
  }
}

@media (min-width: 769px) and (max-width: 992px) {
  .map-card {
    height: 350px;
  }
}

@media (min-width: 993px) and (max-width: 1200px) {
  .map-card {
    height: 400px;
  }
}

@media (min-width: 1201px) and (max-width: 1400px) {
  .map-card {
    height: 500px;
  }
}

/* @media (max-width: 767px) {
  .map-card {
    height: 350px; 
  }
} */

/* @media (max-width: 576px) {
    .map-card {
        height: 350px; 
    }
}
@media (max-width: 768px) {
    .map-card {
        height: 350px; 
    }
}
@media (max-width: 992px) {
    .map-card {
        height: 350px; 
    }
}
@media (max-width: 1200px) {
    .map-card {
        height: 350px; 
    }
}
@media (max-width: 1400px) {
    .map-card {
        height: 350px; 
    }
} */



.row > * {
    padding-right: 0;
    padding-left: 0;
    margin-top: var(--bs-gutter-y);
}
</style>