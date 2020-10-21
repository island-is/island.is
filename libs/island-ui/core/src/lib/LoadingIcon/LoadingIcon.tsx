import React, { forwardRef, useEffect, useRef } from 'react'
import { Colors, theme } from '@island.is/island-ui/theme'
import anime from 'animejs'

interface LoadingIconProps {
  animate?: boolean
  size?: number
  color?: Colors
}

export const LoadingIcon = forwardRef<SVGSVGElement, LoadingIconProps>(
  ({ animate = true, color, size }, ref) => {
    const animationRef = useRef(null)
    const lineRef = useRef<SVGLineElement>()

    const usedColor = color
      ? theme.color[color]
      : `url(#loading-icon-new-linear-gradient)`

    let props = {}

    if (size) {
      props['width'] = size
      props['height'] = size
    }

    useEffect(() => {
      if (lineRef.current) {
        animationRef.current = anime({
          targets: lineRef.current,
          keyframes: [
            // right
            { x1: 12, x2: 50, y1: 12, y2: 12 },
            { x1: 50, x2: 50, y1: 12, y2: 12 },
            { x1: 50, x2: 88, y1: 12, y2: 12 },
            { x1: 88, x2: 88, y1: 12, y2: 12 },
            // down
            { x1: 88, x2: 88, y1: 50, y2: 12 },
            { x1: 88, x2: 88, y1: 50, y2: 50 },
            { x1: 88, x2: 88, y1: 88, y2: 50 },
            { x1: 88, x2: 88, y1: 88, y2: 88 },
            // left
            { x1: 88, x2: 50, y1: 88, y2: 88 },
            { x1: 50, x2: 50, y1: 88, y2: 88 },
            { x1: 50, x2: 12, y1: 88, y2: 88 },
            { x1: 12, x2: 12, y1: 88, y2: 88 },
            // up
            { x1: 12, x2: 12, y1: 88, y2: 50 },
            { x1: 12, x2: 12, y1: 50, y2: 50 },
            { x1: 12, x2: 12, y1: 50, y2: 12 },
            { x1: 12, x2: 12, y1: 12, y2: 12 },
          ],
          duration: 2000,
          loop: true,
          easing: 'easeInOutSine',
        })
      }
    }, [lineRef])

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
        {!!animate && (
          <line
            ref={lineRef}
            x1="12"
            x2="12"
            y1="12"
            y2="12"
            stroke={usedColor}
            strokeWidth="24"
            strokeLinecap="round"
          />
        )}
      </svg>
    )
  },
)
