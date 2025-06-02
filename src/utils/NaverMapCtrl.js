// NaverMapCtrl.js
import { ref , watch , computed } from 'vue';
import { useMapStore } from '@/stores/useMapStore';
import { useFacilityStore } from '@/stores/useFacilityStore';

export function useMapCtrl() {
  const facilityStore = useFacilityStore(); // 시설정보 스토어

  // const selectedFacName = computed(() => facilityStore.getFacName); // 선택된 시설항목명
  // const columnMap = computed(()=> facilityStore.getColumnMap);  // 데이터별 컬럼명 매핑

  // const dataColumn = computed(() => {
  //   return columnMap.value[selectedFacName.value] || null;
  // });

  const dataColumn = computed(()=> facilityStore.dataColumn); // 데이터별 컬럼명 매핑

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

  //console.log('htmlMarker1',htmlMarker1)

  const markers = ref([]);

  watch(
    () => mapStore.naverMap,
    (mapInstance) => {
      if (mapInstance) {
        // mapInstance로 마커 그리기 등 실행
        //console.log('지도 준비됨:', mapInstance);
        map.value = mapInstance;
        //initClustering();
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
    //console.log('initClustering :: markers', markers.value.length);

    if (markerCluster) {
      markerCluster.setMap(null); // 클러스터 제거
      markerCluster = null; // 클러스터 인스턴스 초기화
    }

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

    const marker = new naver.maps.Marker({
      map: map.value,
      position,
      title,  
      icon: {
        url: '/marker' + dataColumn.value['marker'].val + '.png', // 마커 이미지 URL
        scaledSize: new naver.maps.Size(24, 35), // 마커 이미지 크기
      },
    });

    marker.data = data; // 마커에 데이터 추가

    const content = [
      '<div class="custom-popup">',
      '  <div class="popup-header">',
      '    <strong class="popup-title">[',data[dataColumn.value['guCode'].val],'] ', data[dataColumn.value['facName'].val] ,'</strong>',
      '    <button class="popup-close-btn" title="닫기">&times;</button>',
      '  </div>',
      '  <div class="popup-content">',
      '    <div class="popup-row"><span class="label">',dataColumn.value['adress'].colName,'<br />','</span><span class="value">',data[dataColumn.value['adress'].val],'</span></div>',
      '    <div class="popup-row"><span class="label">',dataColumn.value['tel'].colName ,'</span><span class="value">',data[dataColumn.value['tel'].val],'</span></div>',
      '    <div class="popup-row"><span class="label">',dataColumn.value['hompage'].colName,' </span><span class="value">',data[dataColumn.value['hompage'].val],'</span></div>',
      '  </div>',
      '</div>'
    ].join('');

    const infoWindow = new naver.maps.InfoWindow({
      content: content,
      // maxWidth: 300,
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      anchorSize: new naver.maps.Size(30, 30),
      anchorSkew: true
    });

    markers.value.push(marker);
    
    // 마커 클릭 이벤트
    naver.maps.Event.addListener(marker, 'click', () => {
      //alert('"' + marker.title + '" 마커가 클릭되었습니다!');
      //console.log('marker click', marker.title , dataColumn.value['marker'].val + '_selected.png');
      marker.setIcon({
        url: '/marker' + dataColumn.value['marker'].val + '_selected.png', // 클릭 시 마커 이미지 URL
        scaledSize: new naver.maps.Size(34, 45), // 클릭 시 마커 이미지 크기
      });

      // 이전에 클릭된 마커의 아이콘을 원래대로 되돌리기
      if (window.lastClickedMarker && window.lastClickedMarker !== marker) {
        window.lastClickedMarker.setIcon({
          url: '/marker' + dataColumn.value['marker'].val + '.png', // 마커 이미지 URL
          scaledSize: new naver.maps.Size(24, 35), // 마커 이미지 크기
        });
      }

      //console.log('marker click', marker);

      // 클릭된 마커를 현재 클릭된 마커로 저장
      facilityStore.setSelectMarker(marker); // 선택된 마커 저장
      window.lastClickedMarker = marker; // 현재 클릭된 마커 저장

      infoWindow.open(map.value, marker);
      window.currentInfoWindow = infoWindow;

      // 닫기 버튼 클릭 이벤트
      const closeButton = document.querySelector('.popup-close-btn');
      if (closeButton && !closeButton._listenerAdded) {
        closeButton.addEventListener('click', () => {
          if (window.lastClickedMarker) {
            window.lastClickedMarker.setIcon({
              url: '/marker' + dataColumn.value['marker'].val + '.png',
              scaledSize: new naver.maps.Size(24, 35),
            });
            window.lastClickedMarker = null;
          }
          infoWindow.close();
          window.currentInfoWindow = null;
        });
        closeButton._listenerAdded = true;
      }
    });    

    // 외부에서 닫기 이벤트를 처리하기 위해
    if (!window._closeEventRegistered) {
      window.addEventListener('close-marker-popup', () => {
        if (window.currentInfoWindow) {
          window.currentInfoWindow.close();
          window.currentInfoWindow = null;
        }
        //console.log(Object.keys(dataColumn.value).length)
        if (window.lastClickedMarker && Object.keys(dataColumn.value).length > 0) {
          window.lastClickedMarker.setIcon({
            url: '/marker' + dataColumn.value['marker'].val + '.png',
            scaledSize: new naver.maps.Size(24, 35),
          });
          window.lastClickedMarker = null;
        }
      });
      window._closeEventRegistered = true;
    }
  }

  // function updateMarkers(searchData) {
  //   //clearMarkers(); // 기존 마커 제거
  
  //   // 새로운 마커 생성
  //   searchData.forEach((data) => {
  //     const position = new naver.maps.LatLng(data.latitude, data.longitude);
  //     addMarker(position, data.lbrry_name, data);
  //   });
  
  //   // 클러스터링 갱신
  //   if (markerCluster) {
  //     markerCluster.clear(); // 클러스터 안의 마커 초기화
  //     markerCluster.setMarkers(markers.value); // 새 마커로 갱신
  //   } else {
  //     initClustering(); // 처음 한 번만 생성되도록
  //   }
  // }

  function updateMarkers(searchData) {
    clearMarkers();
    searchData.forEach(data => {
      const position = new naver.maps.LatLng(data.xcnts, data.ydnts);
      addMarker(position, data.lbrry_name, data);
    });
    initClustering();
  }
  

  function moveCenter(position) {
    if (map.value) {
      map.value.setCenter(position);
    }
  }

  return {
    map,
    markers,
    initMap,
    initClustering,
    clearMarkers,
    addMarker,
    updateMarkers,
    moveCenter
  };
}
