import React, { FC, ReactNode } from 'react'
import {
  Box,
  Tiles,
  Button,
  Stack,
  Typography,
  Tag,
  Inline,
} from '@island.is/island-ui/core'

import * as styles from './Categories.treat'

interface CategoriesProps {
  label?: string
  seeMoreText?: string
  children: ReactNode
}

export const Categories: FC<CategoriesProps> = ({
  seeMoreText = 'Sjá fleiri',
  children,
}) => {
  const tags = [
    'Styrkir',
    'Bætur',
    'Lán',
    'Skattamál',
    'Einstaklingar',
    'Fyrirtæki',
    'Atvinnulíf',
    'Ferðaþjónusta',
    'Tölfræði',
  ]

  const states = ['Í undirbúningi', 'Í framkvæmd', 'Lokið']

  return (
    <Box padding={[3, 3, 6]}>
      <Stack space={6}>
        <Box className={styles.filters}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginRight={[0, 0, 3]}
            border="standard"
          >
            <Stack space={3}>
              <Inline space={2} alignY="center">
                <Typography variant="tag" color="red600">
                  Staða aðgerðar:
                </Typography>
                {states.map((tag, index) => {
                  return <Tag label>{tag}</Tag>
                })}
              </Inline>
              <Inline space={2} alignY="center">
                <Typography variant="tag" color="red600">
                  Málefni:
                </Typography>
                {tags.map((tag, index) => {
                  return <Tag label>{tag}</Tag>
                })}
              </Inline>
            </Stack>
          </Box>
          <Box
            display="flex"
            marginTop={[3, 3, 0]}
            alignItems="center"
            border="standard"
          >
            <input />
          </Box>
        </Box>
        <Tiles space={[2, 2, 3]} columns={[1, 1, 2, 2, 3]}>
          {children}
        </Tiles>
        <Box textAlign="center">
          <Button
            onClick={() => {
              console.log('load more cards...')
            }}
            variant="ghost"
          >
            {seeMoreText}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

export default Categories
