// NaverMapCtrl.js
import { ref , watch } from 'vue';
import { useMapStore } from '@/stores/useMapStore';

export function useMapCtrl() {
  const mapStore = useMapStore(); // 지도
  const map = ref(null); // 지도 인스턴스
  const markers = ref([]);

  watch(
    () => mapStore.naverMap,
    (mapInstance) => {
      if (mapInstance) {
        // mapInstance로 마커 그리기 등 실행
        console.log('지도 준비됨:', mapInstance);
        map.value = mapInstance;
      }
    },
    { immediate: true }
  );

  function initMap(naverMapInstance) {
    map.value = naverMapInstance;
  }

  function clearMarkers() {
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  }

  function addMarker(position, title) {
    if (!map.value) return;
    // 마커 생성
    console.log('addMarker', position, title , map.value);
    const marker = new naver.maps.Marker({
      map: map.value,
      position,
      title
    });

    // 마커 클릭 이벤트
    naver.maps.Event.addListener(marker, 'click', () => {
      alert('"' + marker.title + '" 마커가 클릭되었습니다!');
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
