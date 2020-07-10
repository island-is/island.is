import React from 'react'

import * as styles from './SkeletonLoader.treat'

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
}
/**
 * Animated placeholder for content to manage user expectations
 */
export const SkeletonLoader = ({
  width,
  height,
  repeat = 1,
}: SkeletonLoaderProps) => {
  const loaders: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >[] = []
  for (let i = 0; i < repeat; i++) {
    loaders.push(
      <span
        key={i}
        className={styles.loader}
        style={{
          ...(height && { height }),
          ...(width && { width }),
        }}
      />,
    )
  }
  return <>{loaders}</>
}

export default SkeletonLoader
