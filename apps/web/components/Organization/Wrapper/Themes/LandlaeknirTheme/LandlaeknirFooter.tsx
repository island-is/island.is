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
  ResponsiveSpace,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem, Slice } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './LandlaeknirFooter.css'

const renderParagraphs = (
  content: Slice[],
  marginBottom: ResponsiveSpace = 2,
  bold = false,
) =>
  webRichText(content as SliceType[], {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
        <Text
          fontWeight={bold ? 'semiBold' : undefined}
          marginBottom={marginBottom}
        >
          {children}
        </Text>
      ),
    },
  })

interface LandLaeknirFooterProps {
  footerItems: Array<FooterItem>
  namespace: Record<string, string>
}

const LandLaeknirFooter = ({
  footerItems,
  namespace,
}: LandLaeknirFooterProps) => {
  const n = useNamespace(namespace)
  return (
    <footer>
      <div className={styles.container}>
        <GridContainer className={styles.mainColumn}>
          <GridColumn>
            <GridRow>
              <Box marginLeft={2}>
                <img
                  width="100%"
                  src={n(
                    'landlaeknirFooterImage',
                    'https://images.ctfassets.net/8k0h54kbe6bj/3aKn7lTVtvZVVHJVPSs6Gh/bf8844713aa03d44916e98ae612ea5da/landlaeknir-heilbrigdisraduneytid.png',
                  )}
                  alt="landlaeknirLogo"
                />
              </Box>
            </GridRow>

            <Hidden below="md">
              <Box className={styles.borderTop} />
            </Hidden>

            <GridRow marginTop={2}>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden above="sm">
                  <Box className={styles.borderTop} />
                </Hidden>
                {footerItems?.[0] &&
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  renderParagraphs(footerItems[0].content, 2, true)}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden above="sm">
                  <Box className={styles.borderTop} />
                </Hidden>
                {footerItems?.[1] && (
                  <Box>
                    <Box marginBottom={2}>
                      {footerItems[1].link?.url ? (
                        <Link href={footerItems[1].link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{footerItems[1].title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{footerItems[1].title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      renderParagraphs(footerItems[1].content)
                    }
                  </Box>
                )}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden above="sm">
                  <Box className={styles.borderTop} />
                </Hidden>
                {footerItems?.[2] && (
                  <Box>
                    <Box marginBottom={2}>
                      {footerItems[2].link?.url ? (
                        <Link href={footerItems[2].link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{footerItems[2].title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{footerItems[2].title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      renderParagraphs(footerItems[2].content)
                    }
                  </Box>
                )}
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Hidden above="sm">
                  <Box className={styles.borderTop} />
                </Hidden>
                {footerItems.slice(3, 5).map((item, index) => (
                  <Box key={index}>
                    <Box marginBottom={2}>
                      {item.link?.url ? (
                        <Link href={item.link.url} color="white">
                          <Text fontWeight="semiBold" marginBottom={2}>
                            <Hyphen>{item.title}</Hyphen>
                          </Text>
                        </Link>
                      ) : (
                        <Text fontWeight="semiBold" marginBottom={2}>
                          <Hyphen>{item.title}</Hyphen>
                        </Text>
                      )}
                    </Box>
                    {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      renderParagraphs(item.content)
                    }
                  </Box>
                ))}
              </GridColumn>
            </GridRow>

            <Box className={styles.borderBottom} />

            <GridRow>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                {footerItems?.[5] && (
                  <Box className={styles.row}>
                    <Box className={styles.noWrap} marginRight={1}>
                      {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        renderParagraphs(footerItems[5].content, 0)
                      }
                    </Box>
                    <img
                      src={n(
                        'landlaeknirFacebookLogo',
                        'https://images.ctfassets.net/8k0h54kbe6bj/1hx4HeCK1OFzPIjtKkMmrL/fa769439b9221a92bfb124b598494ba4/Facebook-Logo-Dark.svg',
                      )}
                      alt="facebookLogo"
                    />
                  </Box>
                )}

                <Box marginTop={2}>
                  {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore make web strict
                    footerItems?.[6] && renderParagraphs(footerItems[6].content)
                  }
                </Box>
              </GridColumn>

              <GridColumn span={['12/12', '12/12', '3/12']}></GridColumn>

              <GridColumn span={['12/12', '12/12', '6/12']}>
                <GridRow className={styles.logoRow}>
                  <Box
                    marginLeft={1}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                  >
                    <img
                      src={n(
                        'landlaeknirJafnlaunavottunLogo',
                        'https://images.ctfassets.net/8k0h54kbe6bj/3vtLh2dJ55PA1Y1aOXIkM9/6c60a95ed3db8136a49e9734adbc8c7c/Jafnlaunavottun.svg',
                      )}
                      alt="jafnlaunavottunLogo"
                    />
                    <Box marginLeft={2}>
                      {footerItems?.[7] &&
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        renderParagraphs(footerItems[7].content, 0, true)}
                    </Box>
                  </Box>

                  <img
                    width={114}
                    src={n(
                      'landlaeknirGraenskrefLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/2w9jCgdlKvT1gG5Vyk2arB/e3043e0ae9331ebad4e6e6bca684b87a/grSkref1080x680_BW.png',
                    )}
                    alt=""
                  />
                  <img
                    width={114}
                    src={n(
                      'landlaeknirHeilsueflandiVinnustadurLogo',
                      'https://images.ctfassets.net/8k0h54kbe6bj/4wF7MeLqjkMkw11wLJf2Ko/25a5592603ca0e29aaa58c13ecbf55fe/Heilsueflandi_vinnusta__ur_logo_1.svg',
                    )}
                    alt=""
                  />
                </GridRow>
              </GridColumn>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </div>
    </footer>
  )
}

export default LandLaeknirFooter
