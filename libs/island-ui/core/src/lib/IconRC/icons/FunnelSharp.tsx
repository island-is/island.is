import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgFunnelSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="funnel-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M0 48l192 240v128l128 48V288L512 48H0z" />
    </svg>
  )
}

export default SvgFunnelSharp
