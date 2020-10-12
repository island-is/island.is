import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgCropSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="crop-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M166 346V32h-44v90H32v44h90v224h224v90h44v-90h90v-44H166z" />
      <path d="M346 320h44V122H192v44h154v154z" />
    </svg>
  )
}

export default SvgCropSharp
