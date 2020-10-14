import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgCodeSlashOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="code-slash-outline_svg__ionicon"
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
        d="M160 368L32 256l128-112m192 224l128-112-128-112m-48-48l-96 320"
      />
    </svg>
  )
}

export default SvgCodeSlashOutline
