import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgCardWithCheckmark = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="card_svg__ionicon"
      viewBox="4 4 24 24"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M25.5 13.907v-3.73a3 3 0 0 0-3-3H8.48a3 3 0 0 0-3 3v8.8a3 3 0 0 0 3 3H13.463"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.48 11.25c0-.414.213-.75.477-.75h19.066c.264 0 .477.336.477.75s-.213.75-.477.75H5.957c-.264 0-.477-.336-.477-.75Z"
        clipRule="evenodd"
      />
      <g id="eNwbxRm5ElG5" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path
          id="eNwbxRm5ElG6"
          strokeDasharray={6}
          strokeLinecap="round"
          d="m19.647 21.452 1.198 1.393a.2.2 0 0 0 .295-.013L23.5 20"
          transform="translate(0 .048)"
        />
        <path d="M16.75 20.911a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0Z" />
      </g>
      <path
        id="eNwbxRm5ElG8"
        fill="none"
        stroke="currentColor"
        strokeDasharray={4}
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M8.441 18.821h4"
      />
      <path
        id="eNwbxRm5ElG9"
        fill="none"
        stroke="currentColor"
        strokeDasharray={2}
        strokeLinecap="round"
        strokeWidth={1.5}
        d="M8.441 16.321h2"
      />
    </svg>
  )
}

export default SvgCardWithCheckmark
