import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgReloadCircleOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="reload-circle-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path
        d="M341.54 197.85l-11.37-13.23a103.37 103.37 0 1022.71 105.84"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path d="M367.32 162a8.44 8.44 0 00-6 2.54l-59.54 59.54a8.61 8.61 0 006.09 14.71h59.54a8.62 8.62 0 008.62-8.62v-59.56a8.61 8.61 0 00-8.68-8.63z" />
    </svg>
  )
}

export default SvgReloadCircleOutline
