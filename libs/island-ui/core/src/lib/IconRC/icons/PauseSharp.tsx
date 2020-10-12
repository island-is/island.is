import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPauseSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="pause-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M224 432h-80V80h80zm144 0h-80V80h80z" />
    </svg>
  )
}

export default SvgPauseSharp
