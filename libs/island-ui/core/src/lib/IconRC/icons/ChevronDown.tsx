import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgChevronDown = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ChevronDown_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M112 184l144 144 144-144"
      />
    </svg>
  )
}

export default SvgChevronDown
