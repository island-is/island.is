import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgShuffle({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="shuffle_svg__ionicon"
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
        strokeWidth={32}
        d="M400 304l48 48-48 48m0-288l48 48-48 48M64 352h85.19a80 80 0 0066.56-35.62L256 256"
      />
      <path
        d="M64 160h85.19a80 80 0 0166.56 35.62l80.5 120.76A80 80 0 00362.81 352H416m0-192h-53.19a80 80 0 00-66.56 35.62L288 208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgShuffle
