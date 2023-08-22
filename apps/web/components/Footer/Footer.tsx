import { BLOCKS } from '@contentful/rich-text-types'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import type { SliceType } from '@island.is/island-ui/contentful'
import type { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './Footer.css'

const IMAGE_WIDTH = 75
const IMAGE_MARGIN_RIGHT = 3

interface FooterProps {
  imageUrl?: string
  heading: string
  columns: FooterItem[]
}

export const Footer = ({ imageUrl, heading, columns }: FooterProps) => {
  const { width } = useWindowSize()

  const isMobileScreenWidth = width < theme.breakpoints.sm

  // TODO: figure out heading padding and why it's not aligning with first column

  return (
    <footer className={styles.footer}>
      <Box paddingTop={3} paddingBottom={5}>
        <GridContainer>
          <GridColumn offset={isMobileScreenWidth ? '2/12' : undefined}>
            <Box
              columnGap={IMAGE_MARGIN_RIGHT}
              display="flex"
              alignItems="center"
              marginBottom={3}
            >
              {imageUrl && (
                <Hidden below="sm">
                  <img width={IMAGE_WIDTH} src={imageUrl} alt="" />
                </Hidden>
              )}
              <GridColumn>
                <Text variant="h2">{heading}</Text>
              </GridColumn>
            </Box>
            <GridRow className={styles.noWrap}>
              {imageUrl && !isMobileScreenWidth && (
                <GridColumn>
                  <Box marginRight={IMAGE_MARGIN_RIGHT}>
                    <img
                      style={{
                        visibility: 'hidden',
                      }}
                      src={imageUrl}
                      width={IMAGE_WIDTH}
                      alt=""
                    />
                  </Box>
                </GridColumn>
              )}
              <GridRow>
                {columns.map((column, index) => (
                  <GridColumn
                    key={index}
                    span={isMobileScreenWidth ? '1/1' : undefined}
                    paddingBottom={3}
                  >
                    <Box marginRight={3}>
                      {column.title && (
                        <Text fontWeight="semiBold" marginBottom={1}>
                          <Hyphen>{column.title}</Hyphen>
                        </Text>
                      )}
                      {webRichText((column?.content ?? []) as SliceType[], {
                        renderNode: {
                          [BLOCKS.PARAGRAPH]: (_node, children) => {
                            return (
                              <Text variant="medium" marginBottom={1}>
                                {children}
                              </Text>
                            )
                          },
                        },
                      })}
                    </Box>
                  </GridColumn>
                ))}
              </GridRow>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default Footer
