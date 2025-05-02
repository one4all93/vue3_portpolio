<template>
    <div class="container-fluid px-4">            
        <div class="row mb-4">
            <div class="col-xl-8">
                <div class="card" style="height: 80vh;">
                    <!-- NaverMap -->
                    <NaverMap class="w-100 h-100"/>
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
import { onMounted , ref } from 'vue';
import NaverMap from '@/components/NaverMap.vue';
import Charts from '@/components/Charts.vue';
import DataTable from '@/components/DataTable.vue';

</script>

<style>

</style>