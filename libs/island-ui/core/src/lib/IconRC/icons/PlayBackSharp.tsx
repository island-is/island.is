import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPlayBackSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="play-back-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 400L256 256l240-144v288zm-240 0L16 256l240-144v288z" />
    </svg>
  )
}

export default SvgPlayBackSharp
