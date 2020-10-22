import * as React from 'react'
import { SvgProps as SVGRProps, sizes } from '../IconSettings'

const SvgMenuOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="menu-outline_svg__ionicon"
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
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M80 160h352M80 256h352M80 352h352"
      />
    </svg>
  )
}

export default SvgMenuOutline
