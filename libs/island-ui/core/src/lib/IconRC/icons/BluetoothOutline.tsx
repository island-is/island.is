import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgBluetoothOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bluetooth-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M144 352l224-192L256 48v416l112-112-224-192"
      />
    </svg>
  )
}

export default SvgBluetoothOutline
