import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import { LogoListSlice as ApiLogoListSlice } from '@island.is/api/schema'
import * as styles from './LogoListSlice.treat'

export const LogoListSlice: FC<ApiLogoListSlice> = ({ title, body, images }) => (
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
      {images.map((img, i) => (
        <img key={i} src={img.url} alt={img.title} className={styles.logo} />
      ))}
    </div>
  </div>
)

export default LogoListSlice
