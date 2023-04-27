import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgCellularOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="cellular-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={416}
        y={96}
        width={64}
        height={320}
        rx={8}
        ry={8}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={288}
        y={176}
        width={64}
        height={240}
        rx={8}
        ry={8}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={160}
        y={240}
        width={64}
        height={176}
        rx={8}
        ry={8}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={32}
        y={304}
        width={64}
        height={112}
        rx={8}
        ry={8}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgCellularOutline
