import { api } from '@/shared/api/http'

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'

export interface Message {
  /** 서버가 발급한 TSID (시간순 정렬, 커서로 사용) */
  id: string
  clientMessageId: string | null
  roomId: string
  senderId: string
  senderName: string
  type: MessageType
  content: string
  replyTo: { id: string; senderName: string; preview: string } | null
  deleted: boolean
  createdAt: string
  /** 이 메시지를 아직 안 읽은 멤버 수 (0이면 표시 안 함) */
  unreadCount: number
}

/** 화면에서만 쓰는 전송 상태 */
export type OutgoingStatus = 'sending' | 'sent' | 'failed'

export interface SendMessagePayload {
  roomId: string
  clientMessageId: string
  type: MessageType
  content: string
  replyToId?: string
}

export interface MessagePage {
  items: Message[]
  nextCursor: string | null
  hasNext: boolean
}

export const messageKeys = {
  list: (roomId: string) => ['messages', roomId] as const,
}

/** 이전 메시지: 커서(id) 기준으로 위로 불러오기 */
export const fetchMessages = (roomId: string, cursor?: string) =>
  api<MessagePage>(
    `/rooms/${roomId}/messages?size=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`,
  )
