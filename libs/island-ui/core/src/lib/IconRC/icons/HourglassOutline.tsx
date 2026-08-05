import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgHourglassOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="hourglass-outline_svg__ionicon"
      viewBox="0 0 16 14"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M4.55016 13.5H11.4495C12.0683 13.5 12.5605 12.991 12.4939 12.404C12.0642 8.625 9.49985 8.688 9.49985 7C9.49985 5.312 12.097 5.406 12.4936 1.596C12.5561 1.009 12.0683 0.5 11.4495 0.5H4.55016C3.93141 0.5 3.44485 1.009 3.5061 1.596C3.90266 5.406 6.49985 5.281 6.49985 7C6.49985 8.719 3.93547 8.625 3.5061 12.404C3.43922 12.991 3.93141 13.5 4.55016 13.5Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7279 12.5H5.28507C4.79757 12.5 4.66007 11.938 5.00194 11.589C5.82944 10.75 7.49975 10.149 7.49975 9.188V6C7.49975 5.38 6.31225 4.906 5.57757 3.9C5.45632 3.734 5.4685 3.5 5.77663 3.5H10.2369C10.4998 3.5 10.5566 3.732 10.4369 3.898C9.71288 4.906 8.49975 5.377 8.49975 6V9.188C8.49975 10.142 10.2407 10.656 11.0123 11.59C11.3232 11.966 11.2144 12.5 10.7279 12.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default SvgHourglassOutline
