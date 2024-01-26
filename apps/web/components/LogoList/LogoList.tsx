import React from 'react'
import cn from 'classnames'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import * as styles from './LogoList.css'

export interface LogoListProps {
  id: string
  title: string
  body: string
  images: string[]
  variant?: 'light' | 'dark'
}

export const LogoList = ({
  id,
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
      id={'sliceTitle-' + id}
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
