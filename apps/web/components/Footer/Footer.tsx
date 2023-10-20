import { useEffect, useState } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import type { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
  TextProps,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import type { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './Footer.css'

const IMAGE_WIDTH = 75

interface FooterProps {
  imageUrl?: string
  heading: string
  columns: FooterItem[]
  color?: TextProps['color']
  background?: string
  titleVariant?: TextProps['variant']
}

export const Footer = ({
  imageUrl,
  heading,
  columns,
  color,
  background,
  titleVariant = 'h3',
}: FooterProps) => {
  const { width } = useWindowSize()
  const [isMobileScreenWidth, setIsMobileScreenWidth] = useState(false)

  useEffect(() => {
    setIsMobileScreenWidth(width < theme.breakpoints.sm)
  }, [width])

  return (
    <footer className={styles.footer} style={{ background }}>
      <Box paddingTop={5} paddingBottom={5}>
        <GridContainer>
          <GridRow className={styles.noWrap}>
            {imageUrl && (
              <GridColumn hiddenBelow="sm">
                <img width={IMAGE_WIDTH} src={imageUrl} alt="" />
              </GridColumn>
            )}
            <GridColumn
              offset={isMobileScreenWidth ? '2/12' : undefined}
              className={styles.fullWidth}
            >
              <GridRow marginBottom={3} marginTop={2}>
                <GridColumn>
                  <Text color={color} variant={titleVariant} as="h2">
                    {heading}
                  </Text>
                </GridColumn>
              </GridRow>
              <GridRow>
                {columns.map((column, index) => (
                  <GridColumn
                    key={index}
                    span={
                      isMobileScreenWidth
                        ? '1/1'
                        : `${columns.length < 4 ? 4 : 3}/12`
                    }
                    paddingBottom={3}
                  >
                    <Box>
                      {column.title && (
                        <Text
                          color={color}
                          fontWeight="semiBold"
                          marginBottom={1}
                        >
                          <Hyphen>{column.title}</Hyphen>
                        </Text>
                      )}
                      {webRichText((column?.content ?? []) as SliceType[], {
                        renderNode: {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore make web strict
                          [BLOCKS.PARAGRAPH]: (_node, children) => {
                            return (
                              <Text
                                color={color}
                                variant="medium"
                                marginBottom={1}
                              >
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
