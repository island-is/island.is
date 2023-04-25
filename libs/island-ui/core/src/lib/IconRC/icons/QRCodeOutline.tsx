import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgQRCodeOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="QRCode-outline_svg__ionicon"
      aria-labelledby={titleId}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M2 2H4.66667V4.66667H2V2Z"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 11.3333H4.66667V14H2V11.3333Z"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3331 2H13.9998V4.66667H11.3331V2Z"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.66672H7.33333V10.0001"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 9.5V14H14V9.5H11.75"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33374 12.6666V13.9999"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33374 2V6H8.66707"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.3331 7.33328H13.9998"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 6.5H4.66667"
        stroke="#0061FF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default SvgQRCodeOutline
