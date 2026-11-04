import { Client, type IMessage } from '@stomp/stompjs'
import { useEffect, useSyncExternalStore } from 'react'
import { env } from '@/shared/config/env'
import { useAuthStore } from '@/shared/model/authStore'

/*
 * 앱 전체에서 STOMP 연결은 하나만 쓴다.
 * - CONNECT 프레임에 JWT를 실어 보냄 (서버 ChannelInterceptor에서 검증)
 * - 끊기면 지수 백오프 + 랜덤 지연으로 재연결 (배포 때 한꺼번에 몰리지 않게)
 */

const BASE_DELAY = 1_000
const MAX_DELAY = 30_000

type Status = 'idle' | 'connecting' | 'connected' | 'disconnected'
let status: Status = 'idle'
const listeners = new Set<() => void>()

function setStatus(next: Status) {
  status = next
  listeners.forEach((l) => l())
}

const client = new Client({
  brokerURL: env.wsUrl,
  reconnectDelay: BASE_DELAY,
  heartbeatIncoming: 10_000,
  heartbeatOutgoing: 10_000,
  beforeConnect: () => {
    setStatus('connecting')
    const token = useAuthStore.getState().accessToken
    client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}
  },
  onConnect: () => {
    client.reconnectDelay = BASE_DELAY
    setStatus('connected')
  },
  onWebSocketClose: () => {
    setStatus('disconnected')
    const jitter = Math.random() * 1_000
    client.reconnectDelay = Math.min(client.reconnectDelay * 2, MAX_DELAY) + jitter
  },
  onStompError: (frame) => {
    console.warn('[stomp] error', frame.headers['message'], frame.body)
  },
})

export const stomp = {
  client,

  subscribe(destination: string, onMessage: (msg: IMessage) => void) {
    if (!client.connected) return () => {}
    const sub = client.subscribe(destination, onMessage)
    return () => sub.unsubscribe()
  },

  publish(destination: string, body: unknown) {
    client.publish({ destination, body: JSON.stringify(body) })
  },
}

/** 연결 상태 구독 (끊김 배너 등에 사용) */
export function useStompStatus() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => status,
  )
}

/** 로그인된 레이아웃에서 한 번 호출: 토큰이 있으면 연결, 없으면 해제 */
export function useStompConnection() {
  const token = useAuthStore((s) => s.accessToken)
  useEffect(() => {
    if (!token) return
    client.activate()
    return () => {
      void client.deactivate()
    }
  }, [token])
}

/**
 * 연결된 동안 destination을 구독. 재연결되면 다시 구독한다.
 * onMessage는 useCallback 등으로 안정적인 참조를 넘겨 주세요.
 */
export function useStompSubscription(destination: string | null, onMessage: (msg: IMessage) => void) {
  const current = useStompStatus()
  useEffect(() => {
    if (!destination || current !== 'connected') return
    return stomp.subscribe(destination, onMessage)
  }, [destination, current, onMessage])
}
