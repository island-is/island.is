import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPushSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="push-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M272 352V204.63l64 64L358.63 246 256 143.37 153.37 246 176 268.63l64-64V352H92a12 12 0 01-12-12V44a12 12 0 0112-12h328a12 12 0 0112 12v296a12 12 0 01-12 12zm-32 0h32v128h-32z" />
    </svg>
  )
}

export default SvgPushSharp
