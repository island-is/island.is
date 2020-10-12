import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgVideocamOffSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="videocam-off-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M57.376 79.998l22.627-22.627 358.63 358.63-22.627 22.628zM32 112a16 16 0 00-16 16v256a16 16 0 0016 16h288a15.89 15.89 0 009.34-3l-285-285zm304 96v-80a16 16 0 00-16-16H179.63l245.44 245.44L496 400V112z" />
    </svg>
  )
}

export default SvgVideocamOffSharp
