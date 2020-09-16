import * as React from 'react'
import { SvgProps as SVGRProps } from '../Icon'

const SvgAmericanFootballOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="american-football-outline_svg__ionicon"
      viewBox="0 0 512 512"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <ellipse
        cx={256}
        cy={256}
        rx={267.57}
        ry={173.44}
        transform="rotate(-45 256 256.002)"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M334.04 177.96L177.96 334.04M278.3 278.3l-44.6-44.6m89.19 0l-44.59-44.59m178.38 22.29L300.6 55.32m-89.2 401.36L55.32 300.6m178.38 22.29l-44.59-44.59"
      />
    </svg>
  )
}

export default SvgAmericanFootballOutline
