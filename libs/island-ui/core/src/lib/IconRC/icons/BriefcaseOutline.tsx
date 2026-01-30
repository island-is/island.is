import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgBriefcaseOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="briefcase-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      <rect
        x="32"
        y="128"
        width="448"
        height="320"
        rx="48"
        ry="48"
        fill="none"
        stroke="currentColor"
        stroke-linejoin="round"
        stroke-width="32"
      />
      <path
        d="M144 128V96a32 32 0 0 1 32-32h160a32 32 0 0 1 32 32v32m112 112H32m288 0v24a8 8 0 0 1-8 8H200a8 8 0 0 1-8-8v-24"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      />
    </svg>
  )
}

export default SvgBriefcaseOutline
