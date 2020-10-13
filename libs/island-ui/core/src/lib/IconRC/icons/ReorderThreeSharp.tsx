import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReorderThreeSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reorder-three-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth={44}
        d="M102 256h308m-308-80h308M102 336h308"
      />
    </svg>
  )
}

export default SvgReorderThreeSharp
