import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgSendSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="send-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M16 464l480-208L16 48v160l320 48-320 48z" />
    </svg>
  )
}

export default SvgSendSharp
