import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretForwardSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-forward-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M144 448l224-192L144 64v384z" />
    </svg>
  )
}

export default SvgCaretForwardSharp
