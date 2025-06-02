# 📊 서울 공공데이터 시각화 프로젝트 - 서울봄(SeoulView)

> Vue 3 + Vite + Naver Maps API + Chart.js 기반의 데이터 시각화 대시보드

## 🔍 프로젝트 소개
서울시의 공공데이터(도서관 등)를 지도, 리스트, 차트 형태로 직관적으로 시각화하고,
사용자 인터랙션에 따라 실시간으로 연동되는 UI를 제공합니다.

- 마커, 클러스터, GeoJSON 경계 표시
- 조건 기반 필터링 및 상호 연동
- 차트 ↔ 지도 ↔ 리스트 3방향 연동 UX
- 공공데이터 API → 로컬 DB 적재 → JPA 조회 구조

## 🧩 주요 기능
- ✅ 지도 시각화 (Naver Map + 마커/클러스터/Geojson)
- ✅ 마커 클릭 시 상세 정보 + 리스트 연동
- ✅ 구역 클릭 시 해당 데이터만 필터링
- ✅ 차트 클릭 시 필터링 → 지도 + 리스트 실시간 갱신
- ✅ 리스트 검색/정렬/페이징
- ✅ 서버 측 API 연동 (공공데이터 → DB 적재 → JPA 조회)

## ⚙️ 기술 스택
- Frontend: `Vue 3`, `Vite`, `Pinia`, `Chart.js`, `Mitt`
- Map API: `Naver Maps API`
- Backend: `Spring Boot`, `JPA`, `MySQL`
- Deployment: `EC2`, `Nginx`

## 🌐 배포 링크
🔗 [http://www.seoulvue.kr]

## 🗂 문서 링크 (작업 일지, 기획 등)
📄 [작업 상세 문서 보기](http://www.seoulvue.kr/doc.html)
