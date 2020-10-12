import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBan({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="ban_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={48}
        cx={256}
        cy={256}
        r={200}
      />
      <path
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={48}
        d="M114.58 114.58l282.84 282.84"
      />
    </svg>
  )
}

export default SvgBan
