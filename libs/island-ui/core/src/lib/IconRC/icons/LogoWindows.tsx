import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgLogoWindows({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="logo-windows_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M480 265H232v179l248 36V265zm-264 0H32v150l184 26.7V265zM480 32L232 67.4V249h248V32zM216 69.7L32 96v153h184V69.7z" />
    </svg>
  )
}

export default SvgLogoWindows
