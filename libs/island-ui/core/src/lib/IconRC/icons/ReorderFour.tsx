import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderFour = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-four_svg__ionicon"
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
        d="M102 304h308m-308-96h308m-308-96h308M102 400h308"
      />
    </svg>
  )
}

export default SvgReorderFour
