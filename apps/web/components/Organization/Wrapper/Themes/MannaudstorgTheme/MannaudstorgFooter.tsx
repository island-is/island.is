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
import { useI18n } from '@island.is/web/i18n'

import * as styles from './MannaudstorgFooter.css'

interface Props {
  title: string
  logoSrc?: string
  contactLink?: string
  phone?: string
  headerText?: string
  linkText?: string
  telephoneText?: string
}

export const MannaudstorgFooter: FC<Props> = ({
  title,
  logoSrc,
  contactLink,
  phone,
  headerText = 'Ertu með ábendingu eða spurningu?',
  linkText = 'Sendu okkur línu',
  telephoneText = 'Sími',
}) => {
  const { activeLocale } = useI18n()

  return (
    <Hidden print={true}>
      <Box as="footer" position="relative" className={styles.container}>
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
                    <Text color="white" variant="h2" marginTop={[4, 4, 0]}>
                      <Hyphen locale={activeLocale}>{title}</Hyphen>
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
                          <Text variant="h4" color="white">
                            {headerText}
                          </Text>
                          <LinkContext.Provider
                            value={{
                              linkRenderer: (href, children) => (
                                <Link
                                  href={href}
                                  color="white"
                                  underline="normal"
                                  underlineVisibility="always"
                                >
                                  {children}
                                </Link>
                              ),
                            }}
                          >
                            <Text color={'blue600'}>
                              <a href={contactLink}>{linkText}</a>
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
                                color="white"
                                underline="normal"
                                underlineVisibility="always"
                              >
                                {children}
                              </Link>
                            ),
                          }}
                        >
                          <Inline space={1}>
                            <Text color="white">{telephoneText}:</Text>
                            <Text>
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
      </Box>
    </Hidden>
  )
}

export default MannaudstorgFooter
