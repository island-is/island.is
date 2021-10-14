import React, { FC } from 'react'
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

import * as styles from './Footer.treat'

interface Props {
  title: string
  locale?: Locale
  logoSrc?: string
  contactLink?: string
  phone?: string
}

export const Footer: FC<Props> = ({
  title,
  locale = 'is',
  logoSrc,
  contactLink,
  phone,
}) => {
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
              {(contactLink || phone) && (
                <GridRow>
                  <GridColumn
                    span={['12/12', '12/12', '7/12']}
                    paddingBottom={6}
                  >
                    <Stack space={2}>
                      {contactLink && (
                        <>
                          <Text variant="h4">
                            Ertu með ábendingu eða spurningu?
                          </Text>
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
                              <a href={contactLink}>Sendu okkur línu</a>
                            </Text>
                          </LinkContext.Provider>
                        </>
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
                            <Text>Sími:</Text>
                            <Text color="blue600">
                              <a href="tel:426550">426550</a>
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
