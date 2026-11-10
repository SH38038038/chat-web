import { api } from '@/shared/api/http'
import { useAuthStore } from '@/shared/model/authStore'

export interface LoginRequest {
  email: string
  password: string
}

interface TokenResponse {
  accessToken: string
}

/** 로그인: Access 토큰은 응답 본문, Refresh 토큰은 서버가 HttpOnly 쿠키로 심어 줌 */
export async function login(req: LoginRequest) {
  const { accessToken } = await api<TokenResponse>('/auth/login', {
    method: 'POST',
    body: { ...req },
  })
  useAuthStore.getState().setAccessToken(accessToken)
}

export interface SignupRequest {
  email: string
  phoneNumber: string
  password: string
  name: string
  handle: string
}

/** 회원가입: 이메일과 전화번호 중 하나는 필수. 전화번호는 E.164(+82...), 빈 문자열은 서버에서 null 처리 */
export function signup(req: SignupRequest) {
  return api<void>('/users', { method: 'POST', body: { ...req } })
}

export async function logout() {
  try {
    await api<void>('/auth/logout', { method: 'POST' })
  } finally {
    useAuthStore.getState().clear()
  }
}
