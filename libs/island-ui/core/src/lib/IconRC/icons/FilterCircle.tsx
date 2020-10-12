import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgFilterCircle({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="filter-circle_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm32 304h-64a16 16 0 010-32h64a16 16 0 010 32zm48-64H176a16 16 0 010-32h160a16 16 0 010 32zm32-64H144a16 16 0 010-32h224a16 16 0 010 32z" />
    </svg>
  )
}

export default SvgFilterCircle
