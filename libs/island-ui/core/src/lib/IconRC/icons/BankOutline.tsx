import * as React from 'react'

import type { SvgProps as SVGRProps } from '../types'

const SvgBankOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="bank-outline_svg__ionicon"
      viewBox="0 0 24 24"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        d="M4.75 7V14.5M9.25 7V14.5M13.75 7V14.5M18.25 7V14.5M2.5 14.5H20.5M1 17.5H22M1.75 7H21.25L11.5 1L1.75 7Z"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgBankOutline
