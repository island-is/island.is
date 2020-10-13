import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgJournal = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="journal_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M290 32H144a64.07 64.07 0 00-64 64v320a64.07 64.07 0 0064 64h146zm78 0h-18v448h18a64.07 64.07 0 0064-64V96a64.07 64.07 0 00-64-64z" />
    </svg>
  )
}

export default SvgJournal
