import { theme } from '@island.is/island-ui/theme'
import React, { Suspense, useMemo } from 'react'
import iconMap from './iconMap'

const colors = theme.color

export type IconPropsType =
  | {
      type: 'filled'
      icon: keyof typeof iconMap.filled
    }
  | {
      type: 'outline'
      icon: keyof typeof iconMap.outline
    }
  | {
      type: 'sharp'
      icon: keyof typeof iconMap.sharp
    }
interface IconProps {
  title?: string
  titleId?: string
  color?: keyof typeof colors
  size?: 'small' | 'medium' | 'large'
  className?: string
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

export const Icon = ({
  icon,
  type = 'filled',
  color = 'currentColor',
  size = 'medium',
  className,
  title,
  titleId,
}: IconProps & IconPropsType) => {
  const path = iconMap[type!][icon!]

  const IconSvg = useMemo(() => React.lazy(() => import('./icons/' + path)), [
    path,
  ])
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
        <span
          style={{
            display: 'inline-block',
            width: sizes[size],
            height: sizes[size],
          }}
        />
      }
    >
      <IconSvg fill={colors[color]} color={colors[color]} {...optionalProps} />
    </Suspense>
  )
}
