import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgAttachSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="attach-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M216.08 192v143.55a40.08 40.08 0 0080.15 0l.13-188.55a67.94 67.94 0 10-135.87 0v189.82a95.51 95.51 0 00191 0V159.44"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
      />
    </svg>
  )
}

export default SvgAttachSharp
