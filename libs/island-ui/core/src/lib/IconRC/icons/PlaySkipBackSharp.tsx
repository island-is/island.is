import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPlaySkipBackSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="play-skip-back-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M143.47 64v163.52L416 64v384L143.47 284.48V448H96V64h47.47z" />
    </svg>
  )
}

export default SvgPlaySkipBackSharp
