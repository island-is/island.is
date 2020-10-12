import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgAlbumsOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="albums-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={64}
        y={176}
        width={384}
        height={256}
        rx={28.87}
        ry={28.87}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M144 80h224m-256 48h288"
      />
    </svg>
  )
}

export default SvgAlbumsOutline
