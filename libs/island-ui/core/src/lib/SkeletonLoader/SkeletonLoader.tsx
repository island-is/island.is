import React from 'react'

import * as styles from './SkeletonLoader.treat'
import { Stack, StackProps } from '../Stack/Stack'

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
}
/**
 * Animated content placeholder to manage user expectations
 */
export const SkeletonLoader = ({
  width,
  height,
  repeat = 1,
  space = 0,
}: SkeletonLoaderProps) => {
  return (
    <Stack space={space}>
      {[...Array(repeat)].map((_key, index) => (
        <span
          key={index}
          className={styles.loader}
          style={{
            ...(height && { height }),
            ...(width && { width }),
          }}
        />
      ))}
    </Stack>
  )
}

export default SkeletonLoader
