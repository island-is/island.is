import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgHome = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="home-with-car_svg__ionicon"
      viewBox="0 0 32 32"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m12.78 19.705 1.45-3.384c.236-.551.838-.916 1.51-.916h7.594c.673 0 1.274.365 1.51.916l1.45 3.384m-13.515 0h13.516m-13.516 0v5.53m13.516-5.53v5.53m-13.516 0h13.516m-13.516 0v1.228h1.229v-1.229m12.287 0v1.229h-1.229v-1.229"
      />
      <path
        fill="currentColor"
        d="M15.677 23.656a1.054 1.054 0 1 0 0-2.108 1.054 1.054 0 0 0 0 2.108ZM23.558 23.656a1.054 1.054 0 1 0 0-2.108 1.054 1.054 0 0 0 0 2.108Z"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path id="ebYEDB473Vf7" d="M7.75 25V13.937" />
        <path
          id="ebYEDB473Vf8"
          d="m5.5 16 9.99-9.563c.234-.247.782-.25 1.02 0l6.49 6.49"
        />
        <path id="ebYEDB473Vf9" d="M9.25 12.39V7h2.25v3.234" />
      </g>
      <path
        id="ebYEDB473Vf10"
        fill="none"
        stroke="currentColor"
        strokeDasharray={8}
        strokeDashoffset={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M10.894 6.766c-2.73-1.29 1.906-3.228-.652-4.984"
      />
    </svg>
  )
}

export default SvgHome
