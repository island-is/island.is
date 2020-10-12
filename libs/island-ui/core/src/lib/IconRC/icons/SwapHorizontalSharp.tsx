import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgSwapHorizontalSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="swap-horizontal-sharp_svg__ionicon"
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
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M304 48l112 112-112 112m94.87-112H96m112 304L96 352l112-112m-94 112h302"
      />
    </svg>
  )
}

export default SvgSwapHorizontalSharp
