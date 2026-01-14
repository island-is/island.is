import { ReactNode, useMemo } from 'react'
import cn from 'classnames'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Inline,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { theme } from '@island.is/island-ui/theme'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './HeilbrigdisstofnunAusturlandsFooter.css'

const ROWS_PER_COLUMN = 2

interface FooterColumnProps {
  rows: FooterItem[]
  span?: SpanType
  offset?: boolean
}

const FooterColumn = ({
  rows,
  span = ['8/8', '8/8', '3/12'],
  offset = false,
}: FooterColumnProps) => {
  if (rows.length <= 0) return null
  return (
    <GridColumn span={span} className={styles.line}>
      {rows.map((item, index) => (
        <Box
          key={`${item?.id}-${index}`}
          className={styles.locationBox}
          marginLeft={offset ? [0, 0, 0, 12] : 0}
        >
          {item?.link?.url ? (
            <Link href={item.link.url} color="white">
              <Text fontWeight="semiBold" color="white" marginBottom={1}>
                {item?.title && <Hyphen>{item.title}</Hyphen>}
              </Text>
            </Link>
          ) : (
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              {item?.title && <Hyphen>{item.title}</Hyphen>}
            </Text>
          )}

          {webRichText((item?.content as SliceType[]) ?? [], {
            renderNode: {
              [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                <Text
                  color="white"
                  variant="eyebrow"
                  fontWeight="regular"
                  lineHeight="xl"
                  marginBottom={2}
                >
                  {children}
                </Text>
              ),
            },
          })}
        </Box>
      ))}
    </GridColumn>
  )
}

const convertFooterItemsToFooterColumns = (footerItems: FooterItem[]) => {
  const columns: FooterColumnProps[] = [
    // First column should always just be a single element with an offset (that's according to the design of this footer)
    {
      rows: [footerItems[0]],
      offset: true,
    },
  ]

  // Group together rows of footer items and make them a single column
  let currentColumnIndex = 1
  for (const footerItem of footerItems.slice(1)) {
    if (columns.length <= currentColumnIndex) {
      columns[currentColumnIndex] = {
        rows: [],
        span: ['8/8', '8/8', '8/8', '1/7'],
      }
    }

    columns[currentColumnIndex].rows.push(footerItem)

    if (columns[currentColumnIndex].rows.length >= ROWS_PER_COLUMN) {
      currentColumnIndex += 1
    }
  }
  return columns
}

interface HeilbrigdisstofnunAusturlandsFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
  title: string
}

const HeilbrigdisstofnunAusturlandsFooter = ({
  footerItems,
  namespace,
  title,
}: HeilbrigdisstofnunAusturlandsFooterProps) => {
  const n = useNamespace(namespace)
  const footerColumns = useMemo(
    () => convertFooterItemsToFooterColumns(footerItems),
    [footerItems],
  )
  const { width } = useWindowSize()

  return (
    <footer>
      <div className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow>
              <Inline alignY="center" space={[2, 2, 4]} flexWrap="nowrap">
                <img
                  src={n(
                    'hsaFooterLogo',
                    'https://images.ctfassets.net/8k0h54kbe6bj/44TFwHDzzqdigcdedDyl3R/6e67c2ad327bc287769e235efbe9a639/So__l_og_fo__lk_5.svg',
                  )}
                  alt="heilbrigdisstofnun-austurlands-logo"
                  width={74}
                  height={83}
                />
                <Text variant="h2" color="white">
                  {title}
                </Text>
              </Inline>
            </GridRow>

            <GridRow
              className={cn(styles.gridRow, {
                [styles.offset]: width < theme.breakpoints.lg,
              })}
            >
              {footerColumns.map((columnProps, index) => (
                <FooterColumn key={index} {...columnProps} />
              ))}
            </GridRow>

            <GridRow align="flexEnd" marginTop={3}>
              <Box marginRight={[4, 4, 12]}>
                <Inline alignY="center" align="center" space={5}>
                  <img
                    src={n(
                      'hsnGraenSkrefLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/2QMl8Mw50Vj0AjlI6jzENH/cc4792e02ff1b152ede7e892da333669/greenSteps.png',
                    )}
                    alt="graen-skref"
                    width={90}
                  />
                  <img
                    src={n(
                      'hsaJafnlaunavottunLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/6XsDTU75XBm3T3C2sBjY16/9dd3c2c3751ab048810319d5d48e3704/PNG_Jafnlaunavottun_2025_2028_f_dokkan_grunn.png',
                    )}
                    alt="jafnlaunavottun"
                    width={78}
                  />

                  <img
                    width={44}
                    height={69}
                    src={n(
                      'hsaJafnvaegisvogLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/6W78mpRwfZ9hmz6JzBB7wb/05c10af5db53615d9d5138e3336b2fbd/vidurkenning_2025_gull.png',
                    )}
                    alt="jafnvaegisvog-vidurkenning"
                  />
                </Inline>
              </Box>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </div>
    </footer>
  )
}

export default HeilbrigdisstofnunAusturlandsFooter
