import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgMoonOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="moon-outline_svg__ionicon"
      aria-labelledby={titleId}
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M10 8.5C10 6.58625 10.2819 4.64937 11 3C6.22312 5.07938 3 9.9575 3 15.5C3 22.9556 9.04437 29 16.5 29C22.0425 29 26.9206 25.7769 29 21C27.3506 21.7181 25.4138 22 23.5 22C16.0444 22 10 15.9556 10 8.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgMoonOutline
