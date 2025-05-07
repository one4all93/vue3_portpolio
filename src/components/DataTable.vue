<template>
    <div class="row">
        <div class="col">
            <div class="card"> 
                <div class="card mb-4">
                <div class="card-header">
                    <svg class="svg-inline--fa fa-table me-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>
                    {{ makeFacName }}
                </div>
                <div class="card-body">
                    <div class="datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns"><div class="datatable-top">
                    <div class="datatable-dropdown">
                    <label>
                        <select class="datatable-selector" v-model="itemsPerPage">
                            <option 
                                v-for="item in viewCount" :key="item.value"
                                :value="item.value" 
                                :selected="item.selected"
                            > {{ item.value }}
                            </option>
                        </select> 개씩 보기
                    </label>
                </div>
                <div class="datatable-search">
                    <input class="datatable-input" placeholder="Search..." type="search" title="Search within table" aria-controls="datatablesSimple">
                </div>
                </div>
                <div class="datatable-container">
                    <table id="datatablesSimple" class="datatable-table">
                        <thead>
                            <tr>
                                <th data-sortable="true" style="width: 19.479553903345725%;">
                                    <a href="#" class="datatable-sorter">시설명</a>
                                </th>
                                <th data-sortable="true" style="width: 8.401486988847584%;">
                                    <a href="#" class="datatable-sorter">소속구</a>
                                </th>
                                <th data-sortable="true" style="width: 30.03717472118959%;">
                                    시설주소
                                </th>
                                <th data-sortable="true" style="width: 15.092936802973977%;">
                                    전화번호
                                </th>
                                <th data-sortable="true" style="width: 27%''">
                                    홈페이지 주소
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="pageDataList.length > 0">
                            <tr v-for="data in pageDataList" :key="data.lbrry_seq_no">
                                <td>{{ data.lbrry_name }}</td>
                                <td>{{ data.code_value }}</td>
                                <td>{{ data.adres }}</td>
                                <td>{{ data.tel_no }}</td>
                                <td><a href="javascript:void(0);" @click="mapCtrl.openLink(data.FAC_URL)" class="datatable-link">{{ data.hmpg_url }}</a></td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" class="text-center">데이터가 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="datatable-bottom">
                    <div class="datatable-info"> {{ (itemsPerPage * currentPage) + ' / ' + optionDataList.length }} 개</div>
                    <nav class="datatable-pagination" v-if="pageDataList.length > 0">
                        <ul class="datatable-pagination-list" >
                            <li 
                                :class="'datatable-pagination-list-item datatable-hidden datatable-' + (currentPage == 1 ? 'disabled' : '' )">
                                <a 
                                    data-page="1" 
                                    class="datatable-pagination-list-item-link" 
                                    @click.prevent="clickPage(1)">‹
                                </a>
                            </li>

                            <li :class="'datatable-pagination-list-item ' + (currentPage == page ? 'active' : '')" v-for="page in pageNumber" :key="page">
                                <a data-page="{{ page }}" class="datatable-pagination-list-item-link" @click.prevent="clickPage(page)">{{ page }}</a>
                            </li>

                            <!-- <li class="datatable-pagination-list-item"><a data-page="2" class="datatable-pagination-list-item-link">2</a></li>
                            <li class="datatable-pagination-list-item"><a data-page="3" class="datatable-pagination-list-item-link">3</a></li>
                            <li class="datatable-pagination-list-item"><a data-page="4" class="datatable-pagination-list-item-link">4</a></li>
                            <li class="datatable-pagination-list-item"><a data-page="5" class="datatable-pagination-list-item-link">5</a></li>
                            <li class="datatable-pagination-list-item"><a data-page="6" class="datatable-pagination-list-item-link">6</a></li> -->
                            
                            <li :class="'datatable-pagination-list-item datatable-hidden datatable-' + (currentPage == pageNumber.length ? 'disabled' : '' )">
                                <a 
                                    data-page="{{ pageNumber.length }}" 
                                    class="datatable-pagination-list-item-link"
                                    @click.prevent="clickPage(pageNumber.length)">›
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </div>  
    </div>
        </div>   
    </div>  
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useMapStore } from '@/stores/useMapStore';
import { useMapCtrl } from '@/utils/NaverMapCtrl'; // 지도 컨트롤러


const facilityStore = useFacilityStore(); // 시설정보 스토어

// const facName = ref('');   // 선택된 시설항목 명
// const facData = ref([]); // 선택된 시설항목 데이터

// lnb선택 항목 + 시설정보 데이터
const facName = computed(() => facilityStore.getFacName);
const facData = computed(() => facilityStore.getFacilities); // getter 또는 상태

// 페이징관련 변수
const currentPage = ref(1);
const itemsPerPage = ref(10);   // datatable-selector에서 값 바인딩

// 리스트 갯수 설정
const viewCount = ref([
    { value: 10, selected: true },
    { value: 25 },
    { value: 50 },
])

// 페이지 번호 설정
const pageNumber = computed(() => {
    const pageCount = Math.ceil(optionDataList.value.length / itemsPerPage.value);
    // pageCount크기만큼의 배열을 만들고, 1(i+1)부터 pageCount까지의 숫자를 넣어준다.**
    return Array.from({ length: pageCount }, (_, i) => i + 1);
});

function clickPage(page) {
    currentPage.value = page;
    console.log('clickPage', page);
}

// 리스트 표출 항목명 조합 후 리턴
const makeFacName = computed(() =>
  facName.value ? facName.value : '선택된 항목이 없습니다.'
);

const facDataList = computed(() =>
  facName.value && facData.value[facName.value] ? facData.value[facName.value] : []
);

// 리스트 검색 + 정렬 옵션(구현중...)
const optionDataList = computed(() => {
    return facDataList.value;
});

const pageDataList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return optionDataList.value.slice(start, end);
});

// 값 변화 감지용*
watch(facName, (newVal) => {
    console.log('DataTable component watch :: facName', newVal);
});

watch(facData, (newVal) => {
    console.log('DataTable component watch :: facName', newVal);
});

</script>

<style>

</style>