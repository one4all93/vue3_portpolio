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
    getFacilities: (state) => state.facilities,
    getFacName: (state) => state.facName,
    getSearchData: (state) => state.searchData,
    getSelectListData: (state) => state.selectListData,
    getSelectMarker: (state) => state.selectMarker,
    getSelectedGu: (state) => state.selectedGu,

    // 리스트 표출 항목명 조합 후 리턴 (공통함수로 빼놓음**)
    makeFacName : (state) => (func) =>{
      if(func == 'list'){
        return state.facName ? (state.facName + ' 리스트') : '선택된 항목이 없습니다.'
      }else if(func == 'chart'){
        return state.facName ? (state.facName  + ' 구별 갯수'): '선택된 항목이 없습니다.'
      }
    },
    
  },
});
