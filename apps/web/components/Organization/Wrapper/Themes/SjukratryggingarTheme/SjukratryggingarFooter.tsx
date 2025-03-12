import React, { ReactNode, useContext } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { GlobalContext } from '@island.is/web/context'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './SjukratryggingarFooter.css'

interface FooterProps {
  footerItems: Array<FooterItem>
  namespace: Record<string, string>
  organizationSlug: string
}

const SjukratryggingarFooter: React.FC<
  React.PropsWithChildren<FooterProps>
> = ({ footerItems, namespace, organizationSlug }) => {
  const n = useNamespace(namespace)
  const { isServiceWeb } = useContext(GlobalContext)
  const { linkResolver } = useLinkResolver()

  return (
    <footer>
      <Box className={styles.footerBg} color="white" paddingTop={5}>
        <GridContainer>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={4}
              marginBottom={4}
              borderColor="dark400"
              borderBottomWidth="standard"
            >
              <Box marginRight={4}>
                <img
                  src={n(
                    'sjukratryggingarFooterLogo',
                    '/assets/sjukratryggingar_logo.png',
                  )}
                  alt=""
                  className={styles.logoStyle}
                />
              </Box>
            </Box>
            <GridRow>
              {isServiceWeb && (
                <>
                  <GridColumn span={['0', '0', '3/12', '3/12']}></GridColumn>
                  <GridColumn
                    paddingBottom={[3, 3, 0]}
                    span={['1/1', '5/12', '5/12', '4/12']}
                  >
                    <Box>
                      <Text fontWeight="semiBold">
                        {n(
                          'serviceWebFooterFirstColumnTitle',
                          'Þjónustuver og símatími',
                        )}
                      </Text>
                      <Box>
                        <Box
                          display={['block', 'block', 'block', 'flex']}
                          justifyContent="spaceBetween"
                        >
                          <Text>
                            {n(
                              'serviceWebFooterMondayToThursdayTitle',
                              'Mánudaga - fimmtudaga:',
                            )}
                          </Text>
                          <Text>
                            {n(
                              'serviceWebFooterMondayToThursdayOpeningHours',
                              '10:00 - 15:00',
                            )}
                          </Text>
                        </Box>
                        <Box
                          display={['block', 'block', 'block', 'flex']}
                          justifyContent="spaceBetween"
                        >
                          <Text>
                            {n('serviceWebFooterFridayTitle', 'Föstudaga:')}
                          </Text>
                          <Text>
                            {n(
                              'serviceWebFooterFridayOpeningHours',
                              '08:00 - 13:00',
                            )}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </GridColumn>
                  <GridColumn
                    paddingBottom={[3, 3, 0]}
                    offset={['0', '0', '0', '1/12']}
                    span={['1/1', '5/12', '4/12', '3/12']}
                  >
                    <Box>
                      <Text fontWeight="semiBold">
                        {n('serviceWebFooterTelephone', 'Sími: 515 0000')}
                      </Text>
                      <LinkV2
                        underlineVisibility="always"
                        underline="small"
                        className={styles.link}
                        href={n(
                          'serviceWebFooterContactLinkHref',
                          linkResolver('servicewebcontact', [organizationSlug])
                            .href,
                        )}
                      >
                        {n('serviceWebFooterContactLinkTitle', 'Hafðu samband')}
                      </LinkV2>
                    </Box>
                  </GridColumn>
                </>
              )}
              {!isServiceWeb &&
                footerItems.slice(0, 4).map((item, index) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12', '3/12']}
                    key={`footer-main-row-column-${index}`}
                  >
                    <Box>
                      <Box marginBottom={2}>
                        {webRichText(item.content as SliceType[])}
                      </Box>
                    </Box>
                  </GridColumn>
                ))}
            </GridRow>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingTop={4}
            paddingBottom={4}
            borderColor="dark400"
            borderTopWidth="standard"
          >
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <img
                    src={n(
                      'sjukratryggingarFooterBottomLogo',
                      '/assets/sjukratryggingar_heilbrigdisraduneytid.png',
                    )}
                    alt="heilbrygdisraduneytid"
                  />
                </GridColumn>
                <GridColumn
                  span={['12/12', '12/12', '6/12', '3/12']}
                  className={styles.footerSecondRow}
                >
                  <Box>
                    {webRichText(
                      (footerItems?.[4]?.[
                        isServiceWeb ? 'serviceWebContent' : 'content'
                      ] ?? []) as SliceType[],
                      {
                        renderNode: {
                          [BLOCKS.PARAGRAPH]: (
                            _node: never,
                            children: ReactNode,
                          ) => (
                            <Text variant="small" color="dark400" marginY={1}>
                              {children}
                            </Text>
                          ),
                        },
                      },
                    )}
                  </Box>
                </GridColumn>
                {footerItems.slice(5, 7).map((item, index) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12', '3/12']}
                    className={styles.footerSecondRow}
                    key={`footer-secondary-row-column-${index}`}
                  >
                    <Box>
                      {webRichText(
                        item[
                          isServiceWeb ? 'serviceWebContent' : 'content'
                        ] as SliceType[],
                        {
                          renderNode: {
                            [BLOCKS.PARAGRAPH]: (
                              _node: never,
                              children: ReactNode,
                            ) => (
                              <Text variant="small" color="dark400" marginY={1}>
                                {children}
                              </Text>
                            ),
                          },
                        },
                      )}
                    </Box>
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default SjukratryggingarFooter
