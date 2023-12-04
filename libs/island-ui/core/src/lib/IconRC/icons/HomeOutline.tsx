import * as React from 'react'
import type { SvgProps as SVGRProps } from '../types'

const SvgHomeOutline = ({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) => {
  return (
    <svg
      className="home-outline_svg__ionicon"
      viewBox="4 4 24 24"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <g transform="translate(.000001 0.000001)">
        <path
          d="M12.7793,19.7052l1.4506-3.3847c.2362-.5509.8379-.9157,1.5102-.9157h7.5941c.6723,0,1.274.3648,1.5101.9157l1.4506,3.3847m-13.5156,0h13.5156m-13.5156,0v5.5291m13.5156-5.5291v5.5291m-13.5156,0h13.5156m-13.5156,0v1.2287h1.2287v-1.2287m12.2869,0v1.2287h-1.2286v-1.2287"
          fill="none"
          stroke="#0044b3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.6767,23.6559c.582,0,1.0538-.4718,1.0538-1.0538s-.4718-1.0538-1.0538-1.0538-1.0537.4718-1.0537,1.0538.4718,1.0538,1.0537,1.0538Z"
          fill="#0044b3"
        />
        <path
          d="M23.5577,23.6559c.582,0,1.0538-.4718,1.0538-1.0538s-.4718-1.0538-1.0538-1.0538-1.0538.4718-1.0538,1.0538.4718,1.0538,1.0538,1.0538Z"
          fill="#0044b3"
        />
      </g>
      <g>
        <path
          id="ebYEDB473Vf7"
          d="M7.75,25v-11.0625"
          fill="none"
          stroke="#0044b3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="ebYEDB473Vf8"
          d="M5.5,16l9.9895-9.56253c.2344-.2475.7824-.25031,1.021,0L23,12.927"
          fill="none"
          stroke="#0044b3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="ebYEDB473Vf9"
          d="M9.25,12.3906L9.25,7h2.25v3.2344"
          fill="none"
          stroke="#0044b3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        id="ebYEDB473Vf10"
        d="M10.8937,6.76582c-2.72886-1.29005,1.9066-3.22779-.6517-4.9842"
        fill="none"
        stroke="#0044b3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDashoffset="8"
        strokeDasharray="8"
      />
    </svg>
  )
}

export default SvgHomeOutline
