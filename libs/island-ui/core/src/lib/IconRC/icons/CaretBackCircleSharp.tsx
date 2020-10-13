import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretBackCircleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-back-circle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 256c0 114.87 93.13 208 208 208s208-93.13 208-208S370.87 48 256 48 48 141.13 48 256zm252 108.27L169.91 256 300 147.73z" />
    </svg>
  )
}

export default SvgCaretBackCircleSharp
