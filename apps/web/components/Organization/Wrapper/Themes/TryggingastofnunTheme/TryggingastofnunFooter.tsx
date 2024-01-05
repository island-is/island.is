import { BLOCKS } from '@contentful/rich-text-types'
import { ReactNode, useMemo } from 'react'
import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridContainer,
  Text,
  GridRow,
  GridColumn,
  Inline,
  Link,
  Hyphen,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './TryggingastofnunFooter.css'

const ROWS_PER_COLUMN = 1

interface FooterColumnProps {
  rows: FooterItem[]
  span?: SpanType
  offset?: boolean
}

const FooterColumn = ({
  rows,
  span = ['8/8', '4/8', '2/8'],
  offset = false,
}: FooterColumnProps) => {
  if (rows.length <= 0) return null
  return (
    <GridColumn span={span}>
      {rows.map((item, index) => (
        <Box
          key={`${item?.id}-${index}`}
          className={styles.locationBox}
          marginLeft={offset ? [0, 0, 0, 10] : 0}
        >
          {item?.link?.url ? (
            <Link href={item.link.url}>
              <Text fontWeight="semiBold" marginBottom={1}>
                {item?.title && <Hyphen>{item.title}</Hyphen>}
              </Text>
            </Link>
          ) : (
            <Text fontWeight="semiBold" marginBottom={1}>
              {item?.title && <Hyphen>{item.title}</Hyphen>}
            </Text>
          )}

          {webRichText((item?.content as SliceType[]) ?? [], {
            renderNode: {
              [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                <Text
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
        span: ['8/8', '8/8', '8/8', '2/12'],
      }
    }

    columns[currentColumnIndex].rows.push(footerItem)

    if (columns[currentColumnIndex].rows.length >= ROWS_PER_COLUMN) {
      currentColumnIndex += 1
    }
  }
  return columns
}

interface TryggingastofnunFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

const TryggingastofnunFooter = ({
  footerItems,
  namespace,
}: TryggingastofnunFooterProps) => {
  const n = useNamespace(namespace)

  const footerColumns = useMemo(
    () => convertFooterItemsToFooterColumns(footerItems),
    [footerItems],
  )

  return (
    <footer className={styles.container} aria-labelledby="sak-footer">
      <GridContainer>
        <Box className={styles.firstRow}>
          <img
            src={n(
              'tryggingastofnunFooterLogo',
              'https://images.ctfassets.net/8k0h54kbe6bj/3csqUjeIiV6JbGTE87vImq/65a76e9f888d649dffdd92f90db16634/TR-logo-Tryggingastofnun-new-1_2.svg',
            )}
            alt=""
          />
        </Box>

        <Box marginY={2} borderTopWidth="standard" />

        <GridRow>
          {footerColumns.map((columnProps, index) => (
            <FooterColumn key={index} {...columnProps} />
          ))}
        </GridRow>

        <Box marginY={2} borderTopWidth="standard" />

        <GridRow align="flexEnd">
          <Box marginRight={8}>
            <Inline space={2} alignY="center">
              <img
                src={n(
                  'tryggingastofnunJafnlaunavottunLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/7u2nCqCHlE26Wi7L2b7JO8/e0aadaeeab1306e733ee67ffb4529ace/jafnlaunavottun_adalmerki_2020_2023_f_ljosan_grunn_1.svg',
                )}
                alt="jafnlaunavottun"
              />
              <img
                src={n(
                  'tryggingastofnunJafnvaegisvogLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/3xbTRkA5kja6EnrUTisK8F/332ab7f983bf2f802c4d1b05ec639f4a/vidurkenning_merki_2022_gull-hsu_1.svg',
                )}
                alt="international-accreditation-healthcare"
              />
            </Inline>
          </Box>
        </GridRow>
      </GridContainer>
    </footer>
  )
}

export default TryggingastofnunFooter
