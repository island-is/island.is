import React, { forwardRef } from 'react'
import { Colors, theme } from '@island.is/island-ui/theme'

interface LoadingIconProps {
  animate?: boolean
  size?: number
  color?: Colors
}

const keyTimes = `
  0 ; 0.25 ; 0.5 ; 0.75 ; 1
`

const keySplines = `
  0.5 0 0.5 1 ;
  0.5 0 0.5 1 ;
  0.5 0 0.5 1 ;
  0.5 0 0.5 1
`

const sharedProps = {
  keyTimes,
  keySplines,
  fill: 'freeze',
  calcMode: 'spline',
  dur: `1.5s`,
}

export const LoadingIcon = forwardRef<SVGSVGElement, LoadingIconProps>(
  ({ animate = true, color, size }, ref) => {
    const usedColor = color
      ? theme.color[color]
      : `url(#loading-icon-linear-gradient)`

    let props = {}

    if (size) {
      props['width'] = size
      props['height'] = size
    }

    return (
      <svg ref={ref} viewBox="0 0 100 100" {...props}>
        <defs>
          <linearGradient
            id="loading-icon-linear-gradient"
            x1="2.819"
            y1="4.015725"
            x2="95.98525"
            y2="97.182"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0161FD"></stop>
            <stop offset="0.2457" stopColor="#3F46D2"></stop>
            <stop offset="0.5079" stopColor="#812EA4"></stop>
            <stop offset="0.7726" stopColor="#C21578"></stop>
            <stop offset="1" stopColor="#FD0050"></stop>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill={usedColor} />
        <circle cx="50" cy="12" r="12" fill={usedColor} />
        <circle cx="88" cy="12" r="12" fill={usedColor} />
        <circle cx="12" cy="50" r="12" fill={usedColor} />
        <circle cx="50" cy="50" r="12" fill={usedColor} />
        <circle cx="88" cy="50" r="12" fill={usedColor} />
        <circle cx="12" cy="88" r="12" fill={usedColor} />
        <circle cx="50" cy="88" r="12" fill={usedColor} />
        <circle cx="88" cy="88" r="12" fill={usedColor} />
        {!!animate && (
          <line
            x1="12"
            x2="12"
            y1="12"
            y2="12"
            stroke={usedColor}
            strokeWidth="24"
            strokeLinecap="round"
          >
            <animate
              attributeName="x1"
              begin="0s ; loading-icon-y1b-anim.end + 0s"
              values="12 ; 12 ; 50 ; 50 ; 88"
              {...sharedProps}
              id="loading-icon-x1-anim"
            />
            <animate
              attributeName="x2"
              begin="0s ; loading-icon-y2b-anim.end + 0s"
              values="12 ; 50 ; 50 ; 88 ; 88"
              {...sharedProps}
              id="loading-icon-x2-anim"
            />
            <animate
              attributeName="y1"
              begin="loading-icon-x2-anim.end + 0s"
              values="12 ; 50 ; 50 ; 88 ; 88"
              {...sharedProps}
              id="loading-icon-y1-anim"
            />
            <animate
              attributeName="y2"
              begin="loading-icon-x1-anim.end + 0s"
              values="12 ; 12 ; 50 ; 50 ; 88"
              {...sharedProps}
              id="loading-icon-y2-anim"
            />
            <animate
              attributeName="x1"
              begin="loading-icon-y2-anim.end + 0s"
              values="88 ; 88 ; 50 ; 50 ; 12"
              {...sharedProps}
              id="loading-icon-x1b-anim"
            />
            <animate
              attributeName="x2"
              begin="loading-icon-y1-anim.end + 0s"
              values="88 ; 50 ; 50 ; 12 ; 12"
              {...sharedProps}
              id="loading-icon-x2b-anim"
            />
            <animate
              attributeName="y1"
              begin="loading-icon-x2b-anim.end + 0s"
              values="88 ; 50 ; 50 ; 12 ; 12"
              {...sharedProps}
              id="loading-icon-y1b-anim"
            />
            <animate
              attributeName="y2"
              begin="loading-icon-x1b-anim.end + 0s"
              values="88 ; 88 ; 50 ; 50 ; 12"
              {...sharedProps}
              id="loading-icon-y2b-anim"
            />
          </line>
        )}
      </svg>
    )
  },
)
