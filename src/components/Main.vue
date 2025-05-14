<template>
    <div class="container-fluid px-4">            
        <div class="row mb-4">
            <div class="col-xl-8">
                <div class="card relative" style="height: 80vh;">
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
                    <div style="color: white; font-size: 1.25rem; font-weight: 600; text-align: center;">
                        먼저 좌측에서 시설 항목을 선택해주세요.
                    </div>
                    </div>
                </div>
            </div>
            <!-- charts -->
            <Charts />
        </div>
        <!-- DataList -->
        <DataTable />           
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

</style>