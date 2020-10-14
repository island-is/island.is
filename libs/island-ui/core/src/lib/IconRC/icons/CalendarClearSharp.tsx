import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCalendarClearSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="calendar-clear-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M32 456a24 24 0 0024 24h400a24 24 0 0024-24V192H32zM480 87.77A23.8 23.8 0 00456 64h-55.92V32h-48v32H159.92V32h-48v32H56a23.8 23.8 0 00-24 23.77V144h448z" />
    </svg>
  )
}

export default SvgCalendarClearSharp
