import React from 'react'

import * as styles from './SkeletonLoader.treat'

export interface SkeletonLoaderProps {
  width?: string | number
  height?: string | number
  repeat?: number
}

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
