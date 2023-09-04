import { BLOCKS } from '@contentful/rich-text-types'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import type { SliceType } from '@island.is/island-ui/contentful'
import type { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './Footer.css'

const IMAGE_WIDTH = 75

interface FooterProps {
  imageUrl?: string
  heading: string
  columns: FooterItem[]
}

export const Footer = ({ imageUrl, heading, columns }: FooterProps) => {
  const { width } = useWindowSize()

  const isMobileScreenWidth = width < theme.breakpoints.sm

  return (
    <footer className={styles.footer}>
      <Box paddingTop={3} paddingBottom={5}>
        <GridContainer>
          <GridRow className={styles.noWrap}>
            <GridColumn hiddenBelow="sm">
              <img width={IMAGE_WIDTH} src={imageUrl} alt="" />
            </GridColumn>
            <GridColumn offset={isMobileScreenWidth ? '2/12' : undefined}>
              <GridRow marginBottom={3} marginTop={2}>
                <GridColumn>
                  <Text variant="h2">{heading}</Text>
                </GridColumn>
              </GridRow>
              <GridRow>
                {columns.map((column, index) => (
                  <GridColumn
                    key={index}
                    span={isMobileScreenWidth ? '1/1' : undefined}
                    paddingBottom={3}
                  >
                    <Box marginRight={5}>
                      {column.title && (
                        <Text fontWeight="semiBold" marginBottom={1}>
                          <Hyphen>{column.title}</Hyphen>
                        </Text>
                      )}
                      {webRichText((column?.content ?? []) as SliceType[], {
                        renderNode: {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
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
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default Footer
