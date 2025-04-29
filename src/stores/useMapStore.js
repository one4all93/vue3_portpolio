// src/stores/useMapStore.js
import { defineStore } from 'pinia';

export const useMapStore = defineStore('map', {
  state: () => ({
    naverMap : null,
  }),
  actions: {
    setNaverMap(map) {
      this.naverMap = map;
    },
    getNaverMap() {
      return this.naverMap;
    },
  },
});
