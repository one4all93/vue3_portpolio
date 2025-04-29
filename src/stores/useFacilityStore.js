// src/stores/useFacilityStore.js
import { defineStore } from 'pinia';

export const useFacilityStore = defineStore('facility', {
  state: () => ({
    facilities: [],
    facName: '',
  }),
  actions: {
    setFacilities(data) {
      this.facilities = data;
    },
    selectFacName(facName) {
      //console.log('Selected facName:', facName);
      this.facName = facName;
    },
    getFacilities() {
      return this.facilities;
    },
    getFacName() {
      return this.facName;
    }
  },
});
