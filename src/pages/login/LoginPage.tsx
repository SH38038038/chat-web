import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { login } from '@/features/auth/api/authApi'
import { ApiError } from '@/shared/api/http'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/chats'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate(from, { replace: true }),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  const errorMessage =
    mutation.error instanceof ApiError && mutation.error.status === 401
      ? '이메일 또는 비밀번호가 맞지 않아요.'
      : mutation.error
        ? '로그인하지 못했어요. 잠시 후 다시 시도해 주세요.'
        : null

  return (
    <div className="flex h-full items-center justify-center bg-soft p-6">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-line bg-bg p-10"
      >
        <h1 className="mb-1 text-2xl font-bold">로그인</h1>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold">이메일</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border border-line bg-bg px-3.5 outline-none focus:border-fg"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold">비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl border border-line bg-bg px-3.5 outline-none focus:border-fg"
          />
        </label>

        {errorMessage && (
          <p role="alert" className="text-[13px] text-danger">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="h-12 rounded-xl bg-accent font-bold text-accent-fg disabled:opacity-60"
        >
          {mutation.isPending ? '로그인 중…' : '로그인'}
        </button>

        <Link to="/signup" className="text-center text-[13px] text-sub hover:underline">
          계정이 없나요? 회원가입
        </Link>
      </form>
    </div>
  )
}
