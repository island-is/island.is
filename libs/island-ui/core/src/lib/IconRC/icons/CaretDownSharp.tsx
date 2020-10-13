import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretDownSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-down-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M64 144l192 224 192-224H64z" />
    </svg>
  )
}

export default SvgCaretDownSharp
