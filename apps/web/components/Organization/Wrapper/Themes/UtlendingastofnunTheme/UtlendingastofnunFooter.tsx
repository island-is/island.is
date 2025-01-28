import React, { useContext } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { richText, SliceType } from '@island.is/island-ui/contentful'
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

import * as styles from './UtlendingastofnunFooter.css'

interface FooterProps {
  title: string
  logo?: string
  footerItems: Array<FooterItem>
  namespace: Record<string, string>
  organizationSlug: string
}

const UtlendingastofnunFooter: React.FC<
  React.PropsWithChildren<FooterProps>
> = ({ title, logo, footerItems, namespace, organizationSlug }) => {
  const n = useNamespace(namespace)
  const { isServiceWeb } = useContext(GlobalContext)
  const { linkResolver } = useLinkResolver()

  return (
    <footer>
      <Box className={styles.footerBg} color="white" paddingY={[3, 3, 3, 7]}>
        <GridContainer>
          <Box>
            {isServiceWeb && (
              <GridRow>
                <GridColumn span={['1/1', '1/1', '1/1', '6/12']}>
                  <Box>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {!!logo && (
                        <Box marginRight={4}>
                          <img src={logo} alt="" className={styles.logoStyle} />
                        </Box>
                      )}
                      <Text variant="h2" color="white">
                        {title}
                      </Text>
                    </Box>
                  </Box>
                </GridColumn>
                <GridColumn span={['12/12', '6/12', '6/12', '3/12']}>
                  <Box paddingTop={[3, 3, 3, 0]}>
                    <Text
                      paddingBottom={1}
                      fontWeight="semiBold"
                      color="white"
                      variant="medium"
                    >
                      {n('serviceWebFooterFirstColumnTitle', 'Þjónustuver')}
                    </Text>

                    <Text color="white" variant="small">
                      {n(
                        'serviceWebFooterOpeningHours',
                        'Opið mánudaga til föstudaga 9 - 14',
                      )}
                    </Text>

                    <Text paddingTop={1} color="white" variant="small">
                      {n(
                        'serviceWebFooterLocation',
                        'Dalvegur 18, 201 Kópavogi',
                      )}{' '}
                      <LinkV2
                        href={n(
                          'serviceWebFooterLocationHref',
                          'https://www.google.com/maps/place/The+Directorate+of+Immigration/@64.1056594,-21.8728967,17z/data=!4m12!1m6!3m5!1s0x48d674b54a362079:0x311c5c70e363e0cb!2sThe+Directorate+of+Immigration!8m2!3d64.1056865!4d-21.8707371!3m4!1s0x48d674b54a362079:0x311c5c70e363e0cb!8m2!3d64.1056865!4d-21.8707371',
                        )}
                      >
                        {n('serviceWebViewMap', '(sjá kort)')}
                      </LinkV2>
                    </Text>
                  </Box>
                </GridColumn>

                <GridColumn span={['12/12', '6/12', '6/12', '3/12']}>
                  <Box paddingTop={[3, 3, 3, 0]}>
                    <Text variant="small" paddingBottom={1}>
                      <LinkV2
                        underlineVisibility="always"
                        underline="small"
                        href={n(
                          'serviceWebFooterWebChatHref',
                          '/s/utlendingastofnun?wa_lid=t10',
                        )}
                      >
                        {n('serviceWebFooterWebChatTitle', 'Netspjall')}
                      </LinkV2>
                    </Text>

                    <Text variant="small">
                      <LinkV2
                        underlineVisibility="always"
                        underline="small"
                        href={n(
                          'serviceWebFooterEmailLinkHref',
                          linkResolver('servicewebcontact', [organizationSlug])
                            .href,
                        )}
                      >
                        {n('serviceWebFooterEmailTitle', 'Sendu okkur línu')}
                      </LinkV2>
                    </Text>
                    <Text paddingTop={1} color="white" variant="small">
                      {n('serviceWebFooterTelephone', 'Sími +354 444 0900')}
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
            )}
            {!isServiceWeb && (
              <>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  marginBottom={5}
                >
                  {!!logo && (
                    <Box marginRight={4}>
                      <img src={logo} alt="" className={styles.logoStyle} />
                    </Box>
                  )}
                  <div id="organizationFooterTitle">
                    <Text variant="h2" color="white">
                      {title}
                    </Text>
                  </div>
                </Box>

                <GridRow>
                  {footerItems.map((item, index) => (
                    <GridColumn
                      key={index}
                      span={
                        index === 1 || index === 2
                          ? ['12/12', '12/12', '3/12']
                          : ['12/12', '12/12', '2/12']
                      }
                      offset={index === 0 ? ['0', '0', '1/12'] : '0'}
                    >
                      <Box
                        marginBottom={5}
                        paddingRight={index !== 3 ? 4 : 0}
                        className={styles.textContainer}
                      >
                        {richText(item.content as SliceType[], {
                          renderNode: {
                            [BLOCKS.PARAGRAPH]: (_node, children) => (
                              <Text
                                color="white"
                                paddingBottom={2}
                                variant="small"
                              >
                                {children}
                              </Text>
                            ),
                          },
                        })}
                      </Box>
                    </GridColumn>
                  ))}
                </GridRow>
              </>
            )}
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default UtlendingastofnunFooter
