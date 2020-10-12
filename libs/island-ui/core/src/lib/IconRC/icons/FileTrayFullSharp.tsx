import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgFileTrayFullSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="file-tray-full-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M128 128h256v38H128zm-16 64h288v38H112z" />
      <path d="M448 64H64L32 256v192h448V256zm-12 192H320a64 64 0 01-128 0H76l22-150h316z" />
    </svg>
  )
}

export default SvgFileTrayFullSharp
