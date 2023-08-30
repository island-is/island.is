import React, { Suspense, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import iconMap from './iconMap'
import { Box } from '../Box/Box'
import * as styles from './Icon.css'
import type { IconProps, SvgProps, PlaceholderProps } from './types'

const colors = theme.color

const sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
}

const Placeholder = ({
  skipPlaceholderSize,
  size,
  className,
}: PlaceholderProps) => (
  <Box
    component="span"
    display="inlineBlock"
    className={cn(className, {
      [styles.placeholder[size]]: !skipPlaceholderSize && size,
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
  const [isMounted, setIsMounted] = useState(false)
  const path = iconMap[type][icon]
  const IconSvg = useMemo(
    () => React.lazy(() => import('./icons/' + path)),
    [path],
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
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
