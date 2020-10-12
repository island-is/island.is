import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgWalkOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="walk-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M314.21 482.32l-56.77-114.74-44.89-57.39a72.82 72.82 0 01-10.13-37.05V144h15.67a40.22 40.22 0 0140.23 40.22v183.36M127.9 293.05v-74.52S165.16 144 202.42 144M370.1 274.42L304 231M170.53 478.36L224 400"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle
        cx={258.32}
        cy={69.48}
        r={37.26}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgWalkOutline
