import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgEllipsisVertical = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="ellipsis-vertical_svg__ionicon"
    viewBox="0 0 512 512"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <circle cx={256} cy={256} r={48} />
    <circle cx={256} cy={416} r={48} />
    <circle cx={256} cy={96} r={48} />
  </svg>
)

export default SvgEllipsisVertical
