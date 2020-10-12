import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgVolumeHighSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="volume-high-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M320 320c9.74-19.38 16-40.84 16-64 0-23.48-6-44.42-16-64m48 176c19.48-33.92 32-64.06 32-112s-12-77.74-32-112m48 272c30-46 48-91.43 48-160s-18-113-48-160"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path d="M125.65 176.1H32v159.8h93.65L256 440V72L125.65 176.1z" />
    </svg>
  )
}

export default SvgVolumeHighSharp
