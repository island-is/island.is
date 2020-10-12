import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgFlashOffSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="flash-off-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M63.998 86.004l21.998-21.998L448 426.01l-21.998 21.998zM80 304h144l-32 192 108.18-129.82-148.36-148.36L80 304zm352-96H288l32-192-108.18 129.82 148.36 148.36L432 208z" />
    </svg>
  )
}

export default SvgFlashOffSharp
