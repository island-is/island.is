import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import * as styles from './LogoList.treat'

export interface LogoListProps {
  title: string
  body: string
  images: string[]
}

export const LogoList: FC<LogoListProps> = ({ title, body, images }) => (
  <div>
    <Typography variant="h1" as="h2" color="white">
      {title}
    </Typography>
    <Box paddingTop={3} marginBottom={7}>
      <Typography variant="intro" as="p" color="white">
        {body}
      </Typography>
    </Box>
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="spaceBetween"
      className={styles.logos}
    >
      {images.map((src, i) => (
        <Box marginLeft={5} marginRight={5} marginBottom={5}>
          <img key={i} src={src} alt="" />
        </Box>
      ))}
    </Box>
  </div>
)

export default LogoList
