// src/stores/useFacilityStore.js
import { set } from 'lodash';
import { defineStore } from 'pinia';

export const useFacilityStore = defineStore('facility', {
  state: () => ({
    facilities: [],
    facName: '',
    searchData : [],
    selectListData : [],
    selectMarker : [],
    selectedGu : null,

    // 적재된 api 서비스 목록
    serviceList : [
      'ListPublicReservationCulture',
      'SearchParkInfoService',
      'SeoulPublicLibraryInfo'
    ],

    // 서비스 데이터항목명
    menuNameMap : {
      'SeoulPublicLibraryInfo': '서울공공도서관',
      'SearchParkInfoService': '서울공공체육시설',
      'ListPublicReservationCulture': '서울시공원',
    },

    // 데이터별 컬럼명 매핑
    columnMap : {
      'ListPublicReservationCulture':{
        '시설명': {colName : '시설명' },
        '주소': {colName : '시설명'},
        '전화번호': {colName : '시설명'},
        '운영시간': {colName : '시설명'},
        '휴무일': {colName : '시설명'},
        '위도': {colName : '시설명'},
        '경도': {colName : '시설명'}
      },
      'SearchParkInfoService':{
        '시설명': 'PARK_NAME',
        '주소': 'ADDRESS',
        '전화번호': 'PHONE_NUMBER',
        '운영시간': 'OPERATION_TIME',
        '휴무일': 'HOLIDAY',
        '위도': 'LATITUDE',
        '경도': 'LONGITUDE'
      },
      // 서울시 공공도서관 정보
      'SeoulPublicLibraryInfo':{
        // 'column4': {colName : '시설명' , val : 'column4'},
        // 'column2': {colName : 'x좌표' , val : 'column2'},
        // 'column3': {colName : 'y좌표' , val : 'column3'},
        // 'column5': {colName : '소속구' , val : 'column5'},
        // 'column6': {colName : '시설주소' , val : 'column6'},
        // 'column7': {colName : '전화번호' , val : 'column7'},
        // 'column8': {colName : '홈페이지 주소' , val : 'column8'}
        'facName': {colName : '시설명' , val : 'column4' , show : true , sort : true},
        'guCode': {colName : '소속구' , val : 'column5' , show : true , sort : true},
        'xcnts': {colName : 'x좌표' , val : 'column2' , show : false},
        'ydnts': {colName : 'y좌표' , val : 'column3' , show : false},
        'adress': {colName : '시설주소' , val : 'column6' , show : true},
        'tel': {colName : '전화번호' , val : 'column7' , show : true},
        'hompage': {colName : '홈페이지 주소' , val : 'column8' , show : true}
      }
    },
  }),
  actions: {
    setFacilities(data) {
      this.facilities = data;
    },
    selectFacName(facName) {
      //console.log('Selected facName:', facName);
      this.facName = facName;
    },
    setSearchData(data) {
      this.searchData = data;
    },
    setSelectListData(data) {
      this.selectListData = data;
    },
    setSelectMarker(data) {
      this.selectMarker = data;
    },
    setSelectedGu(data) {
      this.selectedGu = data;
    },
    // getFacilities() {
    //   return this.facilities;
    // },
    // getFacName() {
    //   return this.facName;
    // }
  },
  getters: {
    getServiceList: (state) => state.serviceList,
    getColumnMap: (state) => state.columnMap,
    getFacilities: (state) => state.facilities,
    getFacName: (state) => state.facName,
    getSearchData: (state) => state.searchData,
    getSelectListData: (state) => state.selectListData,
    getSelectMarker: (state) => state.selectMarker,
    getSelectedGu: (state) => state.selectedGu,
    
    // 데이터별 컬럼명 매핑
    dataColumn(state) {
      return state.columnMap[this.getFacName] || {};
    },

    // 리스트 표출 항목명 조합 후 리턴 (공통함수로 빼놓음**)
    makeFacName : (state) => (func) =>{
      if(func == 'list'){
        return state.facName ? (state.menuNameMap[state.getFacName] + ' 리스트') : '선택된 항목이 없습니다.'
      }else if(func == 'chart'){
        return state.facName ? (state.menuNameMap[state.getFacName]  + ' 구별 갯수'): '선택된 항목이 없습니다.'
      }
    },
    
  },
});
