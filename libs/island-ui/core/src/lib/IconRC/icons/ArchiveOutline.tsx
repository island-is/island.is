import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgArchiveOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      aria-labelledby={titleId}
      className="archive-outline_svg__ionicon"
      viewBox="0 0 512 512"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M80 152v256a40.12 40.12 0 0040 40h272a40.12 40.12 0 0040-40V152"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <rect
        x="48"
        y="64"
        width="416"
        height="80"
        rx="28"
        ry="28"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M320 304l-64 64-64-64M256 345.89V224"
      />
    </svg>
  )
}

export default SvgArchiveOutline
