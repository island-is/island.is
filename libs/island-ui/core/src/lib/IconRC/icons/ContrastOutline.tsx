import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgContrastOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="contrast-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={256}
        cy={256}
        r={208}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path d="M256 464c-114.88 0-208-93.12-208-208S141.12 48 256 48z" />
    </svg>
  )
}

export default SvgContrastOutline
