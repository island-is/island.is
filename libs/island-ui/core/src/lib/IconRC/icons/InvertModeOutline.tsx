import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgInvertModeOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="invert-mode-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
        cx={256}
        cy={256}
        r={208}
      />
      <path d="M256 176v160a80 80 0 010-160zm0-128v128a80 80 0 010 160v128c114.88 0 208-93.12 208-208S370.88 48 256 48z" />
    </svg>
  )
}

export default SvgInvertModeOutline
