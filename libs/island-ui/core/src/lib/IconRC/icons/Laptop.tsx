import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgLaptop = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="laptop_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 400h-28.34A47.92 47.92 0 00480 367.86V128.14A48.2 48.2 0 00431.86 80H80.14A48.2 48.2 0 0032 128.14v239.72A47.92 47.92 0 0044.34 400H16a16 16 0 000 32h480a16 16 0 000-32z" />
    </svg>
  )
}

export default SvgLaptop
