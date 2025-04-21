<template>
  <div id="map" style="width:1400px;height:1000px;"></div>
</template>

<script>
export default {
    name: 'NaverMap',
    data(){
        return{
            map : null,
            lat : 37.3595704,
            lng : 127.105399,
            zoom : 13,
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
    },
    methods: {
        initMap() {
            map = new naver.maps.Map('map', {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
                zoom: 10
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