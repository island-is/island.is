import * as React from 'react'

import type { SvgProps as SVGRProps } from '../types'

const SvgBank = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bank_svg__ionicon"
      viewBox="0 0 24 24"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g clip-path="url(#a)">
        <path d="M22.816 19.226a.75.75 0 0 1-.75.75h-21a.75.75 0 1 1 0-1.5h21a.75.75 0 0 1 .75.75ZM1.095 8.93a.75.75 0 0 1 .329-.844l9.75-6a.75.75 0 0 1 .785 0l9.75 6a.75.75 0 0 1-.393 1.39h-2.25v6h1.5a.75.75 0 1 1 0 1.5h-18a.75.75 0 1 1 0-1.5h1.5v-6h-2.25a.75.75 0 0 1-.721-.546Zm11.971 5.796a.75.75 0 1 0 1.5 0v-4.5a.75.75 0 1 0-1.5 0v4.5Zm-4.5 0a.75.75 0 1 0 1.5 0v-4.5a.75.75 0 0 0-1.5 0v4.5Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SvgBank
