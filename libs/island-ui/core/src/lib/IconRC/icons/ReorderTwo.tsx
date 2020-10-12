import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgReorderTwo({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="reorder-two_svg__ionicon"
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
        strokeWidth={44}
        d="M118 304h276m-276-96h276"
      />
    </svg>
  )
}

export default SvgReorderTwo
