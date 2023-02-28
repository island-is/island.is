import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import getConfig from 'next/config'

import {
  Text,
  Box,
  UserMenu,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
  Button,
  Hidden,
  Logo,
  Inline,
} from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import {
  capitalize,
  formatPhoneNumber,
} from '@island.is/judicial-system/formatters'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import { UserContext } from '../UserProvider/UserProvider'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { useGetLawyer } from '../../utils/hooks'
import { header } from './Header.strings'
import * as styles from './Header.css'

const supportEmail = getConfig()?.publicRuntimeConfig?.supportEmail ?? ''

const LogoIcon: React.FC = () => (
  <>
    <Hidden above="sm">
      <Logo width={40} iconOnly />
    </Hidden>
    <Hidden below="md">
      <Logo width={160} />
    </Hidden>
  </>
)

const Container: React.FC = ({ children }) => {
  return (
    <Box paddingX={[3, 3, 4]}>
      <GridContainer className={styles.gridContainer}>
        <GridRow>
          <GridColumn span="12/12">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              className={styles.container}
            >
              {children}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

const HeaderContainer: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticated, user } = useContext(UserContext)

  const logoHref =
    !user || !isAuthenticated
      ? '/'
      : user.role === UserRole.Defender
      ? '#' // Defenders should never be able to navigate anywhere from the logo
      : user.role === UserRole.Admin
      ? constants.USERS_ROUTE
      : constants.CASES_ROUTE

  const handleLogout = async () => {
    await api.logout()
    window.location.assign('/')
  }

  const { practice, email, phoneNr } =
    useGetLawyer(user?.nationalId, user?.role === UserRole.Defender) ?? {}

  return (
    <Container>
      <Link href={logoHref}>
        <a href={logoHref} tabIndex={0}>
          <Inline alignY="center">
            <LogoIcon />
            <Box
              display="flex"
              className={styles.infoContainer}
              alignItems="center"
              height="full"
              marginLeft={[1, 1, 2, 4]}
              marginRight="auto"
            >
              <Box marginLeft={[1, 1, 2, 4]}>
                <Text variant="eyebrow">{'Dómsmálaráðuneytið'}</Text>
                <Hidden above="sm">
                  <Text fontWeight="light" variant={'eyebrow'}>
                    {'Réttarvörslugátt'}
                  </Text>
                </Hidden>
                <Hidden below="md">
                  <Text fontWeight="light" variant={'default'}>
                    {'Réttarvörslugátt'}
                  </Text>
                </Hidden>
              </Box>
            </Box>
          </Inline>
        </a>
      </Link>
      <Inline alignY="center" space={2}>
        {user && (
          <>
            <Hidden below="md">
              <Button
                variant="ghost"
                size="small"
                onClick={() =>
                  window.open(constants.FEEDBACK_FORM_URL, '_blank')
                }
              >
                {formatMessage(header.headerFeedbackButtonLabel)}
              </Button>
            </Hidden>
            <UserMenu
              language="is"
              authenticated={isAuthenticated}
              username={user.name}
              dropdownItems={
                <>
                  <div className={styles.dropdownItem}>
                    <Box marginRight={2}>
                      <Icon icon="person" type="outline" color="blue400" />
                    </Box>
                    <Box>
                      <Box marginBottom={2}>
                        <Text>
                          {capitalize(
                            user.role === UserRole.Defender
                              ? formatMessage(header.defender)
                              : user.title,
                          )}
                        </Text>
                      </Box>
                      <Box marginBottom={2}>
                        <Text>
                          {capitalize(
                            user.role === UserRole.Defender
                              ? practice
                              : user.institution?.name,
                          )}
                        </Text>
                      </Box>
                      <Box marginBottom={2}>
                        <Text>
                          {formatPhoneNumber(
                            user.role === UserRole.Defender
                              ? phoneNr
                              : user.mobileNumber,
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Text>
                          {user.role === UserRole.Defender ? email : user.email}
                        </Text>
                      </Box>
                    </Box>
                  </div>
                  <div className={styles.dropdownItem}>
                    <Box marginRight={2}>
                      <Icon
                        icon="informationCircle"
                        type="outline"
                        color="blue400"
                      />
                    </Box>
                    <Box>
                      {user.role === UserRole.Defender ? (
                        <Text>
                          {formatMessage(header.headerTipDisclaimerDefenders)}
                        </Text>
                      ) : (
                        <MarkdownWrapper
                          markdown={formatMessage(header.headerTipDisclaimer, {
                            linkStart: `<a href="mailto:${supportEmail}" rel="noopener noreferrer nofollow" target="_blank">${supportEmail}`,
                            linkEnd: '</a>',
                          })}
                        />
                      )}
                    </Box>
                  </div>
                </>
              }
              onLogout={handleLogout}
            />
          </>
        )}
      </Inline>
    </Container>
  )
}

export default HeaderContainer
