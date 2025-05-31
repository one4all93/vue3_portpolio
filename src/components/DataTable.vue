<template>
    <!-- <div class="row">
        <div class="col"> -->
            <div class="card h-50"> 
                <div class="card ">
                <!-- <div class="card-header">
                    <svg class="svg-inline--fa fa-table me-1" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M64 256V160H224v96H64zm0 64H224v96H64V320zm224 96V320H448v96H288zM448 256H288V160H448v96zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"></path></svg>
                    {{ makeFacName('list') }}
                </div> -->
                <div class="card-body" style="width: 100%; height: 500px; overflow: auto;">
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
                    <input class="datatable-input" v-model="searchKeyword" placeholder="검색어를 입력해주세요.." type="search" title="Search within table" aria-controls="datatablesSimple">
                </div>
                </div>
                <div class="datatable-container" style="overflow-y: auto;">
                    <table id="datatablesSimple" class="datatable-table">
                        <thead>
                            <tr>
                                <th :class="sortMap[column] == 'asc' ? 'datatable-ascending' : (sortMap[column] == 'desc' ? 'datatable-descending' : '')" 
                                    v-for="column in Object.keys(dataColumn).filter(column=> dataColumn[column].show == true)" :key="column"
                                    >
                                    <a href="javascript.void(0);" 
                                       :class="dataColumn[column].sort ? 'datatable-sorter' : ''"
                                       :style="(!dataColumn[column].sort ? 'pointer-events: none;' : '') "
                                       @click.prevent="dataColumn[column].sort && clickSort(column)">{{ dataColumn[column].colName }}</a>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="pageDataList.length > 0">
                            <tr :class="data[dataColumn['key'].val] == selectedListData[dataColumn['key'].val] ? 'clicked' : '' " 
                                @click.prevent="clickList(data)" 
                                v-for="data in pageDataList" :key="data[dataColumn['key'].val]">
                                <td>{{ data[dataColumn['facName'].val] }}</td>
                                <td>{{ data[dataColumn['guCode'].val] }}</td>
                                <td>{{ data[dataColumn['adress'].val] }}</td>
                                <td>{{ data[dataColumn['tel'].val] }}</td>
                                <td>
                                    <a href="javascript:void(0);" 
                                       @click="mapCtrl.openLink(data[dataColumn['hompage'].val])" 
                                        >{{ data[dataColumn['hompage'].val] }}
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="5" class="text-center">데이터가 없습니다.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="datatable-bottom" v-if="pageDataList.length > 0">
                    <div class="datatable-info"> {{ (itemsPerPage * currentPage) + ' / ' + optionDataList.length }} 개</div>
                    <nav class="datatable-pagination" style="align-content: center;">
                        
                        <ul class="datatable-pagination-list">
                            <li :class="'datatable-pagination-list-item ' + (currentPage === 1 ? 'disabled' : '')">
                                <a class="datatable-pagination-list-item-link" @click.prevent="currentPage > 1 && clickPage(1)">«</a>
                            </li>

                            <li :class="'datatable-pagination-list-item ' + (currentPage === 1 ? 'disabled' : '')">
                                <a class="datatable-pagination-list-item-link" @click.prevent="currentPage > 1 && clickPage(currentPage - 1)">‹</a>
                            </li>

                            <li
                                v-for="(page, index) in pageNumber"
                                :key="index"
                                :class="'datatable-pagination-list-item ' + (currentPage === page ? 'active' : '') + (page === '...' ? ' disabled' : '')"
                            >
                                <a
                                    class="datatable-pagination-list-item-link"
                                    href="#"
                                    @click.prevent="typeof page === 'number' && clickPage(page)"
                                >{{ page }}</a>
                            </li>

                            <li :class="'datatable-pagination-list-item ' + (currentPage === totalPages ? 'disabled' : '')">
                                <a class="datatable-pagination-list-item-link" @click.prevent="currentPage < totalPages && clickPage(currentPage + 1)">›</a>
                            </li>

                            <li :class="'datatable-pagination-list-item ' + (currentPage === totalPages ? 'disabled' : '')">
                                <a class="datatable-pagination-list-item-link" @click.prevent="currentPage < totalPages && clickPage(totalPages)">»</a>
                            </li>
                        </ul>

                    </nav>
                </div>
            </div>
        </div>
    </div>  
    </div>
        <!-- </div>   
    </div>   -->
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useMapStore } from '@/stores/useMapStore';
import { useMapCtrl } from '@/utils/NaverMapCtrl'; // 지도 컨트롤러

import debounce from 'lodash/debounce';


const facilityStore = useFacilityStore(); // 시설정보 스토어

// const facName = ref('');   // 선택된 시설항목 명
// const facData = ref([]); // 선택된 시설항목 데이터

// lnb선택 항목 + 시설정보 데이터
const facName = computed(() => facilityStore.getFacName);
const facData = computed(() => facilityStore.getFacilities); // getter 또는 상태
const dataColumn = computed(()=> facilityStore.dataColumn); // 데이터별 컬럼명 매핑

// 데이터리스트 스타일 맵(너비) :: 사용안함 (추후 삭제 예정)
// const tableStyleMap = {
//     0 : 'width: 20%',
//     1 : 'width: 14%;',
//     2 : 'width: 30%;',
//     3 : 'width: 15%;',
//     4 : 'width: 15%;',
// }

// 검색 관련
const searchKeyword = ref(''); // 검색어 입력값
const search = ref(''); // 최종 검색어

// 선택한 데이터
const selectedListData = computed(()=> facilityStore.getSelectListData) // 클릭한 데이터의 lbrry_seq_no
const makeFacName = computed(()=> facilityStore.makeFacName);
const selectedGu = computed(() => facilityStore.getSelectedGu); // 선택된 구코드


// 정렬 관련
// const sortMap = ref([
//     { sort : 'normal' }, // 기본정렬
//     { sort : 'asc' }, // 오름차순
//     { sort : 'desc' } // 내림차순
// ]); 

const sortMap = ref({
    facName : 'normal',
    guCode : 'normal',
});

const sortIdx = ref(0); // 정렬 인덱스(초기값 :: sortMap[0] => normal)

// 페이징관련 변수
const currentPage = ref(1);
const itemsPerPage = ref(10);   // datatable-selector에서 값 바인딩

const totalPages = computed(() => {
    return Math.ceil(optionDataList.value.length / itemsPerPage.value);
});

// 리스트 갯수 설정
const viewCount = ref([
    { value: 10, selected: true },
    { value: 25 },
    { value: 50 },
])

// 페이지 번호 설정 (페이지 너무 많아서 간소화하게 수정)
const pageNumber = computed(() => {
    // 총 페이지 수 계산 (optionDataList의 길이(데이터 전체 갯수) / itemsPerPage 페이지당 표출 갯수)
    const pageCount = Math.ceil(optionDataList.value.length / itemsPerPage.value);
    // 페이지 갯수 (5개만 보이게)
    const maxPages = 5;
    // 현재 선택페이지
    const current = currentPage.value;
    // 페이지 번호 배열
    let pages = [];

    // 페이지가 maxPages 이하인 경우, 모든 페이지 다 보여주기 + return 
    if (pageCount <= maxPages) {
        // pageCount값 만큼의 배열을 만들고, 그안에 value : 빈값(_) 과 index : i(0부터 시작) 값을 넣어줌
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    //console.log('페이지 여러개 세팅')

    // 현재 페이지를 기준으로 
        // 시작 페이지
        let startPage = Math.max(1, current - Math.floor(maxPages / 2));
        // 끝 페이지
        let endPage = startPage + maxPages - 1;

    // 마지막페이지가 총페이지보다 크면 
    if (endPage > pageCount) {
        // 끝 페이지를 총 페이지로 설정(존재하지 않는 페이지를 바라보면 안되기떄문)
        endPage = pageCount;
        startPage = endPage - maxPages + 1;
    }

    // 시작 페이지가 1보다 크면 "..." 추가
    if (startPage > 1) pages.push('...');
    // 기존 페이지에 시작 페이지부터 끝 페이지까지의 페이지를 합쳐줌(concat)
    pages = pages.concat(Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
    // 끝 페이지가 총 페이지보다 작으면 "..." 추가
    if (endPage < pageCount) pages.push('...');

    return pages;
});


function clickPage(page) {
    if (page === '...') {
        return; // "..."은 클릭하지 않도록 처리
    }
    currentPage.value = page;
    //console.log('clickPage', page);
}

// 리스트 표출 항목명 조합 후 리턴
// const makeFacName = computed(() =>
//   facName.value ? facName.value : '선택된 항목이 없습니다.'
// );

const facDataList = computed(() => 
  facName.value && facData.value[facName.value] ? facData.value[facName.value] : []
);

// 리스트 검색 + 정렬 옵션(구현중...)
const optionDataList = computed(() => {
    let dataList = [...facDataList.value]; // 정렬관련 무한루프 이슈로 얕은복사로 초기값 지정
    currentPage.value = 1; // 검색시 페이지 초기화

    // 검색어가 있을 경우 ([기능보완필요] :: 검색어가 모두 입력된후 검색되게 기능 보완필요)
    if (search.value) {
        //console.log('search.value', search.value);
        // 검색어 :: 도서관이름 / 주소 / 전화번호 / 홈페이지주소 / 구코드명
        dataList = dataList.filter(data => {
            return (data[dataColumn.value['facName'].val] ?? '').toLowerCase().includes(search.value) || 
                    (data[dataColumn.value['adress'].val] ?? '').toLowerCase().includes(search.value) ||
                    (data[dataColumn.value['tel'].val] ?? '').toLowerCase().includes(search.value) ||
                    (data[dataColumn.value['hompage'].val] ?? '').toLowerCase().includes(search.value) ||
                    (data[dataColumn.value['guCode'].val] ?? '').toLowerCase().includes(search.value);
        })
    }

    //console.log('optionDataList :: sortMap', sortMap.value);

    // 정렬
    if (sortMap.value.facName === 'asc') {
        dataList = dataList.sort((a, b) => a[dataColumn.value['facName'].val].localeCompare(b[dataColumn.value['facName'].val]));
    } else if (sortMap.value.facName === 'desc') {
        dataList = dataList.sort((a, b) => b[dataColumn.value['facName'].val].localeCompare(a[dataColumn.value['facName'].val]));
    }

    if (sortMap.value.guCode === 'asc') {
        dataList.sort((a, b) => a[dataColumn.value['guCode'].val].localeCompare(b[dataColumn.value['guCode'].val]));
    } else if (sortMap.value.guCode === 'desc') {
        dataList.sort((a, b) => b[dataColumn.value['guCode'].val].localeCompare(a[dataColumn.value['guCode'].val]));
    }

    //console.log('filterDataList :: ', dataList);
    useFacilityStore().setSearchData(dataList); // 필터링된 데이터 저장
    return dataList;
});

const pageDataList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return optionDataList.value.slice(start, end);
});

// 정렬 클릭
function clickSort(sortName) {
    //console.log('clickSort', sortName , sortMap.value[sortName]);
    // 각 항목별 정렬 ( normal -> asc -> desc 반복)
    sortMap.value[sortName] 
        = sortMap.value[sortName] === 'normal' ? 'asc' : (sortMap.value[sortName] === 'asc' ? 'desc' : 'normal');
    //sortIdx.value = (sortIdx.value + 1) % sortMap.value.length; // 0, 1, 2 순환
    //console.log('sortMap', sortMap.value);
}

// 리스트 데이터 클릭
function clickList(data) {
    //console.log('clickList', data);
    // 시설정보 스토어에 데이터 넘겨주기
    facilityStore.setSelectListData(data);
}

watch(() => facilityStore.getSelectListData, (newVal) => {
    //console.log('DataTable.vue :: watch :: selectedListData', newVal);
    if (Object.keys(newVal).length > 0) {
        const selectedData = optionDataList.value.find(data => data[dataColumn.value['key'].val] === newVal[dataColumn.value['key'].val]);
        if (selectedData) {
            // 클릭한 마커의 데이터로 리스트 선택
            facilityStore.setSelectListData(selectedData);
        }
    }
});

watch(selectedGu , (newVal)=>{
    searchKeyword.value = newVal; // 구코드 검색어로 설정
})


// 클릭한 마커 정보
watch(() => facilityStore.getSelectMarker, (newVal) => {
    if (Object.keys(newVal).length > 0) {
        //const selectedData = optionDataList.value.find(data => data[dataColumn.value['key'].val] === newVal.data[dataColumn.value['key'].val]);
        //const dataIdx = optionDataList.value.indexOf(data => data[dataColumn.value['key'].val] == newVal.data[dataColumn.value['key'].val]);
        const dataIdx = optionDataList.value.findIndex(data=>{
            //console.log('dataIdx', data[dataColumn.value['key'].val] , newVal.data[dataColumn.value['key'].val]);

            return data[dataColumn.value['key'].val] == newVal.data[dataColumn.value['key'].val];
        });

        //console.log('watch :: selectedData', selectedData);
        //console.log('watch :: dataIdx', dataIdx);
        //console.log('watch :: selectedData', optionDataList.value , selectedData[dataColumn.value['key'].val]);
        // if (selectedData) {
        //     // 클릭한 마커의 데이터로 리스트 선택
        //     facilityStore.setSelectListData(selectedData);
        // }

        facilityStore.setSelectListData(newVal.data); // 클릭한 마커의 데이터로 리스트 선택

        // 클릭한 마커와 일치하는 데이터의 순서 확인
        // const dataIdx = optionDataList.value.indexOf(data => data[dataColumn.value['key'].val] == selectedData[dataColumn.value['key'].val]);

        //console.log('watch :: dataIdx', dataIdx);

        // 페이지 번호 계산
        const pageNumber = Math.floor(dataIdx / itemsPerPage.value) + 1; 
        clickPage(pageNumber); // 페이지 이동
    }
});



watch(itemsPerPage, (newVal) => {
    //console.log('DataTable component watch :: itemsPerPage', newVal);
    // 리스트 갯수 변경시 페이지 초기화
    currentPage.value = 1;
});

watch(
  searchKeyword, debounce((newVal) => {
    search.value = newVal;
  }, 300)
)

</script>

<style scoped>

.datatable-container {
  width: 100%;
}

.datatable-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

/* thead를 고정하고 */
.datatable-table thead {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/* tbody에만 스크롤을 넣기 */
.datatable-table tbody {
  display: block;
  max-height: 300px; /* 원하는 높이 지정 */
  overflow-y: auto;
  width: 100%;
}

/* tbody 내부의 tr들도 block으로 맞추기 */
.datatable-table tbody tr {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.h-50 {
    height: 47% !important;
}

.datatable-link {
  color: black;
  text-decoration: none;
}

/* 데이터리스트 로우 클릭시 스타일 변경 */
.clicked {
  background-color: #f0f0f0;
  color: #1976d2 !important; 
  font-weight: bold;
  border: 2px solid #1976d2;
  border-radius: 4px; /* 살짝 둥글게 */
  padding: 2px 4px; /* 테두리 안쪽 여백 */
}

</style>