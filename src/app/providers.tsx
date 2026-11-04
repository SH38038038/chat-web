import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect, useState, type ReactNode } from 'react'
import { ApiError } from '@/shared/api/http'
import { useThemeStore } from '@/shared/model/themeStore'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // 인증·권한 오류는 다시 시도해도 결과가 같으니 재시도하지 않음
        retry: (count, error) =>
          !(error instanceof ApiError && [401, 403, 404].includes(error.status)) && count < 2,
      },
    },
  })
}

/** <html data-theme="..."> 동기화 */
function ThemeSync() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
