import { cn } from '@/shared/lib/cn'

interface AvatarProps {
  src?: string | null
  name: string
  size?: number
  className?: string
}

/** 둥근 사각형 프로필 이미지. 사진이 없으면 이름 첫 글자 */
export function Avatar({ src, name, size = 44, className }: AvatarProps) {
  const radius = Math.round(size * 0.36)
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center overflow-hidden bg-act text-sub', className)}
      style={{ width: size, height: size, borderRadius: radius }}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span className="text-base font-bold" aria-hidden="true">
          {name.slice(0, 1)}
        </span>
      )}
    </div>
  )
}
