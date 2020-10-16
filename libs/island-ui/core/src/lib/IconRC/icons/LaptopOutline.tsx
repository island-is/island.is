import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgLaptopOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="laptop-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={48}
        y={96}
        width={416}
        height={304}
        rx={32.14}
        ry={32.14}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M16 416h480"
      />
    </svg>
  )
}

export default SvgLaptopOutline
