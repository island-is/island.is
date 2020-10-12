import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTriangleSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="triangle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 32L20 464h472L256 32z" />
    </svg>
  )
}

export default SvgTriangleSharp
