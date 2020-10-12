import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgWifiOutline({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="wifi-outline_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        d="M332.41 310.59a115 115 0 00-152.8 0m213.85-61.05a201.26 201.26 0 00-274.92 0m329.18-67.43a288 288 0 00-383.44 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path d="M256 416a32 32 0 1132-32 32 32 0 01-32 32z" />
    </svg>
  )
}

export default SvgWifiOutline
