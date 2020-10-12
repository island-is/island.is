import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgChevronBack({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="chevron-back_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
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
        d="M328 112L184 256l144 144"
      />
    </svg>
  )
}

export default SvgChevronBack
