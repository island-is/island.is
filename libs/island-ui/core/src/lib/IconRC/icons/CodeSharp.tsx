import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCodeSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="code-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M161.98 397.63L0 256l161.98-141.63 27.65 31.61L64 256l125.63 110.02-27.65 31.61zm188.04 0l-27.65-31.61L448 256 322.37 145.98l27.65-31.61L512 256 350.02 397.63z" />
    </svg>
  )
}

export default SvgCodeSharp
