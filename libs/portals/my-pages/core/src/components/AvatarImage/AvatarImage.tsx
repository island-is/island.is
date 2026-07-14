import React, { FC, ReactNode, MouseEvent } from 'react'
import cn from 'classnames'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './AvatarImage.css'

interface Props {
  background: 'blue100' | 'blue200' | 'white'
  img?: string
  avatar?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
  large?: boolean
  as?: 'div' | 'button'
  imageClass?: string
  ariaLabel?: string
}

export const AvatarImage: FC<Props> = ({
  img,
  background,
  avatar,
  large,
  imageClass,
  as = 'button',
  onClick,
  ariaLabel,
}) => {
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
      borderRadius="full"
      className={cn(styles.imageContainer, {
        [styles.largeAvatar]: large,
      })}
      component={as}
      aria-label={as === 'button' ? ariaLabel : undefined}
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
