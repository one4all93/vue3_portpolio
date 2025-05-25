import { defineStore } from 'pinia';

export const useApiInputStore = defineStore('apiInputStore', {
  state: () => ({
    isPopupOpen : false,
  }),
  actions: {
    setPopupOpen(isOpen) {
        //console.log('setPopupOpen', isOpen);
        this.isPopupOpen = isOpen;
    },
  },
  getters: {
    getPopupOpen: (state) => state.isPopupOpen,
  },
});
