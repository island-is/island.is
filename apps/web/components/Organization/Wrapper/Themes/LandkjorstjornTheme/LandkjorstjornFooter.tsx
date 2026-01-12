import { ReactNode } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './LandskjorstjornFooter.css'

interface LandskjorstjornFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

const LandskjorstjornFooter = ({
  footerItems,
  namespace,
}: LandskjorstjornFooterProps) => {
  const n = useNamespace(namespace)
  return (
    <footer className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn>
            <Box marginLeft={5}>
              <img
                width={80}
                height={78}
                src={n(
                  'landskjorstjornFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/60DIqBGQ8ejcpEak0bSrak/9481d5d92bcf9b2ea5f2efe3fee952f7/Landskjorstjorn-logo-hvitt.svg',
                )}
                alt=""
              />
            </Box>
          </GridColumn>
          {footerItems[0] && (
            <GridColumn>
              <Box marginLeft={[2, 0]}>
                <Text variant="h2" color="white">
                  <Hyphen>{footerItems[0].title}</Hyphen>
                </Text>
                {webRichText(footerItems[0].content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                      <Text
                        fontWeight="semiBold"
                        color="white"
                        variant="small"
                        marginBottom={1}
                      >
                        {children}
                      </Text>
                    ),
                  },
                })}
              </Box>
            </GridColumn>
          )}
        </GridRow>
        <Box margin={2} borderTopWidth="standard" borderColor="white" />

        <GridRow>
          <Hidden below="sm">
            <GridColumn>
              <Box className={styles.emptyBox} />
            </GridColumn>
          </Hidden>
          {footerItems.slice(1).map((item, index) => (
            <GridColumn key={index}>
              <Box marginLeft={index === 0 ? [2, 0] : 2} marginRight={8}>
                <Box marginBottom={2}>
                  {item.link?.url ? (
                    <Link href={item.link.url} color="white">
                      <Text fontWeight="semiBold" color="white">
                        <Hyphen>{item.title}</Hyphen>
                      </Text>
                    </Link>
                  ) : (
                    <Text fontWeight="semiBold" color="white">
                      <Hyphen>{item.title}</Hyphen>
                    </Text>
                  )}
                </Box>
                {webRichText(item.content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                      <Text color="white" variant="medium" marginBottom={2}>
                        {children}
                      </Text>
                    ),
                  },
                })}
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </footer>
  )
}

export default LandskjorstjornFooter
