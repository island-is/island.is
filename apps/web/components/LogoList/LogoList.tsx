import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import * as styles from './LogoList.treat'

export interface LogoListProps {
  title: string
  body?: string
  images: string[]
}

export const LogoList: FC<LogoListProps> = ({ title, body, images }) => (
  <div>
    <Typography variant="h1" as="h2" color="white">
      {title}
    </Typography>
    <Box paddingTop={3} paddingBottom={5}>
      <Typography variant="intro" as="p" color="white">
        {body}
      </Typography>
    </Box>
    <div className={styles.logos}>
      {images.map((src, i) => (
        <img key={i + src} src={src} alt="" className={styles.logo} />
      ))}
    </div>
  </div>
)

export default LogoList
