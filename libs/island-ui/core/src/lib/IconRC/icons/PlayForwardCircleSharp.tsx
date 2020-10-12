import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPlayForwardCircleSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="play-forward-circle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm8 295.25v-71.44l-120 72.32V167.71l120 72.48V168l136.53 88z" />
    </svg>
  )
}

export default SvgPlayForwardCircleSharp
