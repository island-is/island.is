import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgDocumentsSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="documents-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M307.94 248L216 154.52V242a6 6 0 006 6z" />
      <path d="M184 268V144H60a12 12 0 00-12 12v328a12 12 0 0012 12h248a12 12 0 0012-12V280H196a12 12 0 01-12-12zm182-148h85.94L360 26.52V114a6 6 0 006 6z" />
      <path d="M340 152a12 12 0 01-12-12V16H172a12 12 0 00-12 12v84h42.12A40.81 40.81 0 01231 124.14l109.16 111a41.11 41.11 0 0111.83 29V400H452a12 12 0 0012-12V152z" />
    </svg>
  )
}

export default SvgDocumentsSharp
