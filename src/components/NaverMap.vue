<template>
  <div id="map" style="width:1400px;height:1000px;"></div>
</template>

<script>
export default {
    name: 'NaverMap',
    data(){
        return{
            map : null,
            lat : 37.569090,
            lng : 126.980000,
            zoom : 12,
            geojson : null,
        }
    },
    created(){
        console.log('NaverMap created');
        //this.initMap();
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
        fetch('/geojson/seoul.geojson')
            .then(res => res.json())        // geojson 파일 읽은 후 => json 변환
            .then(data => {                 // json 변환된 데이터 를 data라는 이름으로 받음
                //console.log('geojson data', data);
                this.drawGeojson(data);
        });
    },
    // watch: {
    //     map: {
    //         handler(newVal, oldVal) {
    //             console.log('map changed', newVal, oldVal);
    //             // 우선 geojson 그려지는지 확인용 테스트
    //             fetch('./geojson/seoul.geojson')
    //             .then(res => res.json())
    //             .then(data => { console.log('geojson data', data);
    //                 this.drawGeoJSON(data);
    //             });
    //         },
    //     }
    // },
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
</script>

<style>
    #map {
    width: 100%;
    height: 500px;
    }
</style>