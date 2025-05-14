<template>
    <div id="map" style="height: 150%; width: 100%;"></div> 
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMapStore } from '@/stores/useMapStore';
import { useFacilityStore } from '@/stores/useFacilityStore';

import { useMapCtrl } from '@/utils/NaverMapCtrl'; // 지도 컨트롤러

import { emitter } from '@/utils/eventBus';

// 스토어
const mapStore = useMapStore(); // 지도
const facilityStore = useFacilityStore(); // 시설정보

const selectedGu = computed(() => facilityStore.getSelectedGu); // 선택된 구
const selectedGeojson = ref({}) // 선택된 geojson

const mapCtrl = useMapCtrl(); // 지도 컨트롤러

const map = ref(null);
const lat = ref(37.570713);
const lng = ref(126.978190);
const zoom = ref(12);

// GeoJSON 저장용
const geojson = ref(null);

// 지도 옵션 계산
const mapOptions = computed(() => ({
  center: new naver.maps.LatLng(lat.value, lng.value),
  zoom: zoom.value,
  zoomControl: true,
  zoomControlOptions: {
    position: naver.maps.Position.TOP_LEFT,
    style: naver.maps.ZoomControlStyle.SMALL
  },
}));

// GeoJSON 그리기 함수
function drawGeojson(geojsonData) {
  if (!map.value) return;

  map.value.data.addGeoJson(geojsonData);
  map.value.data.setStyle((feature) => {
    let fillColor = '#E3F2FD';
    let strokeColor = '#90CAF9';
    let strokeWeight = 2;

    if (feature.getProperty('isColorful')) {
      fillColor = feature.getProperty('fillColor');
    }

    // if (feature.getProperty('focus')) {
    //     styleOptions.fillOpacity = 0.6;
    //     styleOptions.fillColor = '#0f0';
    //     styleOptions.strokeColor = '#0f0';
    //     styleOptions.strokeWeight = 4;
    //     styleOptions.strokeOpacity = 1;
    // }

    if (feature.getProperty('isSelected')) {
      fillColor = '#FF6384';
      strokeColor = '#c2185b';
      strokeWeight = 3;
    }

    if (feature.getProperty('isHover')) {
      fillColor = '#FFCDD2';
      strokeWeight = 4;
    }

    return {
      fillColor: fillColor,
      fillOpacity: 0.6,
      strokeColor: strokeColor,
      strokeWeight: 2,
      icon: null
    };

  });

  // 클릭이벤트 추가
  map.value.data.addListener('click', (e) => {
    console.log('NaverMap.vue :: drawGeojson :: click', e.feature.property_SGG_NM);
    
    // 선택된 데이터 항목 없을때는 튕기기
    console.log('2312321321321', facilityStore.getSearchData);
    if(facilityStore.getSearchData.length == 0){
      alert('선택된 데이터가 없습니다. 시설항목에서 데이터를 선택해주세요.');
      return;
    }

    // 다른 영역 클릭 했을때
    if(selectedGeojson.value.property_SGG_NM != e.feature.property_SGG_NM){
      
      // 이전에 클릭했던 영역 초기화
      if (selectedGeojson.value.setProperty) {
        selectedGeojson.value.setProperty('isSelected', false);
      }

      // 선택한 영역 활성화
      selectedGeojson.value = e.feature;
      e.feature.setProperty('isSelected', true); // 클릭한 영역만 색 변경하게 
      facilityStore.setSelectedGu(e.feature.property_SGG_NM); // 클릭한 구코드 저장
      emitter.emit('NaverMap.vue :: selectGu', e.feature.property_SGG_NM); // 이벤트 발생
    }else{
      // 같은 영역 클릭했을때 :: 영역클릭된 값이 있을때 => 해당영역값 해제 필요
      e.feature.setProperty('isSelected', false);
      facilityStore.setSelectedGu(null); // 클릭한 구코드 저장
      emitter.emit('NaverMap.vue :: selectGu', null); // 이벤트 발생
      selectedGeojson.value = {};
    }
  });

  // 해당영역 호버 기능
  map.value.data.addListener('mouseover', (e) => {
    e.feature.setProperty('isHover', true);
  });

  // 마우스오버 끝나면 스타일 원복
  map.value.data.addListener('mouseout', (e) => {
    e.feature.setProperty('isHover', false);
  });

  //console.log('drawGeojson', map.value.data);
}

// 지도 초기화 및 GeoJSON 로딩
onMounted(() => {
  console.log('NaverMap mounted');
  map.value = new naver.maps.Map('map', mapOptions.value);
  console.log('NaverMap mounted map', map.value);
  // 스토어에 지도 저장
  mapStore.setNaverMap(map.value);

  console.log('NaverMap.vue :: mounted :: mapStore.naverMap', mapStore.naverMap);
  //mapCtrl.checkMap();

  fetch('/geojson/seoul.geojson', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    }
  })
    .then(res => res.json())
    .then(data => {
      geojson.value = data;
      drawGeojson(data);
    });
});

// watch(()=> facilityStore.facName, (newVal) => {
//   // 마커 초기화 로직
//   mapCtrl.clearMarkers();
//   if (newVal) {
//     console.log('NaverMap.uve :: watch :: 시설명1', facilityStore.facilities[newVal].length);
//     if(facilityStore.facilities[newVal].length > 0){
//       console.log('NaverMap.vue :: watch :: 시설명2', facilityStore.facilities[newVal]);
//       facilityStore.facilities[newVal].forEach(facility=>{
//         //console.log('NaverMap.vue :: watch :: 시설명3', facility);

//         const markerPosition = new naver.maps.LatLng(facility.xcnts, facility.ydnts); // 마커 위치 좌표

//         /**
//          * 마커생성
//          * @param {object} markerPosition - 마커 위치 좌표
//          * @param {string} title - 마커 제목
//          * @param {object} data - 마커 데이터
//          */
//         mapCtrl.addMarker(markerPosition,facility.lbrry_name,facility);
//       })
//       mapCtrl.initClustering();
//       //mapCtrl.addMarker(facilityStore.facilities[newVal]);
//     }else{
//       alert('선택하신 항목의 데이터가 없습니다.');
//     }
//   }
// });
watch(selectedGu , (newVal)=>{
  console.log('NaverMap.vue :: watch :: selectedGu', newVal);
  // 노원구 / 도봉구 / 성북구(영역없음 :: 원천에도 없음) =>  클릭시 스타일 변화 없음 :: 구코드가 다른듯
  map.value.data.forEach((feature) => {   
    const guCode = feature.property_SGG_NM; // 구코드

    if(guCode.includes(newVal)){  // 구코드 이름이 달라서 includes로 변경(직접비교 X)
      console.log('NaverMap.vue :: watch :: guCode', guCode , newVal);
      selectedGeojson.value = feature; // 선택된 geojson 저장
      feature.setProperty('isSelected', true); // 색상도 같이 변경하려면
      feature.setProperty('color', '#FF6384'); // 원하는 색상 지정
    }else{
      feature.setProperty('isSelected', false); // 색상도 같이 변경하려면
      feature.setProperty('color', '#E3F2FD'); // 원하는 색상 지정
    }
    
  });
})

// 필터 된 데이터 표출(검색) :: 지도이동시 모든 마커 표출됨
watch(()=> facilityStore.getSearchData, (newVal) => {
  console.log('NaverMap.vue :: watch :: getSearchData', newVal.length);
  // 마커 초기화 로직
  mapCtrl.clearMarkers();
  if (newVal) {
    //console.log('NaverMap.uve :: watch :: 시설명1', facilityStore.facilities[newVal].length);
    if(newVal.length > 0){
      //console.log('NaverMap.vue :: watch :: 시설명2', newVal);
      newVal.forEach(facility=>{
        //console.log('NaverMap.vue :: watch :: 시설명3', facility);

        const markerPosition = new naver.maps.LatLng(facility.xcnts, facility.ydnts); // 마커 위치 좌표

        /**
         * 마커생성
         * @param {object} markerPosition - 마커 위치 좌표
         * @param {string} title - 마커 제목
         * @param {object} data - 마커 데이터
         */
        mapCtrl.addMarker(markerPosition,facility.lbrry_name,facility);
      })
      mapCtrl.initClustering();
      //mapCtrl.addMarker(facilityStore.facilities[newVal]);
    }else{
      //alert('선택하신 항목의 데이터가 없습니다.');
    }
  }
});

watch(()=> facilityStore.getSelectListData , newVal => {
  const markers = mapCtrl.markers.value; // 마커맵
  //const selectedMarker = [];
  //console.log('NaverMap.vue :: watch :: getSelectListData', newVal , markers);
  if(Object.keys(newVal).length > 0){
    // 트리거안에서 마커맵 필터 체이닝구조로 변경**(가독성)
    naver.maps.Event.trigger(
      markers.filter(marker => marker.data.lbrry_seq_no === newVal.lbrry_seq_no)[0],
      'click'
    );
    // selectedMarker = markers.filter(marker => { 
    //   //console.log('NaverMap.vue :: watch :: selectedMarker', marker.data, newVal);
    //   return marker.data.lbrry_seq_no ==  newVal.lbrry_seq_no;
    // });
    // console.log('NaverMap.vue :: watch :: selectedMarker', selectedMarker[0]);
    // naver.maps.Event.trigger(selectedMarker[0], 'click');
  }
})

</script>

<!-- <script>
export default {
    name: 'NaverMap',
    data(){
        return{
            map : null,
            lat : 37.570713,
            lng : 126.978190,
            zoom : 12,
            geojson : null,
        }
    },
    computed: {
        mapOptions(){
            return {
                center: new naver.maps.LatLng(this.lat, this.lng),
                zoom: this.zoom
            }
        }
    },
    mounted(){
        console.log('NaverMap mounted');

        this.map = new naver.maps.Map('map', this.mapOptions);
        console.log('NaverMap mounted map', this.map);

          // 지도 생성 완료 후 GeoJSON 로딩
        fetch('/geojson/seoul.geojson',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            }
        })
            .then(res => res.json())        // geojson 파일 읽은 후 => json 변환
            .then(data => {                 // json 변환된 데이터 를 data라는 이름으로 받음
                //console.log('geojson data', data);
                this.drawGeojson(data);
        });
    },
    methods: {
        // 지도 초기화 함수
        initMap() {
            map = new naver.maps.Map('map', {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 7
            });
        },
        // geojson 그려주는 함수
        drawGeojson(geojson){
            console.log('drawGeojson', geojson);
            // geojson 지도에 추가
            this.map.data.addGeoJson(geojson);
            // geojson 스타일 설정
            this.map.data.setStyle(function(feature) {
                var color = 'red';

                if (feature.getProperty('isColorful')) {
                    color = feature.getProperty('color');
                }

                return {
                    fillColor: color,
                    strokeColor: color,
                    strokeWeight: 2,
                    icon: null
                };
            });


        }
    }
}
</script> -->

<style>

</style>