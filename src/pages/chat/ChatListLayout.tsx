import { useQuery } from '@tanstack/react-query'
import { NavLink, Outlet, useParams } from 'react-router'
import { fetchRooms, roomKeys } from '@/entities/room/model'
import { cn } from '@/shared/lib/cn'
import { Avatar } from '@/shared/ui/Avatar'
import { SearchIcon } from '@/shared/ui/icons'

/**
 * 대화 목록 + 대화창
 * - 768px 이상: 나란히
 * - 768px 미만: 방을 고르면 목록을 숨기고 대화창만
 */
export function ChatListLayout() {
  const { roomId } = useParams()
  const rooms = useQuery({ queryKey: roomKeys.list(), queryFn: fetchRooms })

  return (
    <div className="flex h-full">
      <section
        aria-label="대화 목록"
        className={cn(
          'w-full shrink-0 flex-col border-r border-line md:flex md:w-80',
          roomId ? 'hidden' : 'flex',
        )}
      >
        <header className="flex flex-col gap-3.5 px-5 pt-5 pb-3">
          <h1 className="text-[22px] font-bold">채팅</h1>
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl bg-act px-3 text-[13px] text-sub"
          >
            <SearchIcon size={16} />
            <span className="flex-1 text-left">사람, 대화방, 메시지 검색</span>
            <kbd className="rounded border border-line px-1.5 text-[11px]">⌘K</kbd>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-2">
          {rooms.isPending && <p className="p-4 text-sub">불러오는 중…</p>}
          {rooms.isError && <p className="p-4 text-danger">목록을 불러오지 못했어요.</p>}
          {rooms.data?.length === 0 && (
            <p className="p-4 text-sub">아직 대화가 없어요. 친구에게 먼저 말을 걸어 보세요.</p>
          )}
          {rooms.data?.map((room) => (
            <NavLink
              key={room.id}
              to={`/chats/${room.id}`}
              className={({ isActive }) =>
                cn('flex items-center gap-3 rounded-xl px-3 py-2.5', isActive && 'bg-act')
              }
            >
              <Avatar src={room.imageUrl} name={room.name} />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex justify-between gap-2">
                  <b className="truncate">{room.name}</b>
                  <span className="shrink-0 text-[11px] text-sub">
                    {room.lastMessageAt && formatTime(room.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-sub">{room.lastMessagePreview}</span>
                  {room.unreadCount > 0 && (
                    <span className="shrink-0 rounded-full bg-red-600 px-1.5 text-[10px] leading-[17px] font-bold text-white">
                      {room.unreadCount > 99 ? '99+' : room.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <div className={cn('min-w-0 flex-1', roomId ? 'flex' : 'hidden md:flex')}>
        <Outlet />
      </div>
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  return d.toDateString() === today.toDateString()
    ? d.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
}
