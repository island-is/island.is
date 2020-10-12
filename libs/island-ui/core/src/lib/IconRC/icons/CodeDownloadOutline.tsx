import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCodeDownloadOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="code-download-outline_svg__ionicon"
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
        d="M160 368L32 256l128-112m192 224l128-112-128-112M192 288.1l64 63.9 64-63.9M256 160v176.03"
      />
    </svg>
  )
}

export default SvgCodeDownloadOutline
