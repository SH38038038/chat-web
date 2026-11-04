const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'

export const env = {
  /** REST API 기본 경로. 개발 중엔 Vite 프록시를 타도록 '/api' */
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  /** STOMP 엔드포인트. 비우면 현재 주소 기준 /ws */
  wsUrl: import.meta.env.VITE_WS_URL || `${wsProtocol}://${window.location.host}/ws`,
} as const
