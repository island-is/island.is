import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgRefreshSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="refresh-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M320 146s24.36-12-64-12a160 160 0 10160 160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M256 58l80 80-80 80"
      />
    </svg>
  )
}

export default SvgRefreshSharp
