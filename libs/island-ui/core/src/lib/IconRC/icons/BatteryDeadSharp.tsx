import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgBatteryDeadSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="battery-dead-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
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
