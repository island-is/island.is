import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTriangleOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="triangle-outline_svg__ionicon"
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
        strokeWidth={32}
        d="M48 448L256 64l208 384H48z"
      />
    </svg>
  )
}

export default SvgTriangleOutline
