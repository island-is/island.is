import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const GridView = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 2H2v2h2V2zM10 2H8v2h2V2zM16 2h-2v2h2V2zM22 2h-2v2h2V2zM4 8H2v2h2V8zM10 8H8v2h2V8zM16 8h-2v2h2V8zM22 8h-2v2h2V8zM4 14H2v2h2v-2zM10 14H8v2h2v-2zM16 14h-2v2h2v-2zM22 14h-2v2h2v-2zM4 20H2v2h2v-2zM10 20H8v2h2v-2zM16 20h-2v2h2v-2zM22 20h-2v2h2v-2z"
      ></path>
    </svg>
  )
}

export default GridView
