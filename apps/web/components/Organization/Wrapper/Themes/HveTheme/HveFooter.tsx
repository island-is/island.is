import { ReactNode, useMemo } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './HveFooter.css'

const ROWS_PER_COLUMN = 2

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

interface HveFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
  logo?: string
  title?: string
}

const HveFooter = ({ footerItems, namespace, logo, title }: HveFooterProps) => {
  const n = useNamespace(namespace)
  const footerColumns = useMemo(
    () => convertFooterItemsToFooterColumns(footerItems),
    [footerItems],
  )

  return (
    <footer>
      <div className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow className={styles.firstRow}>
              <img src={n('hveFooterLogo', logo)} alt="hve-logo" width={80} />
              <Text variant="h2" as="div">
                {n('hveFooterTitle', title)}
              </Text>
            </GridRow>

            <GridRow className={styles.line}>
              {footerColumns.map((columnProps, index) => (
                <FooterColumn key={index} {...columnProps} />
              ))}
            </GridRow>
          </GridColumn>
        </GridContainer>
      </div>
    </footer>
  )
}

export default HveFooter
