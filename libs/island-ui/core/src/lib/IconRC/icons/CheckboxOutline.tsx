import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCheckboxOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="checkbox-outline_svg__ionicon"
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
        d="M352 176L217.6 336 160 272"
      />
      <rect
        x={64}
        y={64}
        width={384}
        height={384}
        rx={48}
        ry={48}
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgCheckboxOutline
