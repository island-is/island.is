import React, { forwardRef } from 'react'

import * as styles from './Logo.css'

import cn from 'classnames'

interface LogoProps {
  id?: string
  width?: number
  height?: number
  solid?: boolean
  solidColor?: string
  iconOnly?: boolean
  title?: string
}

export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  (
    {
      id = '',
      width,
      height,
      solid = false,
      solidColor = '#fff',
      iconOnly = false,
      title,
    },
    ref,
  ) =>
    iconOnly ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? 40}
        height={height ?? 40}
        fill="none"
        viewBox="0 0 40 40"
        className={cn(styles.root)}
        style={{ color: solidColor }}
        aria-label="island.is logo"
        ref={ref}
      >
        {title && <title>{title}</title>}
        <path
          fill={solid ? solidColor : `url(#paint0_linear_${id})`}
          d="M8.22254 16.2332V39.0458C8.22254 39.5763 7.95729 39.8415 7.42681 39.8415H2.01518C1.48469 39.8415 1.21945 39.5763 1.21945 39.0458V16.2332C1.21945 15.7027 1.48469 15.4375 2.01518 15.4375H7.42681C7.95729 15.4375 8.22254 15.7027 8.22254 16.2332ZM20 30.558C17.3492 30.558 15.279 32.6299 15.279 35.279C15.279 37.9298 17.3509 40 20 40C22.6508 40 24.721 37.9281 24.721 35.279C24.721 32.6299 22.6508 30.558 20 30.558ZM35.279 30.558C32.6282 30.558 30.558 32.6299 30.558 35.279C30.558 37.9298 32.6299 40 35.279 40C37.9298 40 40 37.9281 40 35.279C40 32.6299 37.9281 30.558 35.279 30.558ZM20 15.279C17.3492 15.279 15.279 17.3509 15.279 20C15.279 22.6508 17.3509 24.721 20 24.721C22.6508 24.721 24.721 22.6491 24.721 20C24.721 17.3509 22.6508 15.279 20 15.279ZM35.279 15.279C32.6282 15.279 30.558 17.3509 30.558 20C30.558 22.6508 32.6299 24.721 35.279 24.721C37.9298 24.721 40 22.6491 40 20C40 17.3509 37.9281 15.279 35.279 15.279ZM20 0C17.3492 0 15.279 2.0719 15.279 4.72099C15.279 7.37176 17.3509 9.44199 20 9.44199C22.6508 9.44199 24.721 7.37009 24.721 4.72099C24.721 2.0719 22.6508 0 20 0ZM35.279 9.44199C37.9298 9.44199 40 7.37009 40 4.72099C40 2.07023 37.9281 0 35.279 0C32.6282 0 30.558 2.0719 30.558 4.72099C30.558 7.37176 32.6282 9.44199 35.279 9.44199ZM4.72099 0C2.0719 0 0 2.0719 0 4.72099C0 7.37176 2.0719 9.44199 4.72099 9.44199C7.37176 9.44199 9.44199 7.37009 9.44199 4.72099C9.44199 2.0719 7.37176 0 4.72099 0Z"
        />
        <defs>
          <linearGradient
            id={`paint0_linear_${id}`}
            x1="1.1276"
            y1="1.60629"
            x2="38.3941"
            y2="38.8728"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#0161FD" />
            <stop offset="0.2457" stopColor="#3F46D2" />
            <stop offset="0.5079" stopColor="#812EA4" />
            <stop offset="0.7726" stopColor="#C21578" />
            <stop offset="1" stopColor="#FD0050" />
          </linearGradient>
        </defs>
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 669.51 108.09"
        className={cn(styles.root, styles.logoHeight)}
        width={width ?? 200}
        style={{ color: solidColor }}
        aria-label="island.is logo"
      >
        <defs>
          <linearGradient
            id="a"
            x1="3.69"
            y1="3.69"
            x2="104.39"
            y2="104.39"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#0161fd" />
            <stop offset=".25" stopColor="#3f46d2" />
            <stop offset=".51" stopColor="#812ea4" />
            <stop offset=".77" stopColor="#c21578" />
            <stop offset="1" stopColor="#fd0050" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="-16.95"
            y1="24.34"
            x2="83.75"
            y2="125.04"
            xlinkHref="#a"
          />
          <linearGradient
            id="c"
            x1="-37.59"
            y1="44.98"
            x2="63.11"
            y2="145.68"
            xlinkHref="#a"
          />
          <linearGradient
            id="d"
            x1="44.98"
            y1="-37.59"
            x2="145.68"
            y2="63.11"
            xlinkHref="#a"
          />
          <linearGradient
            id="e"
            x1="-16.95"
            y1="24.34"
            x2="83.75"
            y2="125.04"
            xlinkHref="#a"
          />
          <linearGradient
            id="f"
            x1="3.69"
            y1="3.69"
            x2="104.39"
            y2="104.39"
            xlinkHref="#a"
          />
          <linearGradient
            id="g"
            x1="24.34"
            y1="-16.95"
            x2="125.04"
            y2="83.75"
            xlinkHref="#a"
          />
          <linearGradient
            id="h"
            x1="3.69"
            y1="3.69"
            x2="104.39"
            y2="104.39"
            xlinkHref="#a"
          />
          <linearGradient
            id="i"
            x1="24.34"
            y1="-16.95"
            x2="125.04"
            y2="83.75"
            xlinkHref="#a"
          />
        </defs>
        <g>
          <g>
            <rect
              x="168.44"
              y="41.72"
              width="18.92"
              height="65.94"
              rx="2.15"
              fill={solid ? 'currentColor' : undefined}
            />
            <rect
              x="271.14"
              y="9.6"
              width="18.92"
              height="98.05"
              rx="2.15"
              fill={solid ? 'currentColor' : undefined}
            />
            <path
              d="M414.2 41.43c-11.61 0-17.2.1-32.25.29a1.9 1.9 0 00-2.15 2.15v61.64a1.9 1.9 0 002.15 2.15h14.62a1.9 1.9 0 002.15-2.15V55.33h9.75c11.18 0 13.76 3.16 13.76 15.06v35.12a1.9 1.9 0 002.15 2.15H439a1.9 1.9 0 002.15-2.15V65.94c0-19.78-14.33-24.51-26.95-24.51zM515.5 10h-14.63c-1.43 0-2.15.72-2.15 2.73v28.56h-14.91c-14 0-28.81 4.3-28.81 33.4 0 28.38 14.77 33.25 28.81 33.25 18.21 0 23.94-.13 31.69-.28a1.92 1.92 0 002.15-2.15V12.76c0-2.01-.72-2.76-2.15-2.76zm-16.78 84.18h-11.18c-9.89 0-13.62-4.73-13.62-19.21 0-15.19 3.73-19.64 13.62-19.64h11.18z"
              fill={solid ? 'currentColor' : undefined}
            />
            <circle
              cx="549.47"
              cy="95.33"
              r="12.76"
              transform="rotate(-3.56 549.91 95.358)"
              fill={solid ? 'currentColor' : '#ff0050'}
            />
            <circle
              cx="177.9"
              cy="12.76"
              r="12.76"
              fill={solid ? 'currentColor' : undefined}
            />
            <path
              d="M337.65 41.43c-11.75 0-18.2.15-25.95.29a2 2 0 00-2.15 2.28v9.17a1.9 1.9 0 002.15 2.15h19.36c11.18 0 14.05 3.16 14.05 8.46v3h-18.5c-14.91 0-23.65 4.59-23.51 19.79.15 16.19 8.75 21.35 23.66 21.35 21.36 0 27.38-.16 35.12-.28a1.91 1.91 0 002.15-2.15v-41c-.03-18.33-14.34-23.06-26.38-23.06zm7.46 52.75h-14.34c-5.88 0-8.6-1.72-8.74-7.59s2.72-7.6 8.6-7.6h14.48zM242.75 70.82l-17.06-5.59c-3.87-1.29-5-2.44-5-5.31 0-3.3 1.72-4.73 7.16-4.73h24.65a1.9 1.9 0 002.15-2.19v-9.28a1.92 1.92 0 00-2.15-2.15c-7.74-.15-14-.28-27.38-.28s-22.94 4-22.94 17.2v2.43c0 7.46 4.73 14.34 14.48 17.64L233 84c4.3 1.44 5 2.3 5 5 0 3.73-1.72 4.88-5.73 4.88h-26.93a1.9 1.9 0 00-2.15 2.15v9.31a1.9 1.9 0 002.15 2.15c7.74.15 13.47.29 26.95.29 16.34 0 24.37-3.87 24.37-17.34V88c0-6.29-2.44-13.46-13.91-17.18z"
              fill={solid ? 'currentColor' : undefined}
            />
            <rect
              x="581.29"
              y="41.72"
              width="18.92"
              height="65.94"
              rx="2.15"
              fill={solid ? 'currentColor' : undefined}
            />
            <circle
              cx="590.76"
              cy="12.76"
              r="12.76"
              transform="rotate(-4.07 590.034 12.793)"
              fill={solid ? 'currentColor' : undefined}
            />
            <path
              d="M655.61 70.82l-17.06-5.59c-3.87-1.29-5-2.44-5-5.31 0-3.3 1.72-4.73 7.17-4.73h24.66a1.9 1.9 0 002.13-2.19v-9.28a1.92 1.92 0 00-2.15-2.15c-7.75-.15-14-.28-27.38-.28S615 45.3 615 58.49v2.43c0 7.46 4.73 14.34 14.48 17.64L645.86 84c4.3 1.44 5 2.3 5 5 0 3.73-1.72 4.88-5.74 4.88h-26.93a1.9 1.9 0 00-2.19 2.17v9.31a1.91 1.91 0 002.15 2.15c7.74.15 13.48.29 26.95.29 16.35 0 24.37-3.87 24.37-17.34V88c.04-6.29-2.39-13.46-13.86-17.18z"
              fill={solid ? 'currentColor' : undefined}
            />
            <g>
              <path
                d="M12.76 0A12.62 12.62 0 000 12.76a12.62 12.62 0 0012.76 12.76 12.62 12.62 0 0012.76-12.76A12.62 12.62 0 0012.76 0z"
                fill={solid ? 'currentColor' : 'url(#a)'}
              />
              <path
                d="M54 82.57a12.76 12.76 0 1012.8 12.76A12.61 12.61 0 0054 82.57z"
                fill={solid ? 'currentColor' : 'url(#b)'}
              />
              <path
                d="M12.76 82.57a12.76 12.76 0 000 25.52 12.76 12.76 0 000-25.52z"
                fill={solid ? 'currentColor' : 'url(#c)'}
              />
              <path
                d="M95.33 25.52a12.62 12.62 0 0012.76-12.76 12.76 12.76 0 00-25.52 0 12.62 12.62 0 0012.76 12.76z"
                fill={solid ? 'currentColor' : 'url(#d)'}
              />
              <path
                d="M12.76 41.29a12.76 12.76 0 100 25.51 12.76 12.76 0 100-25.51z"
                fill={solid ? 'currentColor' : 'url(#e)'}
              />
              <path
                d="M54 41.29A12.76 12.76 0 1066.8 54 12.6 12.6 0 0054 41.29z"
                fill={solid ? 'currentColor' : 'url(#f)'}
              />
              <path
                d="M95.33 41.29A12.76 12.76 0 10108.09 54a12.61 12.61 0 00-12.76-12.71z"
                fill={solid ? 'currentColor' : 'url(#g)'}
              />
              <path
                d="M95.33 82.57a12.76 12.76 0 1012.76 12.76 12.62 12.62 0 00-12.76-12.76z"
                fill={solid ? 'currentColor' : 'url(#h)'}
              />
              <path
                d="M54 0a12.61 12.61 0 00-12.71 12.76 12.76 12.76 0 1025.51 0A12.62 12.62 0 0054 0z"
                fill={solid ? 'currentColor' : 'url(#i)'}
              />
            </g>
          </g>
        </g>
      </svg>
    ),
)
