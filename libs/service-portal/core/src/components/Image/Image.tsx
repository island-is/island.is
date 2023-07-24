import { FC, useState, useEffect } from 'react'
import cn from 'classnames'
import * as styles from './Image.css'
import { useMountedState } from 'react-use'
import { Box } from '@island.is/island-ui/core'

export interface ImageProps {
  url: string
  title: string
  height?: string
  width?: string
}

export const Image: FC<ImageProps> = ({ url, title, height, width }) => {
  return (
    <Box className={styles.container} style={{ height, width }}>
      <img
        src={`data:image/png;base64,${url}`}
        alt={title}
        className={cn(styles.image)}
      />
    </Box>
  )
}

export default Image
