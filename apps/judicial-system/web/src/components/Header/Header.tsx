import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import getConfig from 'next/config'
import Link from 'next/link'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Inline,
  Logo,
  Text,
  UserMenu,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatPhoneNumber,
} from '@island.is/judicial-system/formatters'
import {
  isAdminUser,
  isCourtOfAppealsUser,
  isDefenceUser,
} from '@island.is/judicial-system/types'
import { api } from '@island.is/judicial-system-web/src/services'

import { useGetLawyer } from '../../utils/hooks'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { UserContext } from '../UserProvider/UserProvider'
import { header } from './Header.strings'
import * as styles from './Header.css'

const supportEmail = getConfig()?.publicRuntimeConfig?.supportEmail ?? ''

const LogoIcon: React.FC<React.PropsWithChildren<unknown>> = () => (
  <>
    <Hidden above="sm">
      <Logo width={40} iconOnly />
    </Hidden>
    <Hidden below="md">
      <Logo width={160} />
    </Hidden>
  </>
)

const Container: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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

const HeaderContainer: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticated, user } = useContext(UserContext)

  const logoHref =
    !user || !isAuthenticated
      ? '/'
      : isDefenceUser(user)
      ? constants.DEFENDER_CASES_ROUTE
      : isAdminUser(user)
      ? constants.USERS_ROUTE
      : isCourtOfAppealsUser(user)
      ? constants.COURT_OF_APPEAL_CASES_ROUTE
      : constants.CASES_ROUTE

  const handleLogout = () => {
    api.logout()
  }

  const { practice, email, phoneNr } =
    useGetLawyer(user?.nationalId, isDefenceUser(user)) ?? {}

  return (
    <Container>
      <Link href={logoHref} tabIndex={0}>
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
                {formatMessage(header.feedbackButtonLabel)}
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
                            isDefenceUser(user)
                              ? formatMessage(header.defender)
                              : user.title,
                          )}
                        </Text>
                      </Box>
                      <Box marginBottom={2}>
                        <Text>
                          {capitalize(
                            isDefenceUser(user)
                              ? practice
                              : user.institution?.name,
                          )}
                        </Text>
                      </Box>
                      <Box marginBottom={2}>
                        <Text>
                          {formatPhoneNumber(
                            isDefenceUser(user) ? phoneNr : user.mobileNumber,
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Text>{isDefenceUser(user) ? email : user.email}</Text>
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
                      {isDefenceUser(user) ? (
                        <Text>
                          {formatMessage(header.tipDisclaimerDefenders)}
                        </Text>
                      ) : (
                        <MarkdownWrapper
                          markdown={formatMessage(header.tipDisclaimer, {
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
