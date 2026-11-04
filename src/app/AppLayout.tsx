import { Outlet } from 'react-router'
import { useStompConnection } from '@/shared/api/stomp'
import { Rail } from '@/widgets/rail/Rail'
import { TabBar } from '@/widgets/tab-bar/TabBar'

/**
 * 로그인 후 공통 레이아웃
 * - 1024px 이상: 왼쪽 레일
 * - 1024px 미만: 하단 탭 바
 */
export function AppLayout() {
  useStompConnection()

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <Rail className="hidden lg:flex" />
      <main className="min-h-0 min-w-0 flex-1">
        <Outlet />
      </main>
      <TabBar className="lg:hidden" />
    </div>
  )
}
