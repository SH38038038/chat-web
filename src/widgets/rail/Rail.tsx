import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { ChatIcon, MoreIcon, OpenChatIcon, PersonIcon } from '@/shared/ui/icons'

const items = [
  { to: '/friends', label: '친구', Icon: PersonIcon },
  { to: '/chats', label: '채팅', Icon: ChatIcon },
  { to: '/open-chats', label: '오픈채팅', Icon: OpenChatIcon },
]

const itemClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex size-12 items-center justify-center rounded-[14px] text-sub transition-colors hover:bg-act',
    isActive && 'bg-act text-fg',
  )

/** 데스크톱(1024px 이상) 왼쪽 레일 */
export function Rail({ className }: { className?: string }) {
  return (
    <nav
      aria-label="주 메뉴"
      className={cn(
        'w-[72px] shrink-0 flex-col items-center gap-2 border-r border-line bg-rail py-5',
        className,
      )}
    >
      <div className="mb-4 size-10 rounded-[14px] bg-act" aria-hidden="true" />
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} aria-label={label} className={itemClass}>
          <Icon />
        </NavLink>
      ))}
      <div className="flex-1" />
      {/* TODO: 더보기 팝오버 (프로필, 나와의 채팅, 보관함, 설정, 로그아웃) */}
      <button type="button" aria-label="더보기" className={itemClass({ isActive: false })}>
        <MoreIcon />
      </button>
    </nav>
  )
}
