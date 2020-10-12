import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgWatchOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="watch-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={112}
        y={112}
        width={288}
        height={288}
        rx={64}
        ry={64}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        d="M176 112V40a8 8 0 018-8h144a8 8 0 018 8v72m0 288v72a8 8 0 01-8 8H184a8 8 0 01-8-8v-72"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgWatchOutline
