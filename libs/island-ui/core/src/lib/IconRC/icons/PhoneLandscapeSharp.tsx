import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPhoneLandscapeSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="phone-landscape-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M0 130v252a18 18 0 0018 18h476a18 18 0 0018-18V130a18 18 0 00-18-18H18a18 18 0 00-18 18zm448 234H64V148h384z" />
    </svg>
  )
}

export default SvgPhoneLandscapeSharp
