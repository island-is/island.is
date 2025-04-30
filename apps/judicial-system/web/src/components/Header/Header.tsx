import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import getConfig from 'next/config'
import Link from 'next/link'
import router from 'next/router'

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
  isPrisonSystemUser,
  Lawyer,
} from '@island.is/judicial-system/types'
import { api } from '@island.is/judicial-system-web/src/services'

import { useGeoLocation } from '../../utils/hooks'
import { LawyerRegistryContext } from '../LawyerRegistryProvider/LawyerRegistryProvider'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import { UserContext } from '../UserProvider/UserProvider'
import { header } from './Header.strings'
import * as styles from './Header.css'

const supportEmail = getConfig()?.publicRuntimeConfig?.supportEmail ?? ''

const LogoIcon = () => (
  <>
    <Hidden above="sm">
      <Logo width={40} iconOnly />
    </Hidden>
    <Hidden below="md">
      <Logo width={160} />
    </Hidden>
  </>
)

const Container: FC<PropsWithChildren> = ({ children }) => {
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

const HeaderContainer = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticated, user, eligibleUsers } = useContext(UserContext)
  const [lawyer, setLawyer] = useState<Lawyer>()
  const [isRobot, setIsRobot] = useState<boolean>()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>()

  const { countryCode } = useGeoLocation()
  const { lawyers } = useContext(LawyerRegistryContext)

  const isLawyerInLawyersRegistry = isDefenceUser(user) && lawyer

  useEffect(() => {
    setIsRobot(countryCode !== 'IS')
  }, [countryCode])

  useEffect(() => {
    if (!lawyers || lawyers.length === 0 || !user) {
      return
    }

    setLawyer(lawyers.find((lawyer) => lawyer.nationalId === user.nationalId))
  }, [lawyers, user])

  const logoHref =
    !user || !isAuthenticated
      ? '/'
      : isDefenceUser(user)
      ? constants.DEFENDER_CASES_ROUTE
      : isAdminUser(user)
      ? constants.USERS_ROUTE
      : isCourtOfAppealsUser(user)
      ? constants.COURT_OF_APPEAL_CASES_ROUTE
      : isPrisonSystemUser(user)
      ? constants.PRISON_CASES_ROUTE
      : constants.CASES_ROUTE

  const handleLogout = () => {
    api.logout()
  }

  const handleChangeInstitution = () => {
    router.push('/')
    setIsUserMenuOpen(false)
  }

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
              <Text variant="eyebrow">Dómsmálaráðuneytið</Text>
              <Hidden above="sm">
                <Text fontWeight="light" variant="eyebrow">
                  Réttarvörslugátt
                </Text>
              </Hidden>
              <Hidden below="md">
                <Text fontWeight="light" variant="default">
                  Réttarvörslugátt
                </Text>
              </Hidden>
            </Box>
          </Box>
        </Inline>
      </Link>
      <Inline alignY="center" space={2}>
        {(isRobot === false || (user && isAuthenticated)) && (
          <Hidden below="md">
            <Button
              variant="ghost"
              size="small"
              onClick={() => window.open(constants.FEEDBACK_FORM_URL, '_blank')}
            >
              {formatMessage(header.feedbackButtonLabel)}
            </Button>
          </Hidden>
        )}
        {user && (
          <UserMenu
            language="is"
            authenticated={isAuthenticated}
            username={user.name ?? undefined}
            isOpen={isUserMenuOpen}
            onClick={() => setIsUserMenuOpen(undefined)}
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
                          isLawyerInLawyersRegistry
                            ? lawyer.practice
                            : user.institution?.name,
                        )}
                      </Text>
                    </Box>
                    <Box marginBottom={2}>
                      <Text>
                        {formatPhoneNumber(
                          isLawyerInLawyersRegistry
                            ? lawyer.phoneNr
                            : user.mobileNumber,
                        )}
                      </Text>
                    </Box>
                    <Box>
                      <Text>
                        {isLawyerInLawyersRegistry ? lawyer.email : user.email}
                      </Text>
                    </Box>
                    {eligibleUsers && eligibleUsers.length > 1 && (
                      <Box marginTop={2}>
                        <Button
                          variant="text"
                          onClick={handleChangeInstitution}
                          size="small"
                          preTextIcon="swapHorizontal"
                        >
                          Skipta um embætti / hlutverk
                        </Button>
                      </Box>
                    )}
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
                    {isLawyerInLawyersRegistry ? (
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
        )}
      </Inline>
    </Container>
  )
}

export default HeaderContainer
