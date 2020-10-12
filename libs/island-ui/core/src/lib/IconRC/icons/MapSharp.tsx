import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgMapSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="map-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M327.71 130.93L184 39 32 144v336l152.29-98.93L328 473l152-105V32zM312 421l-112-72V91l112 72z" />
    </svg>
  )
}

export default SvgMapSharp
