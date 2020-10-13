import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgResize = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="resize_svg__ionicon"
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
        d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"
      />
    </svg>
  )
}

export default SvgResize
