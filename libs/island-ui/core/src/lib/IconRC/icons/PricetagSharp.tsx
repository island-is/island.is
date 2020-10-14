import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPricetagSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="pricetag-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M304 32L16 320l176 176 288-288V32zm80 128a32 32 0 1132-32 32 32 0 01-32 32z" />
    </svg>
  )
}

export default SvgPricetagSharp
