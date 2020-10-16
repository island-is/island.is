import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgMove = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="move_svg__ionicon"
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
        d="M176 112l80-80 80 80m-80.02-80l.02 448m-80-80l80 80 80-80m64-224l80 80-80 80M112 176l-80 80 80 80m-80-80h448"
      />
    </svg>
  )
}

export default SvgMove
