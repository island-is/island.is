import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBarChartSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bar-chart-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 496H16V16h32v448h448v32z" />
      <path d="M192 432H80V208h112zm144 0H224V160h112zm143.64 0h-112V96h112z" />
    </svg>
  )
}

export default SvgBarChartSharp
