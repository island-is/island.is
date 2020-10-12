import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgNavigate({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="navigate_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M272 464a16 16 0 01-16-16.42V264.13a8 8 0 00-8-8H64.41a16.31 16.31 0 01-15.49-10.65 16 16 0 018.41-19.87l384-176.15a16 16 0 0121.22 21.19l-176 384A16 16 0 01272 464z" />
    </svg>
  )
}

export default SvgNavigate
