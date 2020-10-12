import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgApertureOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="aperture-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
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
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M360 94.59V296m83.13-83.13L296 360m121.41 0H216m83.13 83.13l-144-144M152 416V216m-83.13 83.13l144-144M94.59 152H288m-75.13-83.13L360 216"
      />
    </svg>
  )
}

export default SvgApertureOutline
