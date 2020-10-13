import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgUnlinkOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="unlink-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M208 352h-64a96 96 0 010-192h64m96 0h64a96 96 0 010 192h-64"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={36}
      />
    </svg>
  )
}

export default SvgUnlinkOutline
