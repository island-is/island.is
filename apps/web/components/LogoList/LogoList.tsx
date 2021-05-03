import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'
import * as styles from './LogoList.treat'
import cn from 'classnames'

export interface LogoListProps {
  title: string
  body: string
  images: string[]
  variant?: 'light' | 'dark'
}

export const LogoList = ({
  title,
  body,
  images,
  variant = 'light',
}: LogoListProps) => (
  <div>
    <Text
      variant="h1"
      as="h2"
      color={variant === 'light' ? 'white' : 'dark400'}
    >
      {title}
    </Text>
    <Box paddingTop={3} marginBottom={7}>
      <Text
        variant="intro"
        as="p"
        color={variant === 'light' ? 'white' : 'dark400'}
      >
        {body}
      </Text>
    </Box>
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="spaceBetween"
    >
      {images.map((src, i) => (
        <Box
          marginBottom={5}
          className={
            variant === 'light'
              ? styles.logo
              : cn(styles.logo, styles.invertedLogo)
          }
          key={i}
        >
          <img src={src} alt="" />
        </Box>
      ))}
    </Box>
  </div>
)

export default LogoList
