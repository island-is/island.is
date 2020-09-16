import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPlayForwardSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="play-forward-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 400l240-144L16 112v288zm240 0l240-144-240-144v288z" />
    </svg>
  )
}

export default SvgPlayForwardSharp
