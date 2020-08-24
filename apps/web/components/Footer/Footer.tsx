/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import cn from 'classnames'
import {
  ContentBlock,
  Box,
  Logo,
  Stack,
  Tiles,
  Typography,
  Inline,
  Tag,
} from '@island.is/island-ui/core'

import * as styles from './Footer.treat'
import { categories } from '@island.is/web/json'

interface FooterProps {}

export const Footer: FC<FooterProps> = () => {
  return (
    <>
      <Box width="full" background="blue100">
        <ContentBlock>
          <Box padding={[3, 3, 6]}>
            <div className={styles.columns}>
              <div className={cn(styles.column, styles.columnBorder)}>
                <Stack space={3}>
                  <Stack space={3}>
                    <Typography variant="h3" color="blue400">
                      <a href="#">Um Ísland.is</a>
                    </Typography>
                    <Typography variant="h3" color="blue400">
                      <a href="#">Stofnanir</a>
                    </Typography>
                    <Typography variant="h3" color="blue400">
                      <a href="#">Hafa samband</a>
                    </Typography>
                  </Stack>
                  <Stack space={2}>
                    <Typography variant="h5" color="blue400">
                      <a href="#">English</a>
                    </Typography>
                    <Typography variant="h5" color="blue400">
                      <a href="#">Facebook</a>
                    </Typography>
                    <Typography variant="h5" color="blue400">
                      <a href="#">Persónuverndarstefna</a>
                    </Typography>
                  </Stack>
                </Stack>
              </div>
              <div
                className={cn(
                  styles.column,
                  styles.columnLarge,
                  styles.columnBorder,
                )}
              >
                <Stack space={3}>
                  <Stack space={3}>
                    <Typography variant="eyebrow" color="purple400">
                      Þjónustuflokkar
                    </Typography>
                    <Tiles space={2} columns={2}>
                      {categories.map(({ title }) => {
                        return (
                          <Typography variant="h5" color="blue400">
                            <a href="#">{title}</a>
                          </Typography>
                        )
                      })}
                    </Tiles>
                  </Stack>
                </Stack>
              </div>
              <div className={styles.column}>
                <Stack space={3}>
                  <Stack space={3}>
                    <Typography variant="eyebrow" color="purple400">
                      Flýtileiðir
                    </Typography>
                    <Inline space={2}>
                      {categories.map(({ title }) => {
                        return <Tag variant="white">{title}</Tag>
                      })}
                    </Inline>
                  </Stack>
                </Stack>
              </div>
            </div>
          </Box>
        </ContentBlock>
      </Box>
      <Box width="full" background="blue400">
        <ContentBlock>
          <Box width="full">
            <Box padding={[3, 3, 6]}>
              <Stack space={3}>
                <Stack space={3}>
                  <Typography variant="eyebrow" color="white">
                    Aðrir opinberir vefir
                  </Typography>
                  <Tiles space={2} columns={4}>
                    {categories.map(({ title }) => {
                      return (
                        <Typography variant="h5" color="white">
                          <a href="#">{title}</a>
                        </Typography>
                      )
                    })}
                  </Tiles>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </ContentBlock>
      </Box>
    </>
  )
}

export default Footer
