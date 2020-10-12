import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgArrowRedoOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="arrow-redo-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M448 256L272 88v96C103.57 184 64 304.77 64 424c48.61-62.24 91.6-96 208-96v96z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgArrowRedoOutline
