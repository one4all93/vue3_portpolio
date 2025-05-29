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

    // 적재된 api 서비스 데이터항목명
    menuNameMap : {
      'SeoulPublicLibraryInfo': '서울공공도서관',
      'SearchParkInfoService': '서울시주요공원',
      'ListPublicReservationCulture': '서울시공원',
    },

    // 데이터별 컬럼명 매핑(서비스명으로 api조회 :: 여기에 서비스명과 컬럼정보 담아야함)
    columnMap : {
      // 'ListPublicReservationCulture':{
      //   'key': {colName : '키' , val : 'column1' , show : false},
      //   'marker': {colName : '마커' , val : '/library.png' , show : false},
      //   'facName': {colName : '시설명' , val : 'column4' , show : true , sort : true},
      //   'guCode': {colName : '소속구' , val : 'column9' , show : true , sort : true},
      //   'xcnts': {colName : 'x좌표' , val : 'column3' , show : false},
      //   'ydnts': {colName : 'y좌표' , val : 'column2' , show : false},
      //   'adress': {colName : '시설주소' , val : 'column6' , show : true},
      //   'tel': {colName : '접수현황' , val : 'column7' , show : true},
      //   'hompage': {colName : '홈페이지 주소' , val : 'column8' , show : true}
      // },
      'SearchParkInfoService':{
        'key': {colName : '키' , val : 'column1' , show : false},
        'marker': {colName : '마커' , val : '/park' , show : false},
        'facName': {colName : '시설명' , val : 'column4' , show : true , sort : true},
        'guCode': {colName : '소속구' , val : 'column5' , show : true , sort : true},
        'xcnts': {colName : 'x좌표' , val : 'column3' , show : false},
        'ydnts': {colName : 'y좌표' , val : 'column2' , show : false},
        'adress': {colName : '시설주소' , val : 'column6' , show : true},
        'tel': {colName : '전화번호' , val : 'column7' , show : true},
        'hompage': {colName : '홈페이지' , val : 'column8' , show : true}
      },
      // 서울시 공공도서관 정보
      'SeoulPublicLibraryInfo':{
        'key': {colName : '키' , val : 'column1' , show : false},
        'marker': {colName : '마커' , val : '/library' , show : false},
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
    getMenuNameMap: (state) => state.menuNameMap,
    getColumnMap: (state) => state.columnMap,
    getFacilities: (state) => state.facilities,
    getFacName: (state) => state.facName,
    getSearchData: (state) => state.searchData,
    getSelectListData: (state) => state.selectListData,
    getSelectMarker: (state) => state.selectMarker,
    getSelectedGu: (state) => state.selectedGu,

    serviceList(state) {
      return Object.keys(state.columnMap);
    },
    
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
