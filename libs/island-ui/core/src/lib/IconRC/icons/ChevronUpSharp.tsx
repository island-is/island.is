import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgChevronUpSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="chevron-up-sharp_svg__ionicon"
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
        d="M112 328l144-144 144 144"
      />
    </svg>
  )
}

export default SvgChevronUpSharp
