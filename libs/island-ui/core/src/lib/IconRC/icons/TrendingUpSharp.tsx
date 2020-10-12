import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTrendingUpSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="trending-up-sharp_svg__ionicon"
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
        d="M352 144h112v112"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M48 368l144-144 96 96 160-160"
      />
    </svg>
  )
}

export default SvgTrendingUpSharp
