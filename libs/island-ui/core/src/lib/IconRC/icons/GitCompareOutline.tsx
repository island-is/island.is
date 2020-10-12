import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgGitCompareOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="git-compare-outline_svg__ionicon"
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
        d="M304 160l-64-64 64-64m-97 320l64 64-64 64"
      />
      <circle
        cx={112}
        cy={96}
        r={48}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle
        cx={400}
        cy={416}
        r={48}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        d="M256 96h84a60 60 0 0160 60v212m-145 48h-84a60 60 0 01-60-60V144"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgGitCompareOutline
