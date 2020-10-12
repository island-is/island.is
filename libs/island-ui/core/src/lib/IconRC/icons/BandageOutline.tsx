import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgBandageOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="bandage-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect
        x={-24.43}
        y={167.88}
        width={560.87}
        height={176.25}
        rx={88.12}
        ry={88.12}
        transform="rotate(-45 256 256.002)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <rect
        x={169.41}
        y={156.59}
        width={176}
        height={196}
        rx={32}
        ry={32}
        transform="rotate(45 257.409 254.582)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle cx={256} cy={208} r={16} />
      <circle cx={304} cy={256} r={16} />
      <circle cx={208} cy={256} r={16} />
      <circle cx={256} cy={304} r={16} />
    </svg>
  )
}

export default SvgBandageOutline
