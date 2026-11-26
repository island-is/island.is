import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgScaleOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="scale-outline_svg__ionicon"
      aria-labelledby={titleId}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g
        transform="translate(0.796 2.388)"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11.2 0.86V4.04M2.45 4.04H19.96" />
        <path d="M0.86 13.89 5.23 4.04 9.61 13.89M0.86 13.89H9.61A4.375 4.375 0 0 1 0.86 13.89" />
        <path d="M12.8 13.89 17.17 4.04 21.55 13.89M12.8 13.89H21.55A4.375 4.375 0 0 1 12.8 13.89" />
      </g>
    </svg>
  )
}

export default SvgScaleOutline
