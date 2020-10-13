import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderThree = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-three_svg__ionicon"
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
        strokeWidth={44}
        d="M102 256h308m-308-80h308M102 336h308"
      />
    </svg>
  )
}

export default SvgReorderThree
