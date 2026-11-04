import { create } from 'zustand'

interface AuthState {
  /** Access 토큰은 메모리에만 둔다 (XSS로 localStorage가 털리는 것을 피함) */
  accessToken: string | null
  setAccessToken: (token: string | null) => void
  clear: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  clear: () => set({ accessToken: null }),
}))
