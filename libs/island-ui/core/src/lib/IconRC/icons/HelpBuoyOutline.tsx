import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgHelpBuoyOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="help-buoy-outline_svg__ionicon"
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle
        cx={256}
        cy={256}
        r={80}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M208 54l8 132m80 0l8-132m-96 404l8-132m80 0l8 132m154-250l-132 8m0 80l132 8M54 208l132 8m0 80l-132 8"
      />
    </svg>
  )
}

export default SvgHelpBuoyOutline
