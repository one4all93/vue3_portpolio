# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

// main 기능 정리
- 네이버맵 API 연동
- 공공데이터 포털 데이터 연계
- 

// 주요 수정/추가 및 이슈
< 2025.04.21 >
- 프로젝트 생성 및 "SyntaxError: Unexpected token '||='" 이슈로 pakage.json :: "type": "module", ← 삭제 **
- 현업에서는 vue2 + webpack 조합을 사용했으나 -> 현 프로젝트에서는 vue3 + vite 조합을 사용함

< 2025.04.22 >
- 열린데이터 광장 > 서울시 공공도서관 데이터.json example폴더에 추가 (일단 개발용으로 json파일 사용하고, api연계는 추후에 진행 예정**)
- 서울시 구별 경계 파일로 표출테스트완료 :: 성북구가 빠져있어서 추구 성북구 추가 필요 **

< 2025.04.28~29 >
- 템플렛 스타일 찾기 + css추가
    - 왼쪽 메뉴 구성
- 

< 주요 작업 목록 >
- 왼쪽 메뉴 구성 (2뎁스 이상) :: 클릭시, 해당 마커 및 데이터 표출
- 데이터 차트화 (다른 영역에 왼쪽 메뉴 클릭 싱크 맞춰서 수치 및 조건 변하면 렌더링 다시 되게끔)
- 구별 색상 다르게 입히기
- 로딩상태 처리
+ 반응형 UI로 작업
+ 데이터 API 데이터 처리 
