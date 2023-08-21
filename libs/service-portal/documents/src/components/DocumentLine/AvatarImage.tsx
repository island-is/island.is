import React, { FC } from 'react'

import { Box } from '@island.is/island-ui/core'
import * as styles from './NewDocumentLine.css'

interface Props {
  background: 'blue100' | 'white'
  img?: string
}

const AvatarImage: FC<Props> = ({ img, background }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      background={background}
      borderRadius="circle"
      className={styles.imageContainer}
    >
      <img className={styles.image} src={img} alt="document" />
    </Box>
  )
}

export default AvatarImage
