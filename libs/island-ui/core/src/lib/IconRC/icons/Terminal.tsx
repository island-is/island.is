import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgTerminal({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="terminal_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M432 32H80a64.07 64.07 0 00-64 64v320a64.07 64.07 0 0064 64h352a64.07 64.07 0 0064-64V96a64.07 64.07 0 00-64-64zM96 256a16 16 0 01-10-28.49L150.39 176 86 124.49a16 16 0 1120-25l80 64a16 16 0 010 25l-80 64A16 16 0 0196 256zm160 0h-64a16 16 0 010-32h64a16 16 0 010 32z" />
    </svg>
  )
}

export default SvgTerminal
