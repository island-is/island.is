import { ReactNode, useMemo } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Hyphen,
  Inline,
  Link,
} from '@island.is/island-ui/core'
import { webRichText } from '@island.is/web/utils/richText'
import { FooterItem } from '@island.is/web/graphql/schema'
import { SliceType } from '@island.is/island-ui/contentful'
import { SpanType } from '@island.is/island-ui/core/types'
import { useNamespace } from '@island.is/web/hooks'
import * as styles from './HeilbrigdisstofnunSudurlandsFooter.css'

const ROWS_PER_COLUMN = 3

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
        span: ['8/8', '4/8', '2/8', '2/12'],
      }
    }

    columns[currentColumnIndex].rows.push(footerItem)

    if (columns[currentColumnIndex].rows.length >= ROWS_PER_COLUMN) {
      currentColumnIndex += 1
    }
  }
  return columns
}

interface HeilbrigdisstofnunSudurlandsFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

const HeilbrigdisstofnunSudurlandsFooter = ({
  footerItems,
  namespace,
}: HeilbrigdisstofnunSudurlandsFooterProps) => {
  const n = useNamespace(namespace)
  const footerColumns = useMemo(
    () => convertFooterItemsToFooterColumns(footerItems),
    [footerItems],
  )

  return (
    <footer aria-labelledby="heilbrigdisstofnun-sudurlands-footer">
      <div className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow>
              <img
                src={n(
                  'hsuFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/4OcAjYnwPUP4dwFA6duFaB/f188b1c188b535ec464f37cae87733a3/HSU-footer.png?h=250',
                )}
                alt="heilbrigdisstofnun-sudurlands-logo"
                width={590}
              />
            </GridRow>

            <GridRow className={styles.line}>
              {footerColumns.map((columnProps, index) => (
                <FooterColumn key={index} {...columnProps} />
              ))}
            </GridRow>

            <GridRow align="flexEnd" marginTop={3}>
              <Box marginRight={[4, 4, 12]}>
                <Inline alignY="center" align="center" space={5}>
                  <img
                    src={n(
                      'hsuJafnlaunavottunLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1igNLuoV9IQAwP1A4bfyXd/0d96a9a057e48b28616832552838c7a5/hsn-jafnlaunavottun.svg',
                    )}
                    alt="jafnlaunavottun"
                    width={60}
                  />
                  <img
                    src={n(
                      'hsuGraenSkrefLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/2QMl8Mw50Vj0AjlI6jzENH/cc4792e02ff1b152ede7e892da333669/greenSteps.png',
                    )}
                    alt="graen-skref"
                    width={100}
                  />
                  <img
                    src={n(
                      'hsuHeilsueflandiVinnustadurLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/4wF7MeLqjkMkw11wLJf2Ko/25a5592603ca0e29aaa58c13ecbf55fe/Heilsueflandi_vinnusta__ur_logo_1.svg',
                    )}
                    width={90}
                    alt="heilsueflandi-vinnustadur"
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

export default HeilbrigdisstofnunSudurlandsFooter
