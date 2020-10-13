import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretBackSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-back-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M368 64L144 256l224 192V64z" />
    </svg>
  )
}

export default SvgCaretBackSharp
