import React from 'react'
import { theme } from '../../theme'

type IconTypes = 'cheveron' | 'check' | 'arrow' | 'caret'

type Icons = {
  [Type in IconTypes]: {
    width: string | number
    height: string | number
    viewBox: string
    path: string
  }
}

export interface IconProps {
  type: IconTypes
  width?: string | number
  height?: string | number
  color?: string
  fill?: string
  title?: string
}

export interface SvgPathContainerProps {
  viewBox: string
  path: string
  width?: string | number
  height?: string | number
  color?: string
  fill?: string
  title?: string
}

const iconsConf: Icons = {
  cheveron: {
    width: 26,
    height: 16,
    viewBox: '0 0 26 16',
    path:
      'M.96 1.324a1.666 1.666 0 000 2.36l11.08 11.08c.52.52 1.36.52 1.88 0L25 3.684a1.666 1.666 0 000-2.36 1.666 1.666 0 00-2.36 0l-9.667 9.653-9.666-9.666a1.662 1.662 0 00-2.347.013z',
  },
  check: {
    width: 23,
    height: 17,
    viewBox: '0 0 23 17',
    path:
      'M7 13.56L2.373 8.933c-.52-.52-1.36-.52-1.88 0-.52.52-.52 1.36 0 1.88l5.574 5.574c.52.52 1.36.52 1.88 0L22.053 2.28c.52-.52.52-1.36 0-1.88-.52-.52-1.36-.52-1.88 0L7 13.56z',
  },
  arrow: {
    width: 22,
    height: 22,
    viewBox: '0 0 22 22',
    path:
      'M1.66668 12.3333H16.56L10.0533 18.84C9.53334 19.36 9.53334 20.2133 10.0533 20.7333C10.5733 21.2533 11.4133 21.2533 11.9333 20.7333L20.72 11.9467C21.24 11.4267 21.24 10.5867 20.72 10.0667L11.9467 1.26668C11.4267 0.746678 10.5867 0.746678 10.0667 1.26668C9.54668 1.78668 9.54668 2.62668 10.0667 3.14668L16.56 9.66668H1.66668C0.933343 9.66668 0.333344 10.2667 0.333344 11C0.333344 11.7333 0.933343 12.3333 1.66668 12.3333Z',
  },
  caret: {
    width: 6,
    height: 10,
    viewBox: '0 0 6 10',
    path:
      'M0.354609 1.03252C0.0458594 1.32502 0.0458594 1.79752 0.354609 2.09002L3.42628 5.00002L0.354609 7.91002C0.0458594 8.20252 0.0458594 8.67502 0.354609 8.96752C0.663359 9.26002 1.16211 9.26002 1.47086 8.96752L5.10461 5.52502C5.41336 5.23252 5.41336 4.76002 5.10461 4.46752L1.47086 1.02502C1.17003 0.740016 0.663359 0.740017 0.354609 1.03252Z',
  },
}

const SvgPathContainer = ({
  width,
  height,
  color = theme.color.blue400,
  viewBox,
  fill = 'none',
  path,
  title,
}: SvgPathContainerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox={viewBox}
    >
      {title && <title>{title}</title>}
      <path fill={color} d={path}></path>
    </svg>
  )
}

export const Icon = ({
  type,
  width,
  height,
  color = '#0061FF',
  fill = 'none',
  title,
}: IconProps) => {
  return (
    <SvgPathContainer
      path={iconsConf[type].path}
      viewBox={iconsConf[type].viewBox}
      width={width ?? iconsConf[type].width}
      height={height ?? iconsConf[type].height}
      color={color}
      fill={fill}
      title={title}
    />
  )
}

export default Icon
