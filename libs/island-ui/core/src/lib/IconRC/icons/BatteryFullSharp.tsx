import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBatteryFullSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="battery-full-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M17 384h432V128H17zm32-224h368v192H49z" />
      <path d="M70.69 182.94h324.63v146.13H70.69zM465 202.67h32v106.67h-32z" />
    </svg>
  )
}

export default SvgBatteryFullSharp
