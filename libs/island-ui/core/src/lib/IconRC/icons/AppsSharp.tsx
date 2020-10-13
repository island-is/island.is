import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgAppsSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="apps-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect x={48} y={48} width={112} height={112} rx={8} ry={8} />
      <rect x={200} y={48} width={112} height={112} rx={8} ry={8} />
      <rect x={352} y={48} width={112} height={112} rx={8} ry={8} />
      <rect x={48} y={200} width={112} height={112} rx={8} ry={8} />
      <rect x={200} y={200} width={112} height={112} rx={8} ry={8} />
      <rect x={352} y={200} width={112} height={112} rx={8} ry={8} />
      <rect x={48} y={352} width={112} height={112} rx={8} ry={8} />
      <rect x={200} y={352} width={112} height={112} rx={8} ry={8} />
      <rect x={352} y={352} width={112} height={112} rx={8} ry={8} />
    </svg>
  )
}

export default SvgAppsSharp
