import { ReactNode } from 'react'
import cn from 'classnames'
import { BLOCKS } from '@contentful/rich-text-types'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './FiskistofaFooter.css'

interface FiskistofaFooterProps {
  footerItems: FooterItem[]
  namespace: Record<string, string>
}

const FiskistofaFooter = ({
  footerItems,
  namespace,
}: FiskistofaFooterProps) => {
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  return (
    <footer aria-labelledby="fiskistofa-footer">
      <Box className={styles.container}>
        <GridContainer className={styles.mainColumn}>
          <GridColumn>
            <GridRow>
              <Box marginLeft={2}>
                <img
                  src={n(
                    'fiskistofaFooterLogo',
                    'https://images.ctfassets.net/8k0h54kbe6bj/2JSIJ4WbQ4Up84KQlMnIBb/34c1a74806884e456e3ab809a54d41f6/fiskistofa-footer-logo.png',
                  )}
                  alt="fiskistofa-logo"
                />
              </Box>
            </GridRow>
            <GridRow marginTop={2} className={styles.linkRow}>
              {footerItems.slice(0, 3).map((item, idx) => (
                <GridColumn key={idx} span={['10/10', '10/10', '5/10', '2/10']}>
                  <Text fontWeight="semiBold" marginBottom={2}>
                    <Hyphen>{item.title}</Hyphen>
                  </Text>
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (
                        _node: never,
                        children: ReactNode,
                      ) => (
                        <Text
                          variant={'medium'}
                          marginBottom={1}
                          lineHeight={'lg'}
                        >
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </GridColumn>
              ))}

              {footerItems[3] && (
                <GridColumn
                  className={styles.linkContainer}
                  paddingTop={[2, 2, 0]}
                >
                  {webRichText(footerItems[3].content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (
                        _node: never,
                        children: ReactNode,
                      ) => (
                        <Text variant={'eyebrow'} fontWeight={'medium'}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                  <Box className={styles.iconContainer}>
                    <img
                      src={n(
                        'fiskistofaGraenSkrefLogo',
                        'https://images.ctfassets.net/8k0h54kbe6bj/2w9jCgdlKvT1gG5Vyk2arB/e3043e0ae9331ebad4e6e6bca684b87a/grSkref1080x680_BW.png',
                      )}
                      alt="graen-skref"
                      width={isMobile ? 62 : 109}
                      height={isMobile ? 39 : 69}
                    />
                    <img
                      src={n(
                        'fiskistofaJafnlaunavottunLogo',
                        'https://images.ctfassets.net/8k0h54kbe6bj/7076IkepUKnI8eKHbo69Ys/40d84cf75b177a8bef7beb1f6d45f6cd/fiskistofa-jafnlaunavottun.png',
                      )}
                      alt="fiskistofa-jafnlaunavottun"
                      width={isMobile ? 45 : 80}
                      height={isMobile ? 45 : 80}
                    />
                    <img
                      src={n(
                        'fiskistofaBsiLogo',
                        'https://images.ctfassets.net/8k0h54kbe6bj/71f5kkbe52Y21n62JfdxlQ/bd5c7f87d582ab1cd74b6e6ca61d6890/fiskistofa-bsi.png',
                      )}
                      alt="fiskistofa-bsi"
                      className={cn({
                        [styles.bsiLogo]: !isMobile,
                        [styles.bsiLogoMobile]: isMobile,
                      })}
                    />
                  </Box>
                </GridColumn>
              )}
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default FiskistofaFooter
