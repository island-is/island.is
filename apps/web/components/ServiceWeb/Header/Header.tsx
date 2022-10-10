/* eslint-disable jsx-a11y/anchor-is-valid */
import NextLink from 'next/link'
import cn from 'classnames'
import {
  Box,
  Column,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
  ResponsiveSpace,
  Link,
  getTextStyles,
  Button,
} from '@island.is/island-ui/core'
import {
  LanguageToggler,
  ServiceWebContext,
  ServiceWebSearchInput,
} from '@island.is/web/components'
import { useLinkResolver } from '@island.is/web/hooks'
import { TextModes } from '../types'

import * as styles from './Header.css'
import { useI18n } from '@island.is/web/i18n'

interface HeaderProps {
  title?: string
  hideSearch?: boolean
  textMode?: TextModes
  searchPlaceholder?: string
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header = ({
  title = '',
  hideSearch,
  textMode,
  searchPlaceholder,
}: HeaderProps) => {
  const { linkResolver } = useLinkResolver()
  const { t } = useI18n()

  const dark = textMode === 'dark'

  return (
    <ServiceWebContext.Consumer>
      {({ institutionSlug }) => (
        <Hidden print={true}>
          <header>
            <GridContainer>
              <GridRow>
                <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
                  <Columns alignY="center" space={2}>
                    <Column width="content">
                      <Box display="flex" height="full" alignItems="center">
                        <Box height="full">
                          <Link href="/">
                            <Hidden above="md">
                              <Logo
                                id="serviceweb-logo-1"
                                width={40}
                                iconOnly
                                solid={!dark}
                                solidColor={dark ? 'dark400' : 'white'}
                              />
                            </Hidden>
                            <Hidden below="lg">
                              <Logo
                                id="header-logo-2"
                                width={160}
                                solid={!dark}
                                solidColor={dark ? 'dark400' : 'white'}
                              />
                            </Hidden>
                          </Link>
                        </Box>
                        {!!title && (
                          <Hidden below="lg">
                            <div
                              className={cn(styles.logoTitleContainer, {
                                [styles.logoTitleContainerDark]: dark,
                              })}
                            >
                              <NextLink
                                href={
                                  institutionSlug
                                    ? linkResolver('serviceweborganization', [
                                        institutionSlug,
                                      ]).href
                                    : linkResolver('serviceweb').href
                                }
                              >
                                <a
                                  className={cn(
                                    getTextStyles({
                                      variant: 'h4',
                                      color: dark ? 'dark400' : 'white',
                                    }),
                                    styles.headingLink,
                                  )}
                                >
                                  {title}
                                </a>
                              </NextLink>
                            </div>
                          </Hidden>
                        )}
                      </Box>
                    </Column>
                    <Column>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flexEnd"
                        width="full"
                        className={styles.headerActions}
                      >
                        {!hideSearch && (
                          <Box marginLeft={marginLeft}>
                            <ServiceWebSearchInput
                              size="medium"
                              placeholder={searchPlaceholder}
                            />
                          </Box>
                        )}

                        <Hidden below="sm">
                          <Box marginLeft={marginLeft}>
                            <Link {...linkResolver('login')} skipTab>
                              <Button
                                colorScheme={dark ? 'default' : 'negative'}
                                variant="utility"
                                icon="person"
                                as="span"
                              >
                                {t?.login ?? 'Login'}
                              </Button>
                            </Link>
                          </Box>
                        </Hidden>
                        <Box marginLeft={marginLeft}>
                          <LanguageToggler
                            buttonColorScheme={dark ? 'default' : 'negative'}
                          />
                        </Box>
                      </Box>
                    </Column>
                  </Columns>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </header>
        </Hidden>
      )}
    </ServiceWebContext.Consumer>
  )
}

export default Header
