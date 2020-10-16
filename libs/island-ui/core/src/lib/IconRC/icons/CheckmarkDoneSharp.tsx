import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCheckmarkDoneSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="checkmark-done-sharp_svg__ionicon"
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
        d="M465 127L241 384l-92-92m-9 93l-93-93m316-165L236 273"
      />
    </svg>
  )
}

export default SvgCheckmarkDoneSharp
