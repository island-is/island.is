import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgTvSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="tv-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M488 384H24a8 8 0 01-8-8V88a8 8 0 018-8h464a8 8 0 018 8v288a8 8 0 01-8 8z" />
      <rect x={112} y={400} width={288} height={32} rx={4} ry={4} />
    </svg>
  )
}

export default SvgTvSharp
