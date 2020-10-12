import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgPlaySharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="play-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M96 448l320-192L96 64v384z" />
    </svg>
  )
}

export default SvgPlaySharp
