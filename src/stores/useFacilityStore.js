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
  },
});
