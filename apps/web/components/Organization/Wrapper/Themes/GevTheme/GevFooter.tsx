import { BLOCKS } from '@contentful/rich-text-types'
import { SliceType } from '@island.is/island-ui/contentful'
import {
  Text,
  GridColumn,
  GridContainer,
  GridRow,
  Box,
  Hidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'
import * as styles from './GevFooter.css'
import { ReactNode } from 'react'

interface GevFooterProps {
  title: string
  namespace: Record<string, string>
  footerItems: FooterItem[]
}

const GevFooter = ({ title, namespace, footerItems }: GevFooterProps) => {
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  return (
    <footer className={styles.container} aria-labelledby="gev-footer">
      <GridContainer>
        <Box display="flex" alignItems="center">
          <img
            src={n(
              'gevFooterLogo',
              'https://images.ctfassets.net/8k0h54kbe6bj/1aV9NpFOL0BS6x968P5e2t/d5fda112196ee69d81ccb1d221f15160/GEV-merki-logo.svg',
            )}
            width={140}
            alt=""
          />

          <Text variant="h3">{title}</Text>
        </Box>

        <Box marginBottom={2} borderTopWidth="standard" borderColor="dark400" />

        <Hidden below="lg">
          <GridRow align="flexStart">
            <img
              style={{ visibility: 'hidden' }}
              src={n(
                'gevFooterLogo',
                'https://images.ctfassets.net/8k0h54kbe6bj/1aV9NpFOL0BS6x968P5e2t/d5fda112196ee69d81ccb1d221f15160/GEV-merki-logo.svg',
              )}
              width={140}
              alt=""
            />

            {footerItems.map((item, index) => (
              <GridColumn span="3/12" key={index}>
                {item.title && (
                  <Text marginTop={2} fontWeight="semiBold">
                    {item.title}
                  </Text>
                )}
                {webRichText(item.content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                      <Text color="dark400" marginY={1}>
                        {children}
                      </Text>
                    ),
                  },
                })}
              </GridColumn>
            ))}
          </GridRow>
        </Hidden>

        <Hidden above="md">
          <Box display="flex" padding={0}>
            <img
              style={{
                visibility: 'hidden',
                display: width > theme.breakpoints.md ? undefined : 'none',
              }}
              src={n(
                'gevFooterLogo',
                'https://images.ctfassets.net/8k0h54kbe6bj/1aV9NpFOL0BS6x968P5e2t/d5fda112196ee69d81ccb1d221f15160/GEV-merki-logo.svg',
              )}
              width={140}
              alt=""
            />

            <GridColumn>
              {footerItems.map((item, index) => (
                <GridColumn paddingTop={2} span="1/1" key={index}>
                  {item.title && (
                    <Text fontWeight="semiBold">{item.title}</Text>
                  )}
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (
                        _node: never,
                        children: ReactNode,
                      ) => (
                        <Text color="dark400" marginY={1}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </GridColumn>
              ))}
            </GridColumn>
          </Box>
        </Hidden>
      </GridContainer>
    </footer>
  )
}

export default GevFooter
