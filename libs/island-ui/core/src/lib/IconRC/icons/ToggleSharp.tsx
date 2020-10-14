import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgToggleSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="toggle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M368 112H144a144 144 0 000 288h224a144 144 0 000-288zm0 230a86 86 0 1186-86 85.88 85.88 0 01-86 86z" />
    </svg>
  )
}

export default SvgToggleSharp
