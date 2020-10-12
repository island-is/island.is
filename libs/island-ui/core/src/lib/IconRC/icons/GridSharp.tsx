import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgGridSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="grid-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M240 240H32V32h208zm240 0H272V32h208zM240 480H32V272h208zm240 0H272V272h208z" />
    </svg>
  )
}

export default SvgGridSharp
