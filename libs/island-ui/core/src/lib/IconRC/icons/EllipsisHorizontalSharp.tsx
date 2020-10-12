import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgEllipsisHorizontalSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="ellipsis-horizontal-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <circle cx={256} cy={256} r={48} />
      <circle cx={416} cy={256} r={48} />
      <circle cx={96} cy={256} r={48} />
    </svg>
  )
}

export default SvgEllipsisHorizontalSharp
