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
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './OpinberNyskopunFooter.css'

interface OpinberNyskopunFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

export const OpinberNyskopunFooter: React.FC<
  React.PropsWithChildren<OpinberNyskopunFooterProps>
> = ({ footerItems, namespace }) => {
  const n = useNamespace(namespace)
  return (
    <footer className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['4/12', '4/12', '3/12', '2/12']}>
            <img
              width={133}
              height={71}
              src="https://images.ctfassets.net/8k0h54kbe6bj/21JLHgkyocLA8lcT0AaK4e/545f1363de7eb8160055bd39d3c72d14/rikiskaup.svg"
              alt=""
            />
          </GridColumn>
          <GridColumn
            position="relative"
            span={['8/12', '8/12', '9/12', '10/12']}
          >
            {footerItems?.[0]?.title && (
              <Text variant="h2" color="white">
                <Hyphen>{footerItems[0].title}</Hyphen>
              </Text>
            )}
            <Box marginY={2} className={styles.line} />
            <Box marginTop={4} display="flex" flexWrap="wrap">
              {footerItems.slice(1).map((item) => (
                <Box key={item.id} marginRight={8}>
                  <Text fontWeight="semiBold" color="white" marginBottom={2}>
                    {item.title}
                  </Text>
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (
                        _node: never,
                        children: ReactNode,
                      ) => (
                        <Text color="white" variant="medium" marginBottom={2}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </Box>
              ))}
              <Box marginLeft="auto" marginTop="auto">
                <Hidden below="lg">
                  <Inline space={8} alignY="center">
                    <img
                      width={280}
                      src={n(
                        'opinbernyskopun-logo1',
                        'https://images.ctfassets.net/8k0h54kbe6bj/4WxSQeuQVmVwbnTGhb6pYX/287fd34f88ba41eac7b8424de183849f/StjornarradIslands_fjs.svg',
                      )}
                      alt=""
                    />
                    <img
                      width={320}
                      src={n(
                        'opinbernyskopun-logo2',
                        'https://images.ctfassets.net/8k0h54kbe6bj/5p96a8GGHgJrS5udRjT044/cf40d9d800374f64ad307c6b96e45f19/Hvin_stjornmalaraduneytid.svg',
                      )}
                      alt=""
                    />
                  </Inline>
                </Hidden>
              </Box>
            </Box>
          </GridColumn>
        </GridRow>

        <Hidden above="md">
          <Box marginTop={3}>
            <Inline
              space={[3, 3, 5]}
              alignY="center"
              align={['left', 'left', 'right']}
            >
              <img
                width={280}
                src={n(
                  'opinbernyskopun-logo1',
                  'https://images.ctfassets.net/8k0h54kbe6bj/4WxSQeuQVmVwbnTGhb6pYX/287fd34f88ba41eac7b8424de183849f/StjornarradIslands_fjs.svg',
                )}
                alt=""
              />
              <img
                width={320}
                src={n(
                  'opinbernyskopun-logo2',
                  'https://images.ctfassets.net/8k0h54kbe6bj/5p96a8GGHgJrS5udRjT044/cf40d9d800374f64ad307c6b96e45f19/Hvin_stjornmalaraduneytid.svg',
                )}
                alt=""
              />
            </Inline>
          </Box>
        </Hidden>
      </GridContainer>
    </footer>
  )
}
