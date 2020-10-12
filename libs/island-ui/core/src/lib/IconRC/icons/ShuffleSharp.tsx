import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgShuffleSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="shuffle-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M400 304l48 48-48 48m0-288l48 48-48 48M64 352h128l60-92"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M64 160h128l128 192h96m0-192h-96l-32 48"
      />
    </svg>
  )
}

export default SvgShuffleSharp
