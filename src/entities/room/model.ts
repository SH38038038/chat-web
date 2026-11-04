import { api } from '@/shared/api/http'

export type RoomType = 'DIRECT' | 'GROUP' | 'SELF' | 'OPEN'

export interface RoomSummary {
  id: string
  type: RoomType
  name: string
  imageUrl: string | null
  memberCount: number
  lastMessagePreview: string | null
  lastMessageAt: string | null
  unreadCount: number
  pinned: boolean
}

export const roomKeys = {
  all: ['rooms'] as const,
  list: () => [...roomKeys.all, 'list'] as const,
  detail: (id: string) => [...roomKeys.all, 'detail', id] as const,
}

export const fetchRooms = () => api<RoomSummary[]>('/rooms')
export const fetchRoom = (id: string) => api<RoomSummary>(`/rooms/${id}`)
