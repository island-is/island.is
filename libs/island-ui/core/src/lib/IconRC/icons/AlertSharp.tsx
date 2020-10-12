import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgAlertSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="alert-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M240 80l8 240h16l8-240h-32zm0 320h32v32h-32z"
      />
    </svg>
  )
}

export default SvgAlertSharp
