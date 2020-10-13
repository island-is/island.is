import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgShapesOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="shapes-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M336 320H32L184 48l152 272zm-70.68-125.49A144 144 0 11192 320"
      />
    </svg>
  )
}

export default SvgShapesOutline
