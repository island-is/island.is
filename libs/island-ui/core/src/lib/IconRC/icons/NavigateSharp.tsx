import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgNavigateSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="navigate-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M480 32L32 240h240v240L480 32z" />
    </svg>
  )
}

export default SvgNavigateSharp
