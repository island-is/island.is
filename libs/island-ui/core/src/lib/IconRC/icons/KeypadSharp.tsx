import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgKeypadSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="keypad-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <rect x={80} y={16} width={96} height={96} rx={8} ry={8} />
      <rect x={208} y={16} width={96} height={96} rx={8} ry={8} />
      <rect x={336} y={16} width={96} height={96} rx={8} ry={8} />
      <rect x={80} y={144} width={96} height={96} rx={8} ry={8} />
      <rect x={208} y={144} width={96} height={96} rx={8} ry={8} />
      <rect x={336} y={144} width={96} height={96} rx={8} ry={8} />
      <rect x={80} y={272} width={96} height={96} rx={8} ry={8} />
      <rect x={208} y={272} width={96} height={96} rx={8} ry={8} />
      <rect x={208} y={400} width={96} height={96} rx={8} ry={8} />
      <rect x={336} y={272} width={96} height={96} rx={8} ry={8} />
    </svg>
  )
}

export default SvgKeypadSharp
