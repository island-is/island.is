import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBagSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bag-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M372 160v-12A116.13 116.13 0 00258.89 32h-5.78A116.13 116.13 0 00140 148v12H52a4 4 0 00-4 4v300a16 16 0 0016 16h384a16 16 0 0016-16V164a4 4 0 00-4-4zm-40 0H180v-11c0-41.84 33.41-76.56 75.25-77A76.08 76.08 0 01332 148z" />
    </svg>
  )
}

export default SvgBagSharp
