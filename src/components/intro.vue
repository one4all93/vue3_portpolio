<template>
    <div v-if="showIntro" :key="introKey" id="intro-overlay" class="overlay">
        
        <div class="slide" v-show="slideIndex === 0">
            <h2>서울봄(Seoul_Vue)에 오신 걸 환영합니다!</h2>
            <br />
            <p>이 사이트는 서울의 공공 시설 정보(서울 열린데이터 광장 원천)를 시각화한 대시보드입니다.</p>
            <br />
            <button class="btn-primary" @click="nextSlide">다음</button>
        </div>

        <div class="slide" v-show="slideIndex === 1">
            <h2>왼쪽 메뉴에서 시설 항목을 선택해보세요</h2>
            <br />
            <p>
                지도에는 <span class="highlight">시설 마커가 클러스터</span>로 자동 묶여서 깔끔하게 보여집니다.  
                지도를 확대하면 <span class="highlight">개별 마커</span>로 분리됩니다.
            </p>
            <p>
                <span class="highlight">행정구역(구 단위)</span>을 클릭하면 해당 지역의 데이터만 필터링되어 표시돼요.
            </p>
            <br />
            <p style="font-size: 0.9em; color: #ccc;">※ 클러스터란 가까이 있는 여러 마커를 하나로 묶어 보여주는 기능이에요.</p>
            <br />
            <button class="btn-primary" @click="nextSlide">다음</button>
        </div>

        <div class="slide" v-show="slideIndex === 2">
            <h2>이제 시작해볼까요?</h2>
            <br />
            <p>'시작하기' 버튼을 눌러 대시보드로 이동하세요.</p>
            <br />
            <button class="btn-primary" @click="closeOverlay">시작하기</button>
        </div>

        <div class="intro-footer">
            <div class="button-group">
                <label>
                <input type="checkbox" v-model="dontShowAgain" />
                다시 보지 않기
                </label>
                <button class="btn-primary" @click="closeOverlay">닫기</button>
            </div>
        </div>

    </div>
  </template>
  
  <script setup>
  import { ref , onMounted } from 'vue'

  import { emitter } from '@/utils/eventBus';

  onMounted(() => {
    emitter.on('openIntro', () => {
        showIntro.value = true;
        // 필요하면 슬라이드 초기화 등 추가 작업
    });
  });
  
  const slideIndex = ref(0)
  const showIntro = ref(sessionStorage.getItem("dontShowIntro") !== "true")
  const introKey = ref(0)
  const dontShowAgain = ref(false)
  
  function nextSlide() {
    if (slideIndex.value < 2) {
      slideIndex.value++
    } else {
      closeOverlay()
    }
  }
  
  function closeOverlay() {
    if (dontShowAgain.value) {
      sessionStorage.setItem("dontShowIntro", "true")
    }
    showIntro.value = false
  }
  
  function openIntro() {
    slideIndex.value = 0
    dontShowAgain.value = false
    sessionStorage.removeItem("dontShowIntro")
    introKey.value++ // 강제 리렌더링
    showIntro.value = true
  }
  
  defineExpose({ openIntro }) // 부모에서 this.$refs.intro.openIntro() 가능하게
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.85);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    flex-direction: column;
    padding: 1.5rem;
  }
  
  .slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .highlight {
    font-weight: bold;
    color: #00bcd4;
    background-color: #e0f7fa;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background: #00AEEF;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
  }
  
  .intro-footer {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .button-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .button-group label {
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .button-group .close {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .btn-primary {
  margin-top: 20px;
  padding: 12px 28px;
  background-color: #00aef0; /* 기존 파란색 계열 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.btn-primary:hover {
  background-color: #008ac7; /* 좀 더 어두운 파란색 */
}

.btn-close {
  margin-top: 20px;
  padding: 12px 28px;
  background-color: #00aef0; /* 기존 파란색 계열 */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.25s ease;
}

.btn-close:hover {
  background-color: #bbb;
  color: #222;
}

  </style>
  