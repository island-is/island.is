import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgJournalSharp = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="journal-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M290 32H104a24 24 0 00-24 24v400a24 24 0 0024 24h186zm118 0h-58v448h58a24 24 0 0024-24V56a24 24 0 00-24-24z" />
    </svg>
  )
}

export default SvgJournalSharp
