import React from 'react'

type IconTypes = 'cheveron' | 'check'
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
  check: (width = 23, height = 17, color = '#0061FF') => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 23 17"
    >
      <path
        fill={color}
        d="M7 13.56L2.373 8.933c-.52-.52-1.36-.52-1.88 0-.52.52-.52 1.36 0 1.88l5.574 5.574c.52.52 1.36.52 1.88 0L22.053 2.28c.52-.52.52-1.36 0-1.88-.52-.52-1.36-.52-1.88 0L7 13.56z"
      ></path>
    </svg>
  ),
}

export default Icon
