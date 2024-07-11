import { FC } from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
  Logo,
  Stack,
  LinkContext,
  Link,
  Inline,
  Hyphen,
} from '@island.is/island-ui/core'
import Illustration from './Illustration'
import { Locale } from '@island.is/shared/types'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './Footer.css'

interface Props {
  title: string
  locale?: Locale
  logoSrc?: string
  contactLink?: string
  phone?: string
  namespace: Record<string, string>
}

export const Footer: FC<React.PropsWithChildren<Props>> = ({
  title,
  locale = 'is',
  logoSrc,
  contactLink,
  phone,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const onlineChatLink = n('onlineChatLink', '')

  return (
    <Hidden print={true}>
      <Box as="footer" position="relative" background="blueberry100">
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <GridRow>
                <GridColumn span={['12/12', '12/12', '7/12']} paddingTop={6}>
                  <Box
                    display="flex"
                    flexDirection={['column', 'column', 'row']}
                    alignItems={['flexStart', 'flexStart', 'center']}
                    paddingBottom={5}
                    marginBottom={5}
                    borderColor="blueberry300"
                    borderBottomWidth="standard"
                  >
                    <Box marginRight={4} className={styles.logo}>
                      {logoSrc ? (
                        <img src={logoSrc} width={64} height={64} alt="merki" />
                      ) : (
                        <Logo iconOnly width={64} height={64} />
                      )}
                    </Box>
                    <Text variant="h2" marginTop={[4, 4, 0]}>
                      <Hyphen locale={locale}>{title}</Hyphen>
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
              {(contactLink || phone || onlineChatLink) && (
                <GridRow>
                  <GridColumn
                    span={['12/12', '12/12', '7/12']}
                    paddingBottom={6}
                  >
                    <Stack space={2}>
                      <Text variant="h4">
                        {n(
                          'doYouHaveAQuestion',
                          'Ertu með ábendingu eða spurningu?',
                        )}
                      </Text>
                      {onlineChatLink && (
                        <LinkContext.Provider
                          value={{
                            linkRenderer: (href, children) => (
                              <Link
                                href="" // Skip using href since we want the page to load via window.open() so the web chat will load correctly
                                color="blue600"
                                underline="normal"
                                underlineVisibility="always"
                                onClick={() =>
                                  window.open(
                                    href,
                                    shouldLinkOpenInNewWindow(href)
                                      ? '_target'
                                      : '_self',
                                  )
                                }
                              >
                                {children}
                              </Link>
                            ),
                          }}
                        >
                          <Text color={'blue600'}>
                            <a href={onlineChatLink}>
                              {n('onlineChat', 'Netspjall')}
                            </a>
                          </Text>
                        </LinkContext.Provider>
                      )}
                      {contactLink && (
                        <LinkContext.Provider
                          value={{
                            linkRenderer: (href, children) => (
                              <Link
                                href={href}
                                color="blue600"
                                underline="normal"
                                underlineVisibility="always"
                              >
                                {children}
                              </Link>
                            ),
                          }}
                        >
                          <Text color={'blue600'}>
                            <a href={contactLink}>
                              {n('sendUsALine', 'Sendu okkur línu')}
                            </a>
                          </Text>
                        </LinkContext.Provider>
                      )}
                      {phone && (
                        <LinkContext.Provider
                          value={{
                            linkRenderer: (href, children) => (
                              <Link
                                href={href}
                                color="blue600"
                                underline="normal"
                                underlineVisibility="always"
                              >
                                {children}
                              </Link>
                            ),
                          }}
                        >
                          <Inline space={1}>
                            <Text>{n('telephone', 'Sími')}:</Text>
                            <Text color="blue600">
                              <a href={`tel:${phone}`}>{phone}</a>
                            </Text>
                          </Inline>
                        </LinkContext.Provider>
                      )}
                    </Stack>
                  </GridColumn>
                </GridRow>
              )}
            </GridColumn>
          </GridRow>
        </GridContainer>
        <div className={styles.illustration}>
          <div className={styles.svgWrapper}>
            <Illustration className={styles.svg} />
          </div>
        </div>
      </Box>
    </Hidden>
  )
}

export default Footer
