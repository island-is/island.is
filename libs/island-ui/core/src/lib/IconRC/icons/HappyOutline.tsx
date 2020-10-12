import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgHappyOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="happy-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx={184} cy={232} r={24} />
      <path d="M256.05 384c-45.42 0-83.62-29.53-95.71-69.83a8 8 0 017.82-10.17h175.69a8 8 0 017.82 10.17c-11.99 40.3-50.2 69.83-95.62 69.83z" />
      <circle cx={328} cy={232} r={24} />
      <circle
        cx={256}
        cy={256}
        r={208}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgHappyOutline
