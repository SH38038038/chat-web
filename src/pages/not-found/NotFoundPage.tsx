import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className="text-xl font-bold">페이지를 찾을 수 없어요</h1>
      <Link to="/" className="font-bold text-sub underline">
        처음으로
      </Link>
    </div>
  )
}
