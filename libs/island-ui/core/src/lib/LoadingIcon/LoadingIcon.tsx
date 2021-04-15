import React, { forwardRef } from 'react'
import { Colors, theme } from '@island.is/island-ui/theme'
import AnimatedLine from './AnimatedLine'

interface LoadingIconProps {
  animate?: boolean
  size?: number
  color?: Colors
}

export const LoadingIcon = forwardRef<SVGSVGElement, LoadingIconProps>(
  ({ animate = true, color, size }, ref) => {
    const usedColor = color
      ? theme.color[color]
      : `url(#loading-icon-new-linear-gradient)`

    const props = {
      ...(size && { width: size, height: size }),
    }

    return (
      <svg ref={ref} viewBox="0 0 100 100" {...props}>
        <defs>
          <linearGradient
            id="loading-icon-new-linear-gradient"
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
        {!!animate && <AnimatedLine color={color} />}
      </svg>
    )
  },
)
