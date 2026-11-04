import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'minimal' | 'classic' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

/** 테마는 기기별 취향이라 localStorage에 저장 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'minimal',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'chat-theme' },
  ),
)
