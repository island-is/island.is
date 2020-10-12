import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgArchiveSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="archive-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect x={32} y={48} width={448} height={80} rx={12} ry={12} />
      <path d="M64 160v280a24 24 0 0024 24h336a24 24 0 0024-24V160zm192 230.63L169.32 304 192 281.32l48 48.05V208h32v121.37l48.07-48.07 22.61 22.64z" />
    </svg>
  )
}

export default SvgArchiveSharp
