# chat-web

카카오톡 클론 웹 프런트엔드 (React + TypeScript)

## 스택

| 영역 | 사용 |
|---|---|
| 빌드 | Vite 7 |
| UI | React 19, TypeScript 5.8 |
| 스타일 | Tailwind CSS 4 (`@tailwindcss/vite`) |
| 라우팅 | React Router 7 |
| 서버 상태 | TanStack Query 5 |
| 클라이언트 상태 | Zustand 5 (Access 토큰, 테마) |
| 실시간 | @stomp/stompjs 7 (Spring STOMP와 짝) |
| 품질 | ESLint 9, Prettier 3 (+ Tailwind 클래스 정렬) |

## 시작하기

```bash
npm install
cp .env.example .env.local   # 필요할 때만
npm run dev                  # http://localhost:5173
```

백엔드(Spring)가 `http://localhost:8080`에서 돈다고 가정해요.
개발 서버가 `/api`, `/ws`를 백엔드로 프록시해서 CORS·쿠키 설정 없이 개발할 수 있어요.

| 스크립트 | 하는 일 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 검사 + 빌드 |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | 타입만 검사 |

## 폴더 구조

```
src/
├─ app/            앱 설정: 라우터, Provider, 공통 레이아웃
├─ pages/          라우트 단위 화면 (login, chat, friends, openchat)
├─ widgets/        여러 화면에서 쓰는 큰 덩어리 (레일, 하단 탭 바)
├─ features/       사용자 동작 단위 (auth: 로그인·로그아웃·보호 라우트)
├─ entities/       도메인 타입·API (room, message)
└─ shared/
   ├─ api/         fetch 래퍼(http.ts), STOMP 연결(stomp.ts)
   ├─ config/      환경 변수
   ├─ lib/         유틸 (cn, id)
   ├─ model/       전역 스토어 (authStore, themeStore)
   └─ ui/          작은 공통 컴포넌트 (아이콘, 아바타)
```

`@/` 는 `src/` 를 가리켜요. 예: `import { api } from '@/shared/api/http'`

## 인증 흐름

- 로그인하면 **Access 토큰은 메모리(Zustand)**, **Refresh 토큰은 서버가 HttpOnly 쿠키로** 저장
- API가 401을 주면 `/auth/refresh`로 한 번 재발급 후 재시도 (동시 요청은 한 번으로 묶음)
- 새로고침하면 `RequireAuth`가 쿠키로 조용히 재발급을 시도하고, 실패하면 로그인 화면으로
- STOMP 연결 시 `Authorization: Bearer …` 를 CONNECT 헤더로 전송

## 백엔드와 맞출 API (가정)

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/auth/login` | `{ email, password }` → `{ accessToken }` + Refresh 쿠키 |
| POST | `/api/auth/refresh` | Refresh 쿠키 → `{ accessToken }` |
| POST | `/api/auth/logout` | Refresh 쿠키 폐기 |
| GET | `/api/rooms` | 내 대화방 목록 |
| GET | `/api/rooms/{id}` | 대화방 정보 |
| GET | `/api/rooms/{id}/messages?cursor=&size=` | 메시지 (최신순, 커서 페이징) |
| STOMP SEND | `/app/chat.send` | `{ roomId, clientMessageId, type, content }` |
| STOMP SUB | `/topic/room.{id}` | 방 메시지 수신 |

## 테마

`src/index.css`의 CSS 변수로 미니멀·클래식·다크를 정의했어요.
`useThemeStore().setTheme('dark')` 처럼 바꾸면 `<html data-theme>`이 바뀌고,
Tailwind에서는 `bg-bg`, `text-fg`, `text-sub`, `border-line`, `bg-accent` 같은 이름으로 써요.

## 화면 폭 기준

| 폭 | 레이아웃 |
|---|---|
| 1024px 이상 (`lg`) | 레일 + 목록 + 대화창 |
| 768–1023px (`md`) | 목록 + 대화창, 하단 탭 바 |
| 768px 미만 | 목록 ↔ 대화창 한 화면씩, 하단 탭 바 |
