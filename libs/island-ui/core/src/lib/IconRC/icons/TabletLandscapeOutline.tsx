import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgTabletLandscapeOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="tablet-landscape-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={80}
        y={16}
        width={352}
        height={480}
        rx={48}
        ry={48}
        transform="rotate(-90 256 256)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgTabletLandscapeOutline
