import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const Grid = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="grid_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x="48"
        y="48"
        width="176"
        height="176"
        rx="20"
        ry="20"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-width="32"
      />
      <rect
        x="288"
        y="48"
        width="176"
        height="176"
        rx="20"
        ry="20"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-width="32"
      />
      <rect
        x="48"
        y="288"
        width="176"
        height="176"
        rx="20"
        ry="20"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-width="32"
      />
      <rect
        x="288"
        y="288"
        width="176"
        height="176"
        rx="20"
        ry="20"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke-width="32"
      />
    </svg>
  )
}

export default Grid
