import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'
const SvgPauseCircleOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="pause-circle-outline_svg__ionicon"
    viewBox="0 0 512 512"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="none"
      stroke="currentColor"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M208 192v128m96-128v128"
    />
  </svg>
)
export default SvgPauseCircleOutline
