import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const List = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="list_svg__ionicon"
      viewBox="0 0 16 16"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M13.875 1.5H2.125C1.77982 1.5 1.5 1.77982 1.5 2.125V6.375C1.5 6.72018 1.77982 7 2.125 7H13.875C14.2202 7 14.5 6.72018 14.5 6.375V2.125C14.5 1.77982 14.2202 1.5 13.875 1.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.875 9H2.125C1.77982 9 1.5 9.27982 1.5 9.625V13.875C1.5 14.2202 1.77982 14.5 2.125 14.5H13.875C14.2202 14.5 14.5 14.2202 14.5 13.875V9.625C14.5 9.27982 14.2202 9 13.875 9Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default List
