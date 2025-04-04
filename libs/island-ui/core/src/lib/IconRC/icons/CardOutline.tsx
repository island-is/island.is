import * as React from 'react'

import type { SvgProps as SVGRProps } from '../types'

const SvgCardOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="card-outline_svg__ionicon"
      viewBox="0 0 24 24"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke={props.color}
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M.75 6h19.5M3.375 1.5h14.25a2.625 2.625 0 0 1 2.625 2.625v9.75a2.625 2.625 0 0 1-2.625 2.625H3.375A2.625 2.625 0 0 1 .75 13.875v-9.75A2.625 2.625 0 0 1 3.375 1.5ZM4.5 11.063h2.25V12H4.5v-.938Z"
      />
    </svg>
  )
}

export default SvgCardOutline
