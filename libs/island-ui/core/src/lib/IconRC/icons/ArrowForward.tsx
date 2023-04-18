import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgArrowForward = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ArrowForward_svg__ionicon"
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
        d="M268 112l144 144-144 144m124-144H100"
      />
    </svg>
  )
}

export default SvgArrowForward
