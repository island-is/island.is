import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SwapVertical = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="time_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M464 208L352 96 240 208M352 113.13V416M48 304l112 112 112-112M160 398V96"
      />
    </svg>
  )
}

export default SwapVertical
