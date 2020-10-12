import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgSwapVerticalOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="swap-vertical-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M464 208L352 96 240 208m112-94.87V416M48 304l112 112 112-112m-112 94V96"
      />
    </svg>
  )
}

export default SvgSwapVerticalOutline
