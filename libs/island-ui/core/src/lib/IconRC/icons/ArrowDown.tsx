import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgArrowDown = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="arrow-down_svg__ionicon"
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
        strokeWidth={48}
        d="M112 268l144 144 144-144M256 392V100"
      />
    </svg>
  )
}

export default SvgArrowDown
