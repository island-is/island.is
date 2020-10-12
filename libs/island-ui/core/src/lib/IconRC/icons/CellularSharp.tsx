import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCellularSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="cellular-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M496 432h-96V80h96zm-128 0h-96V160h96zm-128 0h-96V224h96zm-128 0H16V288h96z" />
    </svg>
  )
}

export default SvgCellularSharp
