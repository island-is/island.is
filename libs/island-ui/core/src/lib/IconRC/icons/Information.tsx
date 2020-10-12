import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgInformation({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="information_svg__ionicon"
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
        strokeWidth={40}
        d="M196 220h64v172"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={40}
        d="M187 396h138"
      />
      <path d="M256 160a32 32 0 1132-32 32 32 0 01-32 32z" />
    </svg>
  )
}

export default SvgInformation
