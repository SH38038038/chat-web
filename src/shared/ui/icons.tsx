import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, strokeWidth = 1.7, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const PersonIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
  </Svg>
)

export const ChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
  </Svg>
)

export const OpenChatIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="10" r="5" />
    <circle cx="15" cy="14" r="5" />
  </Svg>
)

export const MoreIcon = (p: IconProps) => (
  <Svg strokeWidth={2.6} {...p}>
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </Svg>
)

export const SearchIcon = (p: IconProps) => (
  <Svg strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </Svg>
)

export const BackIcon = (p: IconProps) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
)
