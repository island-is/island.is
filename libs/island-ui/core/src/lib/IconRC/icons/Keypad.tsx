import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgKeypad = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="keypad_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 400a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zm128 256a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zM128 272a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48zm0-128a48 48 0 1048 48 48 48 0 00-48-48z" />
    </svg>
  )
}

export default SvgKeypad
