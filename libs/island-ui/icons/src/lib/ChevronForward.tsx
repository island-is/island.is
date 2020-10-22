import * as React from 'react'
import { SvgProps as SVGRProps, sizes } from '../IconSettings'

const SvgChevronForward = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="chevron-forward_svg__ionicon"
      viewBox="0 0 512 512"
      width={props.size ? sizes[props.size] : null}
      height={props.size ? sizes[props.size] : null}
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M184 112l144 144-144 144"
      />
    </svg>
  )
}

export default SvgChevronForward
