import * as React from 'react'
import { SvgProps as SVGRProps, sizes } from '../IconSettings'

const SvgMenu = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="menu_svg__ionicon"
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
        strokeWidth={48}
        d="M88 152h336M88 256h336M88 360h336"
      />
    </svg>
  )
}

export default SvgMenu
