import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgArrowForwardSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="arrow-forward-sharp_svg__ionicon"
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
        strokeWidth={48}
        d="M268 112l144 144-144 144m124-144H100"
      />
    </svg>
  )
}

export default SvgArrowForwardSharp
