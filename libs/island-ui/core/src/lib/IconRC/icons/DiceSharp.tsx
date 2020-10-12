import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgDiceSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="dice-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M48 366.92L240 480V284L48 170zM192 288c8.84 0 16 10.75 16 24s-7.16 24-16 24-16-10.75-16-24 7.16-24 16-24zm-96 32c8.84 0 16 10.75 16 24s-7.16 24-16 24-16-10.75-16-24 7.16-24 16-24zm176-36v196l192-113.08V170zm48 140c-8.84 0-16-10.75-16-24s7.16-24 16-24 16 10.75 16 24-7.16 24-16 24zm0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24 16 10.75 16 24-7.16 24-16 24zm96 32c-8.84 0-16-10.75-16-24s7.16-24 16-24 16 10.75 16 24-7.16 24-16 24zm0-88c-8.84 0-16-10.75-16-24s7.16-24 16-24 16 10.75 16 24-7.16 24-16 24zm32 77.64zM256 32L64 144l192 112 192-112zm0 120c-13.25 0-24-7.16-24-16s10.75-16 24-16 24 7.16 24 16-10.75 16-24 16z" />
    </svg>
  )
}

export default SvgDiceSharp
