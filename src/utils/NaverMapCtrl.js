// NaverMapCtrl.js
import { ref } from 'vue';

export function useMapCtrl() {
  const map = ref(null);
  const markers = ref([]);

  function checkMap() {
    if (!map.value) {
      console.error('Map is not initialized');
      return false;
    }
    return true;
  }

  function initMap(naverMapInstance) {
    map.value = naverMapInstance;
  }

  function clearMarkers() {
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  }

  function addMarker(position, title) {
    if (!map.value) return;

    const marker = new naver.maps.Marker({
      map: map.value,
      position,
      title
    });

    markers.value.push(marker);
  }

  function moveCenter(position) {
    if (map.value) {
      map.value.setCenter(position);
    }
  }

  return {
    map,
    initMap,
    clearMarkers,
    addMarker,
    moveCenter
  };
}
