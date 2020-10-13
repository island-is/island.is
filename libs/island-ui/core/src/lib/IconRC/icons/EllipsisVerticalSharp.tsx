import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgEllipsisVerticalSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="ellipsis-vertical-sharp_svg__ionicon"
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
}

export default SvgEllipsisVerticalSharp
