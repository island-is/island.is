import React from 'react'

function SlideBackgroundGrid() {
  return (
    <svg
      id="static-slide"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 470 520"
      height="520"
      width="470"
      style={{
        width: '100%',
        height: '100%',
        transform: 'translate3d(0px, 0px, 0px)',
        position: 'absolute',
        top: 0,
        zIndex: -1,
      }}
    >
      <defs>
        <style>{'.cls-4{fill:#ccdfff}'}</style>
        <pattern
          id="slide_background_grid_pattern"
          x="0"
          y="0"
          width="0.047"
          height="0.052"
        >
          <circle fill="#ccdfff" fillOpacity="1" cx="2" cy="2" r="2" />
        </pattern>
      </defs>
      <rect
        fill="url(#slide_background_grid_pattern)"
        y="20"
        x="20"
        width="470"
        height="520"
      />
    </svg>
  )
}

export default SlideBackgroundGrid
