import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgEnterSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="enter-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M160 240h147.37l-64-64L266 153.37 368.63 256 266 358.63 243.37 336l64-64H160v148a12 12 0 0012 12h296a12 12 0 0012-12V92a12 12 0 00-12-12H172a12 12 0 00-12 12zm-128 0h128v32H32z" />
    </svg>
  )
}

export default SvgEnterSharp
