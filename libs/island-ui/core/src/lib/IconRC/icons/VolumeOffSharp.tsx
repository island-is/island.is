import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgVolumeOffSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="volume-off-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M237.65 176.1H144v159.8h93.65L368 440V72L237.65 176.1z" />
    </svg>
  )
}

export default SvgVolumeOffSharp
