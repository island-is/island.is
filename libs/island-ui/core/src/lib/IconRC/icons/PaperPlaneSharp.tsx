import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPaperPlaneSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="paper-plane-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 16L15.88 208 195 289 448 64 223 317l81 179L496 16z" />
    </svg>
  )
}

export default SvgPaperPlaneSharp
