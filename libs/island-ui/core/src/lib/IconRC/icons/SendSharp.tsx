import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgSendSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="send-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 464l480-208L16 48v160l320 48-320 48z" />
    </svg>
  )
}

export default SvgSendSharp
