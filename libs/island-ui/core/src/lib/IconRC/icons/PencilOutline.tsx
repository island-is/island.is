import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgPencilOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="pencil-outline_svg__ionicon"
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
        d="M364.13 125.25L87 403l-23 45 44.99-23 277.76-277.13-22.62-22.62zm56.56-56.56l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 000-22.62h0a16 16 0 00-22.62 0z"
      />
    </svg>
  )
}

export default SvgPencilOutline
