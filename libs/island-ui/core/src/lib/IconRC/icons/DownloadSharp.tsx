import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgDownloadSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="download-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M272 160v147.37l64-64L358.63 266 256 368.63 153.37 266 176 243.37l64 64V160H92a12 12 0 00-12 12v296a12 12 0 0012 12h328a12 12 0 0012-12V172a12 12 0 00-12-12zM240 32h32v128h-32z" />
    </svg>
  )
}

export default SvgDownloadSharp
