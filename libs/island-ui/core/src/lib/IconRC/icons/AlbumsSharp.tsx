import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgAlbumsSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="albums-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M128 64h256v32H128zm-32 48h320v32H96zm368 336H48V160h416z" />
    </svg>
  )
}

export default SvgAlbumsSharp
