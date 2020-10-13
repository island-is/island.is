import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgInformationSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="information-sharp_svg__ionicon"
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
        strokeWidth={40}
        d="M196 220h64v172m-73 4h138"
      />
      <path d="M256 160a32 32 0 1132-32 32 32 0 01-32 32z" />
    </svg>
  )
}

export default SvgInformationSharp
