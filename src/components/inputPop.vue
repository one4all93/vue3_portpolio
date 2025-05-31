<template>
    <div v-if="isPopupOpen" class="modal-overlay">
      <!-- <div class="modal-content">
        <h2>데이터 항목 추가</h2>
  
        <div class="form-group">
          <label for="apiUrl">API URL</label>
          <input v-model="apiUrl" type="text" id="apiUrl" class="form-control" placeholder="https://api.example.com/data" />
        </div>
  
        <div class="mapping-row" v-for="(item, index) in mappings" :key="index">
          <input v-model="item.name" class="form-input" placeholder="항목명" />
          <input v-model="item.key" class="form-input" placeholder="컬럼명" />
          <input v-model="item.order" type="number" class="form-input small" placeholder="순서" />
          <button @click="removeRow(index)" class="btn-remove">X</button>
        </div>
  
        <button @click="addRow" class="btn-add">+ 항목 추가</button>
  
        <div class="button-group">
          <button @click="saveMapping">저장</button>
          <button @click="closeAddPopup">닫기</button>
        </div>
      </div> -->
        <div class="modal-content">
            <h2>데이터 항목 추가</h2>

            <div class="form-group">
                <label for="apiUrl">API URL</label>
                <input v-model="apiUrl" type="text" id="apiUrl" class="form-control" placeholder="https://api.example.com/data" />
            </div>

            <div class="form-group">
                <label for="type">타입</label>
                <input v-model="type" type="text" id="type" class="form-control" placeholder="json 또는 xml" />
            </div>

            <div class="form-group">
                <label for="apiKey">API 키</label>
                <input v-model="apiKey" type="text" id="apiKey" class="form-control" placeholder="API 키를 입력하세요" />
            </div>

            <div class="form-group">
                <label for="serviceName">서비스 이름</label>
                <input v-model="serviceName" type="text" id="serviceName" class="form-control" placeholder="서비스 이름을 입력하세요" />
            </div>

            <h3>데이터 항목 매핑</h3>
            1번 데이터고유키 / 2번 y좌표 / 3번 x좌표 / 4번 시설명 / 5번 구코드 (5개값은 고정**)
            <div class="mapping-row" v-for="(item, index) in mappings" :key="index">
                <input v-model="item.name" class="form-input" placeholder="항목명*" />
                <input v-model="item.key" class="form-input" placeholder="설명" />
                <input v-model="item.order" type="number" class="form-input small" placeholder="순서" />
                <button @click="removeRow(index)" class="btn-remove">X</button>
            </div>

            <button @click="addRow" class="btn-add">+ 항목 추가</button>

            <div class="button-group">
                <button @click="saveMapping">전송</button>
                <button @click="closeAddPopup">닫기</button>
            </div>
        </div>
    </div>
    <!-- <div id="apiModal" class="modal" v-if="isPopupOpen">
        <div class="modal-content">
        <h2>API 정보 입력</h2>
        <label>API URL: <input type="text" id="apiUrl"></label><br>
        <label>타입: <input type="text" id="type"></label><br>
        <label>API 키: <input type="text" id="apiKey"></label><br>
        <label>서비스 이름: <input type="text" id="serviceName"></label>

        <h3>데이터 항목 매핑</h3>
        <table id="mappingTable">
            <thead>
            <tr>
                <th>항목명</th>
                <th>컬럼명</th>
                <th>컬럼순서</th>
            </tr>
            </thead>
            <tbody>
            <tr><td><input type="text"></td><td><input type="text"></td><td><input type="number"></td></tr>
            <tr><td><input type="text"></td><td><input type="text"></td><td><input type="number"></td></tr>
            <tr><td><input type="text"></td><td><input type="text"></td><td><input type="number"></td></tr>
            <tr><td><input type="text"></td><td><input type="text"></td><td><input type="number"></td></tr>
            </tbody>
        </table>
        <button onclick="addRow()">+ 항목 추가</button>
        <button onclick="submitForm()">전송</button>
        <button onclick="closeModal()">닫기</button>
        </div>
    </div> -->
</template>

<script setup>
import { useApiInputStore } from '@/stores/apiInputStore'
import { ref , computed } from 'vue';
import axios from 'axios';

const apiInputStore = useApiInputStore(); // API 입력 스토어

const isPopupOpen = computed(() => apiInputStore.isPopupOpen); // 팝업 상태

const apiUrl = ref('');
const type = ref('');
const apiKey = ref('');
const serviceName = ref('');

const mappings = ref([
  { name: '', key: '', order: null },
  { name: '', key: '', order: null },
  { name: '', key: '', order: null },
  { name: '', key: '', order: null }
]);

const addRow = () => {
  mappings.value.push({ name: '', key: '', order: null });
};

const removeRow = (index) => {
  if (mappings.value.length > 4) {
    mappings.value.splice(index, 1);
  }
};

let testUrl = 'http://openapi.seoul.go.kr:8088/485753534473656f3533597574644c/xml/SeoulPublicLibraryInfo/1/100/';
let testKey = '485753534473656f3533597574644c';

const saveMapping = async() => {
//   console.log('API URL:', apiUrl.value)
//   console.log('매핑 정보:', mappings.value)
  // 여기서 store에 저장하거나 API로 전송할 수 있음

    const payload = {
        url: apiUrl.value,
        type: type.value,
        apiKey: apiKey.value,
        serviceName: serviceName.value,
        mappings: mappings.value
    };

    // const payload = {
    //     url: 'http://openapi.seoul.go.kr:8088/',
    //     type: 'json',
    //     apiKey: '485753534473656f3533597574644c',
    //     serviceName: 'SeoulPublicLibraryInfo',
    //     mappings: mappings.value
    // };
    
    //console.log('API URL:', apiUrl.value , type.value, apiKey.value, serviceName.value , mappings.value);


    try {
        const res = await axios.post('http://localhost:8080/api/fetchApi', payload);
        alert('전송 성공!');
        //console.log('응답:', res.data);
    } catch (err) {
        alert('전송 실패');
        console.error(err);
    }

}

const sendApiRequest = async () => {
  try {
    const res = await axios.post('/api/fetch-and-save', { url: apiUrl.value })
    responseMessage.value = res.data.message
  } catch (err) {
    responseMessage.value = '요청 실패: ' + err.message
  }
}

function closeAddPopup() {
    apiInputStore.setPopupOpen(false); // 팝업 열기
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}
.form-group {
  margin-bottom: 1rem;
}
.mapping-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.form-input {
  flex: 1;
  padding: 0.5rem;
}
.form-input.small {
  width: 80px;
}
.btn-remove {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0 0.75rem;
  cursor: pointer;
}
.btn-add {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>