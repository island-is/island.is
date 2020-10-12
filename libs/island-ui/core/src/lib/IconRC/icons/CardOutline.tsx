import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCardOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="card-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={48}
        y={96}
        width={416}
        height={320}
        rx={56}
        ry={56}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={60}
        d="M48 192h416M128 300h48v20h-48z"
      />
    </svg>
  )
}

export default SvgCardOutline
