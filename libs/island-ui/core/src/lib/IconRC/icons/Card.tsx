import * as React from 'react'

import type { SvgProps as SVGRProps } from '../types'

const SvgCard = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="card_svg__ionicon"
      viewBox="0 0 24 24"
      fill="none"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M1.5 17.625a2.625 2.625 0 0 0 2.625 2.625h15.75a2.625 2.625 0 0 0 2.625-2.625v-7.219h-21v7.219Zm3.094-3.563A1.406 1.406 0 0 1 6 12.656h2.25a1.406 1.406 0 0 1 1.406 1.406V15a1.406 1.406 0 0 1-1.406 1.406H6A1.406 1.406 0 0 1 4.594 15v-.938ZM19.875 3.75H4.125A2.625 2.625 0 0 0 1.5 6.375v1.219h21V6.375a2.625 2.625 0 0 0-2.625-2.625Z" />
    </svg>
  )
}

export default SvgCard
