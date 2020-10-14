import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgArrowUpSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="arrow-up-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={48}
        d="M112 244l144-144 144 144M256 120v292"
      />
    </svg>
  )
}

export default SvgArrowUpSharp
