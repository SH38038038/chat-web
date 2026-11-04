import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet, useLocation } from 'react-router'
import { refreshAccessToken } from '@/shared/api/http'
import { useAuthStore } from '@/shared/model/authStore'

/**
 * 로그인이 필요한 화면을 감싼다.
 * 새로고침하면 메모리의 Access 토큰이 사라지므로,
 * Refresh 쿠키로 한 번 조용히 재발급을 시도한 뒤 판단한다.
 */
export function RequireAuth() {
  const token = useAuthStore((s) => s.accessToken)
  const location = useLocation()

  const silent = useQuery({
    queryKey: ['auth', 'silent-refresh'],
    queryFn: refreshAccessToken,
    enabled: !token,
    retry: false,
    staleTime: Infinity,
  })

  if (token) return <Outlet />
  if (silent.isPending) {
    return (
      <div className="flex h-full items-center justify-center text-sub" role="status">
        불러오는 중…
      </div>
    )
  }
  return <Navigate to="/login" replace state={{ from: location.pathname }} />
}
