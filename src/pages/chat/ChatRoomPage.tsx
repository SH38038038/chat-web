import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { IMessage } from '@stomp/stompjs'
import { useCallback, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import {
  fetchMessages,
  messageKeys,
  type Message,
  type MessagePage,
  type SendMessagePayload,
} from '@/entities/message/model'
import { fetchRoom, roomKeys } from '@/entities/room/model'
import { stomp, useStompStatus, useStompSubscription } from '@/shared/api/stomp'
import { newClientMessageId } from '@/shared/lib/id'
import { cn } from '@/shared/lib/cn'
import { BackIcon } from '@/shared/ui/icons'

interface Pending {
  clientMessageId: string
  content: string
}

export function ChatRoomPage() {
  const { roomId = '' } = useParams()
  const queryClient = useQueryClient()
  const status = useStompStatus()
  const [pending, setPending] = useState<Pending[]>([])
  const [text, setText] = useState('')

  const room = useQuery({ queryKey: roomKeys.detail(roomId), queryFn: () => fetchRoom(roomId) })
  const messages = useQuery({
    queryKey: messageKeys.list(roomId),
    queryFn: () => fetchMessages(roomId),
  })

  // 새 메시지가 오면 캐시 맨 앞(최신)에 끼워 넣고, 내가 보낸 임시 메시지는 지운다
  const onMessage = useCallback(
    (frame: IMessage) => {
      const msg = JSON.parse(frame.body) as Message
      queryClient.setQueryData<MessagePage>(messageKeys.list(roomId), (prev) =>
        prev && !prev.items.some((m) => m.id === msg.id)
          ? { ...prev, items: [msg, ...prev.items] }
          : prev,
      )
      if (msg.clientMessageId) {
        setPending((list) => list.filter((p) => p.clientMessageId !== msg.clientMessageId))
      }
    },
    [queryClient, roomId],
  )
  useStompSubscription(roomId ? `/topic/room.${roomId}` : null, onMessage)

  const send = () => {
    const content = text.trim()
    if (!content || status !== 'connected') return
    const payload: SendMessagePayload = {
      roomId,
      clientMessageId: newClientMessageId(),
      type: 'TEXT',
      content,
    }
    setPending((list) => [...list, { clientMessageId: payload.clientMessageId, content }])
    stomp.publish('/app/chat.send', payload)
    setText('')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send()
  }

  // Enter 전송, Shift+Enter 줄바꿈 (한글 조합 중 Enter는 무시)
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  // TODO: 내 userId(/me)와 senderId를 비교해 내 말풍선은 오른쪽·노란색으로
  // TODO: 위로 스크롤하면 nextCursor로 이전 메시지 더 불러오기 (useInfiniteQuery)
  // 서버는 최신순으로 내려준다고 가정 → 화면은 오래된 것부터
  const items = [...(messages.data?.items ?? [])].reverse()

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-chat" aria-label="대화">
      <header className="flex h-[68px] shrink-0 items-center gap-3 border-b border-line bg-bg px-5">
        <Link to="/chats" aria-label="목록으로" className="-ml-2 p-2 md:hidden">
          <BackIcon />
        </Link>
        <div className="flex flex-col">
          <b className="text-[15px]">{room.data?.name ?? '…'}</b>
          {room.data && room.data.type !== 'DIRECT' && (
            <span className="text-xs text-sub">멤버 {room.data.memberCount}명</span>
          )}
        </div>
      </header>

      {status === 'disconnected' && (
        <div role="status" className="bg-amber-100 px-4 py-2 text-[13px] text-amber-900">
          연결이 끊겼어요. 다시 연결하는 중…
        </div>
      )}

      <ol className="flex flex-1 flex-col gap-3 overflow-y-auto px-7 py-5">
        {messages.isPending && <li className="text-sub">불러오는 중…</li>}
        {items.map((m) => (
          <li key={m.id} className="flex flex-col">
            {m.type === 'SYSTEM' ? (
              <span className="self-center rounded-full bg-act px-3 py-1 text-xs text-sub">
                {m.content}
              </span>
            ) : (
              <>
                <span className="text-xs text-sub">{m.senderName}</span>
                <p
                  className={cn(
                    'max-w-md self-start rounded-2xl rounded-tl-sm bg-their px-3.5 py-2 whitespace-pre-wrap',
                    m.deleted && 'text-sub italic',
                  )}
                >
                  {m.deleted ? '삭제된 메시지입니다' : m.content}
                </p>
              </>
            )}
          </li>
        ))}
        {pending.map((p) => (
          <li key={p.clientMessageId} className="flex items-end justify-end gap-1.5">
            <span className="text-[11px] text-sub">전송 중</span>
            <p className="max-w-md rounded-2xl rounded-tr-sm bg-accent px-3.5 py-2 whitespace-pre-wrap text-accent-fg opacity-70">
              {p.content}
            </p>
          </li>
        ))}
      </ol>

      <form onSubmit={onSubmit} className="border-t border-line bg-bg px-5 pt-3 pb-4">
        <div className="flex items-end gap-2 rounded-2xl border border-line py-1.5 pr-1.5 pl-3">
          <label className="flex flex-1">
            <span className="sr-only">메시지 입력</span>
            <textarea
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="메시지를 입력하세요"
              className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-2 outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={!text.trim() || status !== 'connected'}
            className="h-9 rounded-xl bg-accent px-4 font-bold text-accent-fg disabled:opacity-50"
          >
            전송
          </button>
        </div>
        <p className="mt-2 text-[11px] text-sub">Enter 전송 · Shift+Enter 줄바꿈</p>
      </form>
    </section>
  )
}
