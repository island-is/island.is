import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBatteryHalf({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="battery-half_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={32}
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
      <rect
        x={85.69}
        y={198.93}
        width={154.31}
        height={114.13}
        rx={4}
        ry={4}
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
        d="M480 218.67v74.66"
      />
    </svg>
  )
}

export default SvgBatteryHalf
