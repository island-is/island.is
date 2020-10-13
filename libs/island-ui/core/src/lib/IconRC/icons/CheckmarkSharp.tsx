import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCheckmarkSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="checkmark-sharp_svg__ionicon"
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
        strokeWidth={44}
        d="M416 128L192 384l-96-96"
      />
    </svg>
  )
}

export default SvgCheckmarkSharp
