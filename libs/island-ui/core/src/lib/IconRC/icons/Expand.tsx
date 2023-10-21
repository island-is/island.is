import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgExpand = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="expand_svg__ionicon"
    viewBox="0 0 512 512"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M432 320v112H320m101.8-10.23L304 304M80 192V80h112M90.2 90.23 208 208M320 80h112v112M421.77 90.2 304 208M192 432H80V320m10.23 101.8L208 304"
    />
  </svg>
)
export default SvgExpand
