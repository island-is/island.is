import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderFourOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-four-outline_svg__ionicon"
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
        d="M96 304h320M96 208h320M96 112h320M96 400h320"
      />
    </svg>
  )
}

export default SvgReorderFourOutline
