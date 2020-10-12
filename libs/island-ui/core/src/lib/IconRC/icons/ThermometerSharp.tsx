import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgThermometerSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="thermometer-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M320 291.24V80a64 64 0 10-128 0v211.24A113.39 113.39 0 00144 384a112 112 0 00224 0 113.39 113.39 0 00-48-92.76zM256 432a48 48 0 01-16-93.26V96h32v242.74A48 48 0 01256 432z" />
    </svg>
  )
}

export default SvgThermometerSharp
