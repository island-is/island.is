import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgFilterCircleOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="filter-circle-outline_svg__ionicon"
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
        strokeWidth={32}
        strokeMiterlimit={10}
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={32}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M144 208h224m-192 64h160m-112 64h64"
      />
    </svg>
  )
}

export default SvgFilterCircleOutline
