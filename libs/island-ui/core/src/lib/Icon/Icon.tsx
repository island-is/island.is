import React from 'react'
import cn from 'classnames'
import { Colors, theme } from '../../theme/theme'

import * as styles from './Icon.treat'

export type IconTypes =
  | 'cheveron'
  | 'check'
  | 'arrow'
  | 'caret'
  | 'bullet'
  | 'external'
  | 'loading'

type Icons = {
  [Type in IconTypes]: {
    width: string | number
    height: string | number
    viewBox: string
    path?: string
    circle?: object
  }
}

export interface IconProps {
  type: IconTypes
  width?: string | number
  height?: string | number
  color?: Colors
  fill?: string
  title?: string
  spin?: boolean
}

export interface SvgPathContainerProps {
  viewBox: string
  path?: string
  width?: string | number
  height?: string | number
  color?: Colors
  fill?: string
  title?: string
  circle?: object
  spin?: boolean
}

const iconsConf: Icons = {
  loading: {
    width: 18,
    height: 20,
    viewBox: '0 0 18 20',
    path:
      'M8.9988 3.25C6.16798 3.25 3.74126 4.99298 2.73899 7.46902C2.47996 8.10894 1.75122 8.4177 1.1113 8.15867C0.471382 7.89964 0.162613 7.1709 0.421645 6.53098C1.79292 3.14336 5.11486 0.75 8.9988 0.75C12.8827 0.75 16.2047 3.14336 17.576 6.53098C17.835 7.1709 17.5262 7.89964 16.8863 8.15867C16.2464 8.4177 15.5176 8.10894 15.2586 7.46902C14.2563 4.99298 11.8296 3.25 8.9988 3.25ZM1.1113 11.8413C1.75122 11.5823 2.47996 11.8911 2.73899 12.531C3.74126 15.007 6.16798 16.75 8.9988 16.75C11.8296 16.75 14.2563 15.007 15.2586 12.531C15.5176 11.8911 16.2464 11.5823 16.8863 11.8413C17.5262 12.1004 17.835 12.8291 17.576 13.469C16.2047 16.8566 12.8827 19.25 8.9988 19.25C5.11486 19.25 1.79292 16.8566 0.421645 13.469C0.162613 12.8291 0.471382 12.1004 1.1113 11.8413Z',
  },
  external: {
    width: 18,
    height: 18,
    viewBox: '0 0 18 18',
    path:
      'M0 10H2V8H0V10ZM0 14H2V12H0V14ZM2 18V16H0C0 17.1 0.89 18 2 18ZM0 6H2V4H0V6ZM12 18H14V16H12V18ZM16 0H6C4.89 0 4 0.9 4 2V12C4 13.1 4.89 14 6 14H16C17.1 14 18 13.1 18 12V2C18 0.9 17.1 0 16 0ZM15 12H7C6.45 12 6 11.55 6 11V3C6 2.45 6.45 2 7 2H15C15.55 2 16 2.45 16 3V11C16 11.55 15.55 12 15 12ZM8 18H10V16H8V18ZM4 18H6V16H4V18Z',
  },
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
  bullet: {
    width: 10,
    height: 10,
    viewBox: '0 0 10 10',
    circle: {
      cx: 5,
      cy: 5,
      r: 5,
    },
  },
}

const SvgPathContainer = ({
  width,
  height,
  color = 'blue400',
  viewBox,
  fill = 'none',
  path,
  title,
  circle,
  spin,
}: SvgPathContainerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fill}
      viewBox={viewBox}
      className={cn({ [styles.spin]: spin })}
    >
      {title && <title>{title}</title>}
      {path && <path className={styles.colors[color]} d={path}></path>}
      {circle && <circle className={styles.colors[color]} {...circle} />}
    </svg>
  )
}

export const Icon = ({
  type,
  width,
  height,
  color,
  fill = 'none',
  title,
  spin,
}: IconProps) => {
  return (
    <SvgPathContainer
      path={iconsConf[type].path}
      circle={iconsConf[type].circle}
      viewBox={iconsConf[type].viewBox}
      width={width ?? iconsConf[type].width}
      height={height ?? iconsConf[type].height}
      color={color}
      fill={fill}
      title={title}
      spin={spin}
    />
  )
}

export default Icon
