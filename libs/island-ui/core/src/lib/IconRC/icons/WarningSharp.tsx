import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgWarningSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="warning-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M479 447.77L268.43 56.64a8 8 0 00-14.09 0L43.73 447.77a8 8 0 007.05 11.79H472a8 8 0 007-11.79zm-197.62-36.29h-40v-40h40zm-4-63.92h-32l-6-160h44z" />
    </svg>
  )
}

export default SvgWarningSharp
