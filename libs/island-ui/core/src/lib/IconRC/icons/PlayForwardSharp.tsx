import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPlayForwardSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="play-forward-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 400l240-144L16 112v288zm240 0l240-144-240-144v288z" />
    </svg>
  )
}

export default SvgPlayForwardSharp
