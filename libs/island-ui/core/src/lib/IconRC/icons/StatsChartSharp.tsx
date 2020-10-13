import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgStatsChartSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="stats-chart-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M128 496H48V304h80zm224 0h-80V208h80zm112 0h-80V96h80zm-224 0h-80V16h80z" />
    </svg>
  )
}

export default SvgStatsChartSharp
