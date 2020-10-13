import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderTwoOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-two-outline_svg__ionicon"
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
        d="M112 304h288m-288-96h288"
      />
    </svg>
  )
}

export default SvgReorderTwoOutline
