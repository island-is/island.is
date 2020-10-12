import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgReaderOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="reader-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={96}
        y={48}
        width={320}
        height={416}
        rx={48}
        ry={48}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M176 128h160m-160 80h160m-160 80h80"
      />
    </svg>
  )
}

export default SvgReaderOutline
