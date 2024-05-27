# Node-Recruiter

노드 간단 이력서 CRUD

- [MySQL ERD](https://drawsql.app/teams/-1278/diagrams/node-recruiter)
- [API 명세서](https://spiffy-geometry-22c.notion.site/Node-js-API-20809227e8c44840b4e1c1bee1588df6?pvs=4)
- [배포주소](https://dfgdwssegf.shop/api/health)

### Recruiter 데모 계정
```json
{
	"email":"recruiter@demo.com",
	"password":"demo123"
}
```
### APLICANT 데모계정
```json
{
	"email":"APPLICATN@demo.com",
	"password":"demo123"
}
```

## 🚀 서버 실행 방법

### 1. 설치 절차

1. 레포지토리 클론
2. 의존성 설치 (yarn)

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 필요한 변수를 설정해야 합니다:

```env
SERVER_PORT=3000
DATABASE_URL="DATABASE_URL"
ACCESS_TOKEN_SECRET_KEY="자연샘막국수"
REFRESH_TOKEN_SECRET_KEY="혼맛스시"
```
### 3. 토큰 사용방법

로그인시에 쿠키로 AccessToken, RefreshToken 이 주어집니다.
<img width="600" alt="스크린샷 2024-05-27 오전 10 42 32" src="https://github.com/KAPUIST/Node-Recruiter/assets/91464689/05745b39-2f6e-41be-b41c-6f086e8debb9">

그렇게 전달 받은 토큰 을 헤더 Authorization 으로 넣어서 사용 가능합니다.
<img width="601" alt="스크린샷 2024-05-27 오전 10 42 42" src="https://github.com/KAPUIST/Node-Recruiter/assets/91464689/775a6363-2b4e-4178-a8b5-76ba6b6da29d">


### 서버 실행

    •	서버 실행 커멘드: yarn start
    •	개발 모드 실행: yarn run dev

### ✨ 사용 기술

![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### 🛠️ 미들웨어

• ErrorHandler: 애플리케이션 전반에서 발생하는 에러를 처리합니다.
• Auth: 사용자 인증 및 권한 부여를 처리합니다.

### 서버 접근

http://localhost:3000/api

### 폴더 구조

```markdown
node_modules/
prisma/
└── schema.prisma
src/
├── controllers/
│ ├── auth.controller.js
│ ├── resume.controller.js
│ └── user.controller.js
├── middlewares/
│ ├── asyncError.middleware.js
│ ├── auth.middleware.js
│ └── error.middleware.js
├── routes/
│ ├── auth.route.js
│ ├── resume.route.js
│ └── user.route.js
├── services/
│ ├── auth.service.js
│ ├── resume.service.js
│ └── user.service.js
├── utils/
│ ├── errorHandler/
│ │ └── errorHandler.js
└── jwt/
└── jwt.js
prisma/
├── prisma.util.js
validation/
├── auth.validation.js
├── resume.validation.js
└── statusCode.js
app.js
.env
.gitignore
.prettierrc
package.json
README.md
yarn.lock
```
