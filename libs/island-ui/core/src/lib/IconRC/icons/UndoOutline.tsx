import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgUndoOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="undo-outline_svg__ionicon"
      viewBox="0 0 20 20"
      {...props}
      fill="none"
      aria-labelledby={titleId}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g id="arrow-undo-outline 1">
        <path
          id="Vector"
          d="M9.375 16.5625V12.8125C13.9219 12.8125 15.6012 14.1312 17.5 16.5625C17.5 11.9051 15.9543 7.1875 9.375 7.1875V3.4375L2.5 10L9.375 16.5625Z"
          stroke="currentColor"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default SvgUndoOutline
