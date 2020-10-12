import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgStopOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="stop-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={96}
        y={96}
        width={320}
        height={320}
        rx={24}
        ry={24}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgStopOutline
