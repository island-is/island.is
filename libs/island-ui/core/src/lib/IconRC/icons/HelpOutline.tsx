import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgHelpOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="help-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M160 164s1.44-33 33.54-59.46C212.6 88.83 235.49 84.28 256 84c18.73-.23 35.47 2.94 45.48 7.82C318.59 100.2 352 120.6 352 164c0 45.67-29.18 66.37-62.35 89.18S248 298.36 248 324"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={40}
      />
      <circle cx={248} cy={399.99} r={32} />
    </svg>
  )
}

export default SvgHelpOutline
