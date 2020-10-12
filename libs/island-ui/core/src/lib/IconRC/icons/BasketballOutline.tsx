import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBasketballOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="basketball-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={256}
        cy={256}
        r={192}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        d="M432.94 255.05a192 192 0 01-176.31-180.7M255 433.61A192 192 0 0074.29 256.69m45.95-136.45l271.52 271.52m-271.52 0l271.52-271.52"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgBasketballOutline
