import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgExitSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="exit-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M335.69 272h-161v-32h161V92a12 12 0 00-12-12h-280a12 12 0 00-12 12v328a12 12 0 0012 12h280a12 12 0 0012-12zm83.37 0l-64 64 22.63 22.63L480.31 256 377.69 153.37 355.06 176l64 64h-83.37v32h83.37z" />
    </svg>
  )
}

export default SvgExitSharp
