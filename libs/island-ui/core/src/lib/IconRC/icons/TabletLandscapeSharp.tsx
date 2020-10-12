import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTabletLandscapeSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="tablet-landscape-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M0 82v348a18 18 0 0018 18h476a18 18 0 0018-18V82a18 18 0 00-18-18H18A18 18 0 000 82zm448 330H64V100h384z" />
    </svg>
  )
}

export default SvgTabletLandscapeSharp
