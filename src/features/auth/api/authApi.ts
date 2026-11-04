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

export async function logout() {
  try {
    await api<void>('/auth/logout', { method: 'POST' })
  } finally {
    useAuthStore.getState().clear()
  }
}
