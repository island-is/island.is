import * as React from 'react'
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgNavigateSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="navigate-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M480 32L32 240h240v240L480 32z" />
    </svg>
  )
}

export default SvgNavigateSharp
