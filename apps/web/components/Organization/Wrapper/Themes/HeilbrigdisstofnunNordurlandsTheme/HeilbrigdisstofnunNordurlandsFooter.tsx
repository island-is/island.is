import { ReactNode } from 'react'
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
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './HeilbrigdisstofnunNordurlandsFooter.css'

const renderColumn = (
  column: FooterItem[],
  span: SpanType = ['4/8', '2/8', '1/8'],
  offset = false,
) => {
  if (column.length <= 0) return null
  return (
    <GridColumn span={span}>
      {column.map((item, index) => (
        <Box
          key={`${item.id}-${index}`}
          className={styles.locationBox}
          marginLeft={offset ? [0, 0, 0, 10] : 0}
        >
          {item.link?.url ? (
            <Link href={item.link.url} color="white">
              <Text fontWeight="semiBold" color="white" marginBottom={1}>
                <Hyphen>{item.title}</Hyphen>
              </Text>
            </Link>
          ) : (
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              <Hyphen>{item.title}</Hyphen>
            </Text>
          )}

          {webRichText(item.content as SliceType[], {
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

interface HeilbrigdisstofnunNordurlandsFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

const HeilbrigdisstofnunNordurlandsFooter = ({
  footerItems,
  namespace,
}: HeilbrigdisstofnunNordurlandsFooterProps) => {
  const n = useNamespace(namespace)
  return (
    <footer>
      <div className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow>
              <img
                src={n(
                  'hsnFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/rXPqjnjJYePJHhHvO0UDT/b5aaf2e6dc54abb4b1dc2bd8065217b7/HSN_landscape_hvittGratt.png?h=250',
                )}
                alt="heilbrigdisstofnun-nordurlands-logo"
                width={590}
              />
            </GridRow>

            <GridRow className={styles.line}>
              {renderColumn([footerItems[0]], ['8/8', '4/8', '2/8'], true)}
              {renderColumn(footerItems.slice(1, 4))}
              {renderColumn(footerItems.slice(4, 7))}
              {renderColumn(footerItems.slice(7, 10))}
              {renderColumn(footerItems.slice(10, 13))}
              {renderColumn(footerItems.slice(13, 16), ['8/8', '4/8', '2/8'])}
            </GridRow>

            <GridRow align="flexEnd" marginTop={3}>
              <Box marginRight={[4, 4, 12]}>
                <Inline alignY="center" align="center" space={5}>
                  <img
                    src={n(
                      'hsnJafnlaunavottunLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1igNLuoV9IQAwP1A4bfyXd/0d96a9a057e48b28616832552838c7a5/hsn-jafnlaunavottun.svg',
                    )}
                    alt="jafnlaunavottun"
                    width={50}
                  />
                  <img
                    src={n(
                      'hsnGraenSkrefLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/2QMl8Mw50Vj0AjlI6jzENH/cc4792e02ff1b152ede7e892da333669/greenSteps.png',
                    )}
                    alt="graen-skref"
                    width={90}
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

export default HeilbrigdisstofnunNordurlandsFooter
