import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBatteryDeadSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="battery-dead-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M32 144h400v224H32zm448 74.67v74.66"
      />
    </svg>
  )
}

export default SvgBatteryDeadSharp
