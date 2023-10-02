import React, { FC, ReactNode, MouseEvent } from 'react'

import { Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './DocumentLine.css'

interface Props {
  background: 'blue100' | 'blue200' | 'white'
  img?: string
  avatar?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
  large?: boolean
}

const AvatarImage: FC<Props> = ({
  img,
  background,
  avatar,
  large,
  onClick,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      background={background}
      style={
        background === 'blue100' ? { background: styles.dark50 } : undefined
      }
      borderRadius="circle"
      className={cn(styles.imageContainer, {
        [styles.largeAvatar]: large,
      })}
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
