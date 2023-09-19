import React, { FC, ReactNode, MouseEvent } from 'react'

import { Box, Icon } from '@island.is/island-ui/core'
import * as styles from './NewDocumentLine.css'

interface Props {
  background: 'blue100' | 'blue200' | 'white'
  img?: string
  avatar?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
}

const AvatarImage: FC<Props> = ({ img, background, avatar, onClick }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      background={background}
      borderRadius="circle"
      className={styles.imageContainer}
      onClick={onClick}
    >
      {avatar ? (
        avatar
      ) : (
        <img className={styles.image} src={img} alt="document" />
      )}
    </Box>
  )
}

export default AvatarImage
