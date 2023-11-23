/* eslint-disable jsx-a11y/anchor-is-valid */
import cn from 'classnames'
import NextLink from 'next/link'

import {
  Box,
  Button,
  Column,
  Columns,
  getTextStyles,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Logo,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { ProjectBasePath } from '@island.is/shared/constants'
import {
  LanguageToggler,
  ServiceWebContext,
  ServiceWebSearchInput,
} from '@island.is/web/components'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'

import { TextModes } from '../types'
import * as styles from './Header.css'

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace
const minarsidurLink = `${ProjectBasePath.ServicePortal}/`

interface HeaderProps {
  title?: string
  hideSearch?: boolean
  textMode?: TextModes
  searchPlaceholder?: string
  namespace: Record<string, string>
}

export const Header = ({
  title = '',
  hideSearch,
  textMode,
  searchPlaceholder,
  namespace,
}: HeaderProps) => {
  const { linkResolver } = useLinkResolver()
  const { t } = useI18n()

  const n = useNamespace(namespace)

  const dark = textMode === 'dark'

  return (
    <ServiceWebContext.Consumer>
      {({ institutionSlug }) => (
        <Hidden print={true}>
          <header>
            <GridContainer className={styles.gridContainer}>
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
                                solid={!dark && textMode !== 'blueberry'}
                                solidColor={
                                  dark || textMode === 'blueberry'
                                    ? 'dark400'
                                    : 'white'
                                }
                              />
                            </Hidden>
                            <Hidden below="lg">
                              <Logo
                                id="header-logo-2"
                                width={160}
                                solid={!dark && textMode !== 'blueberry'}
                                solidColor={
                                  dark || textMode === 'blueberry'
                                    ? 'dark400'
                                    : 'white'
                                }
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
                                className={cn(
                                  getTextStyles({
                                    variant: 'h4',
                                    color: dark
                                      ? 'dark400'
                                      : textMode === 'blueberry'
                                      ? 'blueberry600'
                                      : 'white',
                                  }),
                                  styles.headingLink,
                                )}
                              >
                                {title}
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
                              nothingFoundText={n(
                                'nothingFoundText',
                                'Ekkert fannst',
                              )}
                            />
                          </Box>
                        )}

                        <Hidden below="sm">
                          <Box marginLeft={marginLeft}>
                            <a tabIndex={-1} href={minarsidurLink}>
                              <Button
                                colorScheme={
                                  dark
                                    ? 'default'
                                    : textMode === 'blueberry'
                                    ? 'blueberry'
                                    : 'negative'
                                }
                                variant="utility"
                                icon="person"
                                as="span"
                              >
                                {t?.login ?? 'Login'}
                              </Button>
                            </a>
                          </Box>
                        </Hidden>
                        <Box marginLeft={marginLeft}>
                          <LanguageToggler
                            buttonColorScheme={
                              dark
                                ? 'default'
                                : textMode === 'blueberry'
                                ? 'blueberry'
                                : 'negative'
                            }
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
