import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgBluetoothSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="bluetooth-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M397.41 161.13L236-.28v212.8l-94.17-80.72-26 30.37L225.27 256 115.8 349.83l26 30.37 94.2-80.72v212.8l161.41-161.41L286.73 256zM276 96.28l62.59 62.59L276 212.52zm62.58 256.85L276 415.72V299.48z" />
    </svg>
  )
}

export default SvgBluetoothSharp
