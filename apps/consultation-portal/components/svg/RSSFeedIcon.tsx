import React from 'react'

const RSSIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
      {...props}
    >
      <g>
        <rect
          width="512"
          height="512"
          x="-512"
          y="-512"
          fill="#ea7819"
          fillOpacity="1"
          stroke="none"
          rx="70"
          ry="70"
          transform="scale(-1)"
        ></rect>
        <path
          fill="#fff"
          d="M81.056 267.05c43.705 0 84.79 17.072 115.665 48.124 30.931 31.051 47.961 72.411 47.961 116.44h67.35c0-127.885-103.62-231.921-230.976-231.921v67.357zm.106-119.4c155.76 0 282.488 127.42 282.488 284.049H431C431 237.925 274.054 80.301 81.162 80.301v67.35zm93.135 236.998c0 25.757-20.892 46.649-46.649 46.649-25.756 0-46.648-20.885-46.648-46.649C81 358.878 101.885 338 127.641 338c25.757 0 46.656 20.878 46.656 46.648z"
        ></path>
      </g>
    </svg>
  )
}

export default RSSIcon
