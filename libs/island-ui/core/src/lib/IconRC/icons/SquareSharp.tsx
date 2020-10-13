import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgSquareSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="square-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 48h416v416H48z" />
    </svg>
  )
}

export default SvgSquareSharp
