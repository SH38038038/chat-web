import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { ChatIcon, MoreIcon, OpenChatIcon, PersonIcon } from '@/shared/ui/icons'

const tabs = [
  { to: '/friends', label: '친구', Icon: PersonIcon },
  { to: '/chats', label: '채팅', Icon: ChatIcon },
  { to: '/open-chats', label: '오픈채팅', Icon: OpenChatIcon },
]

/** 1024px 미만 하단 탭 바 */
export function TabBar({ className }: { className?: string }) {
  return (
    <nav
      aria-label="주 메뉴"
      className={cn('flex h-16 shrink-0 border-t border-line bg-bg', className)}
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-sub',
              isActive && 'font-bold text-fg',
            )
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
      <button
        type="button"
        className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] text-sub"
      >
        <MoreIcon />
        더보기
      </button>
    </nav>
  )
}
