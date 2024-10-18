import React, { FC, ReactNode, MouseEvent } from 'react'
import { messages } from '../../utils/messages'

import { Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './DocumentLine.css'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  background: 'blue100' | 'blue200' | 'white'
  img?: string
  avatar?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
  large?: boolean
  as?: 'div' | 'button'
  imageClass?: string
}

export const AvatarImage: FC<Props> = ({
  img,
  background,
  avatar,
  large,
  imageClass,
  as = 'button',
  onClick,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      background={background}
      style={
        background === 'blue100'
          ? { background: theme.color.blueberry100 }
          : undefined
      }
      borderRadius="circle"
      className={cn(styles.imageContainer, {
        [styles.largeAvatar]: large,
      })}
      component={as}
      aria-label={
        as === 'button'
          ? formatMessage(messages.markAsBulkSelection)
          : undefined
      }
      onClick={onClick}
    >
      {avatar ? (
        avatar
      ) : (
        <img
          className={cn(styles.image, {
            [`${imageClass}`]: imageClass,
          })}
          src={img}
          alt=""
        />
      )}
    </Box>
  )
}

export default AvatarImage
