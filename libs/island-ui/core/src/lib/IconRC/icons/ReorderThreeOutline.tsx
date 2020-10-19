import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderThreeOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-three-outline_svg__ionicon"
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
        d="M96 256h320M96 176h320M96 336h320"
      />
    </svg>
  )
}

export default SvgReorderThreeOutline
