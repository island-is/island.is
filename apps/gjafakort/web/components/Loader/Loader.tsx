import React from 'react'

import * as styles from './Loader.css'

interface PropTypes {
  width?: number
}

function Loader({ width = 23 }: PropTypes) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 108.09 108.09"
      width={width}
    >
      <defs>
        <linearGradient
          id="first"
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
          id="second"
          x1="-16.95"
          y1="24.34"
          x2="83.75"
          y2="125.04"
          xlinkHref="#a"
        />
        <linearGradient
          id="third"
          x1="44.98"
          y1="-37.59"
          x2="145.68"
          y2="63.11"
          xlinkHref="#a"
        />
        <linearGradient
          id="fourth"
          x1="-37.59"
          y1="44.98"
          x2="63.11"
          y2="145.68"
          xlinkHref="#a"
        />
        <linearGradient
          id="fifth"
          x1="-16.95"
          y1="24.34"
          x2="83.75"
          y2="125.04"
          xlinkHref="#a"
        />
        <linearGradient
          id="sixth"
          x1="3.69"
          y1="3.69"
          x2="104.39"
          y2="104.39"
          xlinkHref="#a"
        />
        <linearGradient
          id="seventh"
          x1="24.34"
          y1="-16.95"
          x2="125.04"
          y2="83.75"
          xlinkHref="#a"
        />
        <linearGradient
          id="eighth"
          x1="24.34"
          y1="-16.95"
          x2="125.04"
          y2="83.75"
          xlinkHref="#a"
        />
        <linearGradient
          id="ninth"
          x1="3.69"
          y1="3.69"
          x2="104.39"
          y2="104.39"
          xlinkHref="#a"
        />
      </defs>
      <g data-name="Layer 2">
        <g data-name="Layer 1" className={styles.animate}>
          <path
            d="M12.76 0A12.62 12.62 0 000 12.76a12.62 12.62 0 0012.76 12.76 12.62 12.62 0 0012.76-12.76A12.62 12.62 0 0012.76 0z"
            fill="url(#first)"
          />
          <path
            d="M12.76 41.29a12.76 12.76 0 100 25.51 12.76 12.76 0 100-25.51z"
            fill="url(#second)"
          />
          <path
            d="M95.33 25.52a12.62 12.62 0 0012.76-12.76 12.76 12.76 0 00-25.52 0 12.62 12.62 0 0012.76 12.76z"
            fill="url(#third)"
          />
          <path
            d="M12.76 82.57a12.76 12.76 0 000 25.52 12.76 12.76 0 000-25.52z"
            fill="url(#fourth)"
          />
          <path
            d="M54 82.57a12.76 12.76 0 1012.8 12.76A12.61 12.61 0 0054 82.57z"
            fill="url(#fifth)"
          />
          <path
            d="M95.33 82.57a12.76 12.76 0 1012.76 12.76 12.62 12.62 0 00-12.76-12.76z"
            fill="url(#sixth)"
          />
          <path
            d="M95.33 41.29A12.76 12.76 0 10108.09 54a12.61 12.61 0 00-12.76-12.71z"
            fill="url(#seventh)"
          />
          <path
            d="M54 0a12.61 12.61 0 00-12.71 12.76 12.76 12.76 0 1025.51 0A12.62 12.62 0 0054 0z"
            fill="url(#eights)"
          />
          <path
            d="M54 41.29A12.76 12.76 0 1066.8 54 12.6 12.6 0 0054 41.29z"
            fill="url(#ninth)"
          />
        </g>
      </g>
    </svg>
  )
}

export default Loader
