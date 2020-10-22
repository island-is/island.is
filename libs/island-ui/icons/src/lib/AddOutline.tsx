import * as React from 'react'
import { SvgProps as SVGRProps, sizes } from '../IconSettings'

const SvgAddOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="add-outline_svg__ionicon"
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
        strokeWidth={32}
        d="M256 112v288m144-144H112"
      />
    </svg>
  )
}

export default SvgAddOutline
