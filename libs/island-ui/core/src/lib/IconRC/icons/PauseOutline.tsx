import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgPauseOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="pause-outline_svg__ionicon"
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
        d="M176 96h16v320h-16zm144 0h16v320h-16z"
      />
    </svg>
  )
}

export default SvgPauseOutline
