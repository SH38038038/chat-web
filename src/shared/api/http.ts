import { env } from '@/shared/config/env'
import { useAuthStore } from '@/shared/model/authStore'

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(status: number, body: unknown) {
    super(`API error ${status}`)
    this.status = status
    this.body = body
  }
}

let refreshing: Promise<string | null> | null = null

/**
 * Refresh 토큰(HttpOnly 쿠키)으로 Access 토큰 재발급.
 * 동시에 여러 요청이 401을 받아도 재발급은 한 번만 일어나게 묶는다.
 */
export function refreshAccessToken(): Promise<string | null> {
  refreshing ??= fetch(`${env.apiBaseUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(async (res) => (res.ok ? ((await res.json()) as { accessToken: string }).accessToken : null))
    .catch(() => null)
    .then((token) => {
      useAuthStore.getState().setAccessToken(token)
      return token
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

type JsonBody = Record<string, unknown> | unknown[]

export interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: JsonBody | FormData
}

/** fetch 래퍼: JSON 직렬화, Authorization 헤더, 401이면 한 번 재발급 후 재시도 */
export async function api<T>(path: string, options: ApiOptions = {}, retry = true): Promise<T> {
  const { body, headers: rawHeaders, ...rest } = options
  const headers = new Headers(rawHeaders)
  const token = useAuthStore.getState().accessToken
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let payload: BodyInit | undefined
  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
    payload = JSON.stringify(body)
  }

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers,
    body: payload,
    credentials: 'include',
  })

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken()
    if (newToken) return api<T>(path, options, false)
  }

  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => null))
  }
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
