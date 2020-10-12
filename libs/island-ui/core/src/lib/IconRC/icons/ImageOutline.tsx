import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgImageOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="image-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={48}
        y={80}
        width={416}
        height={352}
        rx={48}
        ry={48}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle
        cx={336}
        cy={176}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352m176 80l123.34-123.34a32 32 0 0143.11-2L464 368"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgImageOutline
