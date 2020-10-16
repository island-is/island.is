import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCubeSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="cube-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 170v196.92L240 480V284L48 170zm224 310l192-113.08V170L272 284zm176-122.36zM448 144L256 32 64 144l192 112 192-112z" />
    </svg>
  )
}

export default SvgCubeSharp
