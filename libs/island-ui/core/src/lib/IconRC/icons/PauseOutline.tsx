import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'
const SvgPauseOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="pause-outline_svg__ionicon"
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
      d="M176 96h16v320h-16zm144 0h16v320h-16z"
    />
  </svg>
)
export default SvgPauseOutline
