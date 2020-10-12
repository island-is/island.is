import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgStopSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="stop-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M80 80h352v352H80z" />
    </svg>
  )
}

export default SvgStopSharp
