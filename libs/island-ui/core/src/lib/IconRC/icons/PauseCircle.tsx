import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'
const SvgPauseCircle = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="pause-circle_svg__ionicon"
    viewBox="0 0 512 512"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm-32 272a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0zm96 0a16 16 0 0 1-32 0V192a16 16 0 0 1 32 0z" />
  </svg>
)
export default SvgPauseCircle
