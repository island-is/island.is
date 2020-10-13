import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPauseCircleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="pause-circle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-32 288h-32V176h32zm96 0h-32V176h32z" />
    </svg>
  )
}

export default SvgPauseCircleSharp
