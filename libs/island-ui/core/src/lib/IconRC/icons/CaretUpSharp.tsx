import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretUpSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-up-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M448 368L256 144 64 368h384z" />
    </svg>
  )
}

export default SvgCaretUpSharp
