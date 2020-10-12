import * as React from 'react'
interface SVGRProps {
  title?: string
  titleId?: string
}

function SvgPodiumSharp({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      className="podium-sharp_svg__ionicon"
      viewBox="0 0 512 512"
      width="1em"
      height="1em"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path d="M160 32h192v448H160zm224 160h112v288H384zM16 128h112v352H16z" />
    </svg>
  )
}

export default SvgPodiumSharp
