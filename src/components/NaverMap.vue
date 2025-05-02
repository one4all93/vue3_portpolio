<template>
    <div id="map" style="height: 150%; width: 100%;"></div> 
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useMapStore } from '@/stores/useMapStore';
import { useFacilityStore } from '@/stores/useFacilityStore';

import { useMapCtrl } from '@/utils/NaverMapCtrl'; // 지도 컨트롤러

// 스토어
const mapStore = useMapStore(); // 지도
const facilityStore = useFacilityStore(); // 시설정보

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
    let color = '#E3F2FD';
    let strokeColor = '#90CAF9';
    if (feature.getProperty('isColorful')) {
      color = feature.getProperty('color');
    }

    return {
      fillColor: color,
      fillOpacity: 0.6,
      strokeColor: strokeColor,
      strokeWeight: 2,
      icon: null
    };
  });
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

watch(()=> facilityStore.facName, (newVal) => {
  // 마커 초기화 로직
  mapCtrl.clearMarkers();
  if (newVal) {
    console.log('NaverMap.uve :: watch :: 시설명1', facilityStore.facilities[newVal].length);
    if(facilityStore.facilities[newVal].length > 0){
      console.log('NaverMap.vue :: watch :: 시설명2', facilityStore.facilities[newVal]);
      facilityStore.facilities[newVal].forEach(facility=>{
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
      alert('선택하신 항목의 데이터가 없습니다.');
    }
  }
});
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