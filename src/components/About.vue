<template>
    <div class="overlay" v-if="openAbout">

        <div class="intro-container">
            <div class="slide">
                <h2>About · 서울봄(SeoulVue)</h2>
                
                <p>
                <span class="highlight">서울봄(SeoulVue)</span>은 서울시의 다양한 공공시설 데이터를 시각적으로 한눈에 볼 수 있도록 구성된 
                <span class="em">Vue3 기반 대시보드</span>입니다.
                </p>

                <p>
                이 프로젝트는 제가 공공기관 SI 프로젝트에서 경험한 
                <span class="em">지도 기반 데이터 연동, 시각화 구성, 사용자 인터랙션 설계</span> 경험을 녹여 만든 개인 포트폴리오입니다.
                </p>

                <p>
                구현한 주요 기능은 다음과 같습니다:
                </p>

                <ul class="about-feature-list">
                <li>공공 API로부터 데이터를 수집하고 DB에 적재한 후 동적으로 불러오는 <span class="em">데이터 파이프라인 구성</span></li>
                <li><span class="em">지도 마커 클러스터링</span> 및 <span class="em">행정구역별 필터링</span> 기능 구현</li>
                <li>사용자가 항목을 선택하면 <span class="em">차트, 테이블, 지도 등이 동기화</span>되도록 구성</li>
                <li><span class="em">반응형 UI</span>로 데스크탑·모바일 모두 최적화</li>
                </ul>

                <p>
                실제 실무에서 자주 겪었던 <span class="em">복잡한 데이터 가시화 문제</span>와 <span class="em">사용성 부족 문제</span>를 직접 해결해보는 데 집중했습니다.
                </p>

                <p class="note">
                ※ 본 프로젝트에 사용된 데이터는 <a href="https://data.seoul.go.kr/" target="_blank">서울열린데이터광장</a>의 API를 기반으로 하였습니다.
                </p>

                <div class="button-group">
                    <button class="btn-primary" @click="close">확인</button>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import { emitter } from '@/utils/eventBus';

const openAbout = ref(false)

onMounted(() => {
    emitter.on('openAbout', () => {
        openAbout.value = true;
        // 필요하면 슬라이드 초기화 등 추가 작업
    });
  });

function close() {
    openAbout.value = false;
}
</script>


<style>
.intro-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-sizing: border-box;
}

.intro-container .slide {
  background-color: #ffffff;
  padding: 2rem 2.5rem;
  max-width: 600px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease-in-out;
}

.intro-container h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #222;
}

.intro-container p {
  font-size: 1rem;
  margin-bottom: 0.8rem;
  line-height: 1.6;
  color: #444;
}

.intro-container .note {
  font-size: 0.85rem;
  color: #888;
  margin-top: 1rem;
}

.about-feature-list {
  list-style: disc;
  padding-left: 1.2em;
  margin: 0.5rem 0 1rem;
}

.about-feature-list li {
  margin-bottom: 0.5rem;
  color: #333;
}

.em {
  font-weight: 600;
  color: #337ab7;
}

.highlight {
  font-weight: 700;
  color: #2c3e50;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3778f2;
  border: none;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #285fca;
}

.btn-secondary {
  background-color: #e0e0e0;
  border: none;
  color: #333;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary:hover {
  background-color: #cfcfcf;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-container .slide, .overlay .modal {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;      /* 화면보다 너무 크면 안 됨 */
  overflow-y: auto;      /* 내부에서 스크롤 허용 */
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
}


</style>