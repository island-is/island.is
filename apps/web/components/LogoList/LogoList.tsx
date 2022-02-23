import React from 'react'
import {
  Text,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './LogoList.css'
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
    <GridContainer>
      <GridRow>
        <GridColumn
          paddingTop={3}
          paddingBottom={7}
          span={['12/12', '12/12', '12/12', '6/12']}
        >
          <Text as="p" color={variant === 'light' ? 'white' : 'dark400'}>
            {body}
          </Text>
        </GridColumn>
      </GridRow>
    </GridContainer>
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
