import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgLogoTwitch = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="logo-twitch_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M80 32l-32 80v304h96v64h64l64-64h80l112-112V32zm336 256l-64 64h-96l-64 64v-64h-80V80h304z" />
      <path d="M320 143h48v129h-48zm-112 0h48v129h-48z" />
    </svg>
  )
}

export default SvgLogoTwitch
