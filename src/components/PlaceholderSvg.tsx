import { useId } from 'react'

type Props = {
  variant?: 'image' | 'logo'
  width?: number
  height?: number
  className?: string
  label?: string
}

export function PlaceholderSvg({
  variant = 'image',
  width,
  height,
  className = '',
  label = 'imagem aqui',
}: Props) {
  const gid = useId().replace(/:/g, '')
  const w = width ?? (variant === 'logo' ? 200 : 400)
  const h = height ?? (variant === 'logo' ? 56 : 240)
  const fontSize = variant === 'logo' ? 14 : 16
  const gradId = `ph-grad-${gid}`

  return (
    <svg
      className={className}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0ecf5" />
          <stop offset="100%" stopColor="#e8dff2" />
        </linearGradient>
      </defs>
      <rect
        width="100%"
        height="100%"
        rx={variant === 'logo' ? 8 : 12}
        fill={`url(#${gradId})`}
        stroke="#643291"
        strokeWidth="1.5"
        strokeDasharray="8 6"
        opacity={0.95}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#643291"
        fontSize={fontSize}
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
        opacity={0.85}
      >
        {label}
      </text>
    </svg>
  )
}
