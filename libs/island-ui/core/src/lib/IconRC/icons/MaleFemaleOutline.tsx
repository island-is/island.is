import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgMaleFemaleOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="male-female-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={216}
        cy={200}
        r={136}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M216 352v128m56-64H160m272-304V32h-80m-16.72 96.72L432 32"
      />
    </svg>
  )
}

export default SvgMaleFemaleOutline
