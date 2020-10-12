import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgStarHalf({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="star-half_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path d="M256 48v316L118 464l54-160-140-96h172l52-160z" />
    </svg>
  )
}

export default SvgStarHalf
