# GYENG NETFLIX 클론

이 프로젝트는 React와 Tailwind CSS를 사용하여 GYENG NETFLIX를 클론한 프로젝트입니다.  
2024년 2학기 **웹서비스 설계 과목 2차 과제**로 제작되었습니다.

---

## 배포된 웹사이트

프로젝트는 Netlify를 통해 배포되었으며, 아래 링크에서 확인할 수 있습니다:  
**[GYENG NETFLIX 웹사이트](https://gyeong123.netlify.app)**

---

## 홈 화면

![홈 화면](./public/assert/banner.png)

---

## 사용 기술
- **React**: 컴포넌트 기반 UI 개발
- **Tailwind CSS**: 스타일링 프레임워크

---

# Create React App으로 시작하기

이 프로젝트는 다운로드 후 아래 두 단계를 수행하면 바로 실행할 수 있습니다:
1. **필수 패키지 설치**: `npm install`
2. **앱 실행**: `npm start`  
   브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

---

## 사용 가능한 스크립트

프로젝트 디렉터리에서 실행할 수 있는 주요 명령어는 다음과 같습니다:

### `npm install`
- 프로젝트에 필요한 모든 종속성을 설치합니다.
- `package.json` 파일을 기반으로 `node_modules` 디렉터리를 생성합니다.
- **새 프로젝트를 다운로드한 경우 이 명령을 먼저 실행해야 합니다.**

### `npm start`
- 개발 모드로 앱을 실행합니다.
- [http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.
- **핫 리로드**를 지원하여 코드 수정 시 페이지가 자동으로 새로고침됩니다.

### `npm test`
- 테스트 러너를 실행하여 작성된 테스트 코드를 확인합니다.
- 자세한 내용은 [테스트 실행 가이드](https://facebook.github.io/create-react-app/docs/running-tests)를 참고하세요.

### `npm run build`
- 프로덕션용으로 앱을 빌드합니다.
- 결과물은 `build` 폴더에 생성됩니다.
- 빌드된 파일은 압축되며 파일 이름에는 캐싱을 위한 해시값이 포함됩니다.
- **배포 준비 완료 상태**가 됩니다. 배포 방법은 [배포 가이드](https://facebook.github.io/create-react-app/docs/deployment)를 참고하세요.

### `npm run eject`
- 기본 설정을 커스터마이징하고 싶을 때 사용합니다.
- **주의**: 이 명령어는 되돌릴 수 없습니다. 사용 후에는 모든 설정 파일이 프로젝트 디렉터리로 노출됩니다.

---

## Git 명령어로 프로젝트 업로드

아래 명령어를 복사하여 GitHub에 코드를 업로드하세요:
```bash
git add . && git commit -m "popular부분 수정 및 무한,격자 스크롤" && git push origin main
