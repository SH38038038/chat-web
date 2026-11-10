import { useMutation } from '@tanstack/react-query'
import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { Link, useNavigate } from 'react-router'
import { signup, type SignupRequest } from '@/features/auth/api/authApi'
import { ApiError } from '@/shared/api/http'

const EMPTY: SignupRequest = { email: '', phoneNumber: '', password: '', name: '', handle: '' }

export function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [localError, setLocalError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => navigate('/login', { replace: true }),
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() && !form.phoneNumber.trim()) {
      setLocalError('이메일과 전화번호 중 하나는 입력해 주세요.')
      return
    }
    setLocalError(null)
    mutation.mutate(form)
  }

  // ponytail: 서버가 중복 시 본문 없는 500을 주므로 원인을 구분할 수 없음. 서버가 409+메시지를 주면 그대로 노출
  const serverError =
    mutation.error instanceof ApiError && mutation.error.status === 400
      ? '입력값을 다시 확인해 주세요.'
      : mutation.error
        ? '가입하지 못했어요. 이미 사용 중인 이메일·전화번호·태그인지 확인해 주세요.'
        : null
  const errorMessage = localError ?? serverError

  const field = (key: keyof SignupRequest) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  return (
    <div className="flex h-full items-center justify-center bg-soft p-6">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-line bg-bg p-10"
      >
        <h1 className="mb-1 text-2xl font-bold">회원가입</h1>

        <Field
          label="이메일"
          type="email"
          autoComplete="email"
          maxLength={50}
          {...field('email')}
        />
        <Field
          label="전화번호"
          type="tel"
          autoComplete="tel"
          maxLength={13}
          placeholder="010-0000-0000"
          {...field('phoneNumber')}
        />
        <p className="-mt-2 text-[12px] text-sub">이메일과 전화번호 중 하나는 필수예요.</p>
        <Field
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          {...field('password')}
        />
        <Field label="이름" autoComplete="name" required maxLength={20} {...field('name')} />
        <Field label="태그" required maxLength={20} {...field('handle')} />

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
          {mutation.isPending ? '가입 중…' : '가입하기'}
        </button>

        <Link to="/login" className="text-center text-[13px] text-sub hover:underline">
          이미 계정이 있나요? 로그인
        </Link>
      </form>
    </div>
  )
}

function Field({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-bold">{label}</span>
      <input
        {...input}
        className="h-12 rounded-xl border border-line bg-bg px-3.5 outline-none focus:border-fg"
      />
    </label>
  )
}
