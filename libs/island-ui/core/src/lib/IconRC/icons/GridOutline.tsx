import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgGridOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="grid-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={48}
        y={48}
        width={176}
        height={176}
        rx={20}
        ry={20}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={288}
        y={48}
        width={176}
        height={176}
        rx={20}
        ry={20}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={48}
        y={288}
        width={176}
        height={176}
        rx={20}
        ry={20}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={288}
        y={288}
        width={176}
        height={176}
        rx={20}
        ry={20}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgGridOutline
