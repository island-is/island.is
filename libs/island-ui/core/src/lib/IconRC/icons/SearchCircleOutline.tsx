import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgSearchCircleOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="search-circle-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M256 80a176 176 0 10176 176A176 176 0 00256 80z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        d="M232 160a72 72 0 1072 72 72 72 0 00-72-72z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M283.64 283.64L336 336"
      />
    </svg>
  )
}

export default SvgSearchCircleOutline
