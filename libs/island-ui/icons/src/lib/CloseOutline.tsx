import * as React from 'react'
import { SvgProps as SVGRProps, sizes } from '../IconSettings'

const SvgCloseOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="close-outline_svg__ionicon"
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
        d="M368 368L144 144m224 0L144 368"
      />
    </svg>
  )
}

export default SvgCloseOutline
