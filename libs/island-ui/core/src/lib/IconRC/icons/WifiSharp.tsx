import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgWifiSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="wifi-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M332.69 320a115 115 0 00-152.8 0m213.85-61a201.26 201.26 0 00-274.92 0M448 191.52a288 288 0 00-383.44 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth={42}
      />
      <path d="M300.67 384L256 433l-44.34-49a56.73 56.73 0 0188.92 0z" />
    </svg>
  )
}

export default SvgWifiSharp
