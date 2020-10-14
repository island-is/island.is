import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgChevronUpCircleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="chevron-up-circle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zm96 270.63l-96-96-96 96L137.37 296 256 177.37 374.63 296z" />
    </svg>
  )
}

export default SvgChevronUpCircleSharp
