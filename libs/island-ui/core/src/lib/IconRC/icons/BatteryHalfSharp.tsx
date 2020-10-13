import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBatteryHalfSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="battery-half-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M17 384h432V128H17zm32-224h368v192H49z" />
      <path d="M70.69 182.92H256v146.16H70.69zM465 202.67h32v106.67h-32z" />
    </svg>
  )
}

export default SvgBatteryHalfSharp
