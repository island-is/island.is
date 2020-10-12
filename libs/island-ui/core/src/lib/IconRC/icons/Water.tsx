import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgWater({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="water_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M265.12 60.12a12 12 0 00-18.23 0C215.23 97.15 112 225.17 112 320c0 88.37 55.64 144 144 144s144-55.63 144-144c0-94.83-103.23-222.85-134.88-259.88zM272 412a12 12 0 01-11.34-16 11.89 11.89 0 0111.41-8A60.06 60.06 0 00332 328.07a11.89 11.89 0 018-11.41A12 12 0 01356 328a84.09 84.09 0 01-84 84z" />
    </svg>
  )
}

export default SvgWater
