import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCaretBackCircle = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="caret-back-circle_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 256c0 114.87 93.13 208 208 208s208-93.13 208-208S370.87 48 256 48 48 141.13 48 256zm252-74.14v148.28a16 16 0 01-26.23 12.29l-89.09-74.13a16 16 0 010-24.6l89.09-74.13A16 16 0 01300 181.86z" />
    </svg>
  )
}

export default SvgCaretBackCircle
