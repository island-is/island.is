import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgFlashSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="flash-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M432 208H288l32-192L80 304h144l-32 192z" />
    </svg>
  )
}

export default SvgFlashSharp
