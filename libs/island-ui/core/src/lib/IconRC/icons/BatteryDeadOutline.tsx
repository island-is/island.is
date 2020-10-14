import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBatteryDeadOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="battery-dead-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={31}
        y={144}
        width={400}
        height={224}
        rx={45.7}
        ry={45.7}
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M479 218.67v74.66"
      />
    </svg>
  )
}

export default SvgBatteryDeadOutline
