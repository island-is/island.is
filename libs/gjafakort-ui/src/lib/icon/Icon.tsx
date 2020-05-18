import React from 'react'

// type IconType = 'cheveron' | 'check' | 'external-link' | 'arrow' | 'calendar' | 'search' | 'info' | 'close' | 'attachment' | 'plus' | 'loading'
type IconTypes = 'cheveron'
type Icons = {
  [Type in IconTypes]: (
    width?: string | number,
    height?: string | number,
    color?: string,
  ) => JSX.Element
}

export interface IconBase {
  width?: string | number
  height?: string | number
  color?: string
}

export interface IconProps extends IconBase {
  type: IconTypes
}

export const Icon = ({ type, width, height, color }: IconProps) => {
  return icons[type](width, height, color)
}

const icons: Icons = {
  cheveron: (width = 26, height = 16, color = '#0061FF') => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 26 16"
    >
      <path
        fill={color}
        d="M.96 1.324a1.666 1.666 0 000 2.36l11.08 11.08c.52.52 1.36.52 1.88 0L25 3.684a1.666 1.666 0 000-2.36 1.666 1.666 0 00-2.36 0l-9.667 9.653-9.666-9.666a1.662 1.662 0 00-2.347.013z"
      ></path>
    </svg>
  ),
}

export default Icon
