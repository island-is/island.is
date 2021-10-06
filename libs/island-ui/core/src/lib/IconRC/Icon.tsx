import React, { Suspense, useMemo } from 'react'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import iconMap, { Icon as IconType, Type } from './iconMap'
import { Box } from '../Box/Box'
import * as styles from './Icon.treat'

const colors = theme.color

export type Size = 'small' | 'medium' | 'large'
export type IconMapType = Type
export type IconMapIcon = IconType

export interface IconProps {
  type?: Type
  icon: IconType
  title?: string
  titleId?: string
  color?: keyof typeof colors
  size?: Size
  className?: string
  skipPlaceholderSize?: boolean
  ariaHidden?: boolean
}

export interface SvgProps {
  title?: string
  titleId?: string
  className?: string
  width?: string
  height?: string
  fill?: string
  color?: string
}

const sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
}

const Placeholder = ({
  skipPlaceholderSize,
  size,
  className,
}: Pick<IconProps, 'skipPlaceholderSize' | 'size' | 'className'>) => (
  <Box
    component="span"
    display="inlineBlock"
    className={cn(className, {
      [styles.placeholder[size!]]: !skipPlaceholderSize && size,
    })}
  />
)

export const Icon = ({
  icon,
  type = 'filled',
  color = 'currentColor',
  size = 'medium',
  className,
  title,
  titleId,
  skipPlaceholderSize,
  ariaHidden,
}: IconProps) => {
  const path = iconMap[type][icon]
  const IconSvg = useMemo(() => React.lazy(() => import('./icons/' + path)), [
    path,
  ])
  if (typeof window === 'undefined') {
    return (
      <Placeholder
        skipPlaceholderSize={skipPlaceholderSize}
        size={size}
        className={className}
      />
    )
  }
  const optionalProps: SvgProps = {}
  if (className) {
    optionalProps.className = className
  }
  if (title) {
    optionalProps.title = title
  }
  if (titleId) {
    optionalProps.titleId = titleId
  }
  if (size) {
    optionalProps.width = sizes[size]
    optionalProps.height = sizes[size]
  }
  return (
    <Suspense
      fallback={
        <Placeholder
          skipPlaceholderSize={skipPlaceholderSize}
          size={size}
          className={className}
        />
      }
    >
      <IconSvg
        data-testid={`icon-${icon}`}
        aria-hidden={ariaHidden}
        fill={colors[color]}
        color={colors[color]}
        {...optionalProps}
      />
    </Suspense>
  )
}
