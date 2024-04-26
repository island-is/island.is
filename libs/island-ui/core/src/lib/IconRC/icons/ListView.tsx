import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const ListView = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg viewBox="0 0 24 24" aria-labelledby={titleId} {...props}>
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M1 9h22M1 3h22M1 15h22M1 21h22"
      ></path>
    </svg>
  )
}

export default ListView
