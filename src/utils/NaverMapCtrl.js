// NaverMapCtrl.js
import { ref , watch } from 'vue';
import { useMapStore } from '@/stores/useMapStore';

export function useMapCtrl() {
  const mapStore = useMapStore(); // 지도
  const map = ref(null); // 지도 인스턴스

  let markerCluster = null; // 마커 클러스터링 인스턴스
  const gridSize = 120; // 클러스터링 그리드 크기

  let htmlMarker1 = {
    content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/img/cluster-marker-1.png);background-size:contain;"><span class="cluster-count"></span></div>',
    size: new naver.maps.Size(40, 40),
    anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker2 = {
        content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/img/cluster-marker-2.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker3 = {
        content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/img/cluster-marker-3.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker4 = {
        content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/img/cluster-marker-4.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20)
    },
    htmlMarker5 = {
        content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/img/cluster-marker-5.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20)
    };      

  console.log('htmlMarker1',htmlMarker1)

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

    markerCluster = new MarkerClustering({
      minClusterSize: 2,
      maxZoom: 12,
      map: map.value,
      markers: markers.value,
      disableClickZoom: false,
      gridSize: gridSize,  
      icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
      indexGenerator: [5, 10, 15, 20, 30],
      stylingFunction: function(clusterMarker, count) {
        const el = clusterMarker.getElement();
        if (el) {
          const countEl = el.querySelector('div:first-child');
          if (countEl) {
            countEl.textContent = count;
          }
        }
      }
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

    // 데이터셋 포맷형식 정리필요(여러데이터 들어와도 바로 사용가능하게) ***
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

    //initClustering();

    //console.log('markerCluster', markerCluster);

    // if (markerCluster) {
    //   markerCluster.addMarkers(marker.value);
    // }
    
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
    initClustering,
    clearMarkers,
    addMarker,
    moveCenter
  };
}
