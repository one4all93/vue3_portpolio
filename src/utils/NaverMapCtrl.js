// NaverMapCtrl.js
import { ref , watch } from 'vue';
import { useMapStore } from '@/stores/useMapStore';

export function useMapCtrl() {
  const mapStore = useMapStore(); // 지도
  const map = ref(null); // 지도 인스턴스
  const markerCluster = null; // 마커 클러스터링 인스턴스
  const markers = ref([]);

  watch(
    () => mapStore.naverMap,
    (mapInstance) => {
      if (mapInstance) {
        // mapInstance로 마커 그리기 등 실행
        console.log('지도 준비됨:', mapInstance);
        map.value = mapInstance;
        initClustering();
      }
    },
    { immediate: true }
  );

  function initMap(naverMapInstance) {
    map.value = naverMapInstance;
  }

  // 마커 클러스터링
  function initClustering() {
    if (!map.value) return;

    markerCluster = new naver.maps.MarkerClustering({
      map: map.value,
      markers: markers.value,
      minClusterSize: 2,
      maxZoom: 14,
      gridSize: 100,
      disableClickZoom: false,
      styles: [
        {
          width: 40,
          height: 40,
          className: 'cluster-style',
        },
      ]
    });
  }

  function clearMarkers() {
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  }

  function addMarker(position, title , data) {
    if (!map.value) return;
    // 마커 생성
    //console.log('addMarker', position, title , map.value);
    const marker = new naver.maps.Marker({
      map: map.value,
      position,
      title,  
      icon: {
        url: '/marker/library.png', // 마커 이미지 URL
        scaledSize: new naver.maps.Size(24, 35), // 마커 이미지 크기
      },
    });

    marker.data = data; // 마커에 데이터 추가

    const content =[
      '<div class="marker-popup">',
      '   <h3 class="title">[',data.code_value,'] ', data.lbrry_name ,'</h3>',
      '   <p class="address"> 주소 : ', data.adres ,'<br />',
      '   <p class="info"> 전화번호 : ', data.tel_no ,'<br />',
      '       <a href="', data.hmpg_url , '" target="_blank">' , data.hmpg_url , '</a>',
      '   </p>',
      '</div>'
    ].join('');

    const infoWindow = new naver.maps.InfoWindow({
      content: content,
      maxWidth: 300,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      anchorSize: new naver.maps.Size(30, 30),
      anchorSkew: true
    });

    markers.value.push(marker);

    if (markerCluster) {
      markerCluster.addMarker(marker);
    }

    // const markerClustering = new naver.maps.MarkerClustering({
    //   minClusterSize: 2,
    //   maxZoom: 14,
    //   map: map.value,
    //   markers: markers.value,
    //   disableClickZoom: false,
    //   gridSize: 100,
    //   styles: [
    //     {
    //       width: 40,
    //       height: 40,
    //       className: 'cluster-style'
    //     }
    //   ]
    // });

    // 마커 클릭 이벤트
    naver.maps.Event.addListener(marker, 'click', () => {
      //alert('"' + marker.title + '" 마커가 클릭되었습니다!');
      //console.log('marker click', marker);
      infoWindow.open(map.value, marker);
    });    
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
