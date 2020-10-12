import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgShareSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="share-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M272 176v161h-32V176H92a12 12 0 00-12 12v280a12 12 0 0012 12h328a12 12 0 0012-12V188a12 12 0 00-12-12zm0-83.37l64 64L358.63 134 256 31.37 153.37 134 176 156.63l64-64V176h32V92.63z" />
    </svg>
  )
}

export default SvgShareSharp
