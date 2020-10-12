import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCutOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="cut-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        cx={104}
        cy={152}
        r={56}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <circle
        cx={104}
        cy={360}
        r={56}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        d="M157 175l-11 15 37 15s3.46-6.42 7-10z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        d="M154.17 334.43L460 162c-2.5-6.7-28-12-64-4-29.12 6.47-121.16 29.05-159.16 56.05C205.85 236.06 227 272 192 298c-25.61 19-44.43 22.82-44.43 22.82zm190.3-56.19L295 306.67c14.23 6.74 65.54 33.27 117 36.33 14.92.89 30 .39 39-6z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <circle
        cx={256}
        cy={240}
        r={32}
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgCutOutline
