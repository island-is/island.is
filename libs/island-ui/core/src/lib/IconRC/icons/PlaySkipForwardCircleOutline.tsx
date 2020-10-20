import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgPlaySkipForwardCircleOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="play-skip-forward-circle-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
      <path d="M320 176a16 16 0 00-16 16v53l-111.68-67.44a10.78 10.78 0 00-16.32 9.31v138.26a10.78 10.78 0 0016.32 9.31L304 267v53a16 16 0 0032 0V192a16 16 0 00-16-16z" />
    </svg>
  )
}

export default SvgPlaySkipForwardCircleOutline
