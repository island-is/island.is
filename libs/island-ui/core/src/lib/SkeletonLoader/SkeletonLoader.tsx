import React from 'react'
import cn from 'classnames'
import * as styles from './SkeletonLoader.treat'
import { Stack, StackProps } from '../Stack/Stack'
import { Theme } from '@island.is/island-ui/theme'

export interface SkeletonLoaderProps {
  /**
   * Define a fixed width, default skeleton loader will fill remaining space
   */
  width?: string | number
  /**
   * Define a fixed height, default skeleton loader will fill remaining space
   */
  height?: string | number
  /**
   * Adds multiple lines of skeleton loader, usefull for mimicking block of text
   */
  repeat?: number
  /**
   * Define a space between each skeleton loader
   */
  space?: StackProps['space']
  /**
   * Define the border radius of the loader
   */
  borderRadius?: keyof Theme['border']['radius']
}
/**
 * Animated content placeholder to manage user expectations
 */
export const SkeletonLoader = ({
  width,
  height,
  repeat = 1,
  space = 0,
  borderRadius,
}: SkeletonLoaderProps) => {
  return (
    <Stack space={space}>
      {[...Array(repeat)].map((_key, index) => (
        <span
          key={index}
          className={cn(styles.loader, styles.borderRadius[borderRadius!])}
          style={{
            ...(height && { height }),
            ...(width && { width }),
          }}
        />
      ))}
    </Stack>
  )
}
