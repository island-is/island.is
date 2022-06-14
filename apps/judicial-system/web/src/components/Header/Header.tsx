import React, { useContext } from 'react'
import { useWindowSize } from 'react-use'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'

import {
  Logo,
  Text,
  Box,
  Button,
  Header,
  UserMenu,
  Icon,
  Link,
} from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserContext } from '../UserProvider/UserProvider'
import { UserRole } from '@island.is/judicial-system/types'
import { theme } from '@island.is/island-ui/theme'
import * as Constants from '@island.is/judicial-system/consts'

import * as styles from './Header.css'
import { formatPhoneNumber } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'

const HeaderContainer: React.FC = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { isAuthenticated, user } = useContext(UserContext)
  const { width } = useWindowSize()
  const isMobile = width <= theme.breakpoints.md

  const handleLogout = async () => {
    await api.logout()
    window.location.assign('/')
  }

  return (
    <Header
      info={{
        title: 'Dómsmálaráðuneytið',
        description: 'Réttarvörslugátt',
      }}
      headerItems={
        <UserMenu
          language="is"
          authenticated={isAuthenticated}
          username={user?.name}
          dropdownItems={
            <>
              <div className={styles.dropdownItem}>
                <Box marginRight={2}>
                  <Icon icon="person" type="outline" color="blue400" />
                </Box>
                <Box>
                  <Box marginBottom={2}>
                    <Text>{user?.role}</Text>
                  </Box>
                  <Box marginBottom={2}>
                    <Text>{user?.institution?.name}</Text>
                  </Box>
                  <Box marginBottom={2}>
                    <Text>{formatPhoneNumber(user?.mobileNumber)}</Text>
                  </Box>
                  <Box>
                    <a
                      href={`mailto:${user?.email}`}
                      className={styles.link}
                      rel="noopener noreferrer nofollow"
                      target="_blank"
                    >
                      <Text as="span">{user?.email}</Text>
                    </a>
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
                  <MarkdownWrapper
                    markdown={formatMessage(core.headerTipDisclaimer, {
                      linkStart:
                        '<a href="mailto:gudlaug.thorhallsdottir@dmr.is" rel="noopener noreferrer nofollow" target="_blank">gudlaug.thorhallsdottir@dmr.is',
                      linkEnd: '</a>',
                    })}
                  />
                </Box>
              </div>
            </>
          }
          onLogout={handleLogout}
        />
      }
    />
    // <header className={styles.header}>
    //   <Link
    //     href={
    //       !user || !isAuthenticated
    //         ? '/'
    //         : user.role === UserRole.DEFENDER
    //         ? `${Constants.DEFENDER_ROUTE}/${router.query.id}`
    //         : user.role === UserRole.ADMIN
    //         ? Constants.USER_LIST_ROUTE
    //         : Constants.CASE_LIST_ROUTE
    //     }
    //     data-testid="link-to-home"
    //   >
    //     <Box display="flex" cursor="pointer" className={styles.logoContainer}>
    //       <Logo width={isMobile ? undefined : 146} iconOnly={isMobile} />
    //       {router.pathname !== '/' && (
    //         <span className={styles.logoContainerRvgName}>
    //           <Text>Réttarvörslugátt</Text>
    //         </span>
    //       )}
    //     </Box>
    //   </Link>
    //   {isAuthenticated && (
    //     <Button
    //       variant="ghost"
    //       icon="logOut"
    //       iconType="outline"
    //       size="small"
    //       onClick={async () => {
    //         await api.logout()
    //         window.location.assign('/')
    //       }}
    //       data-testid="logout-button"
    //     >
    //       {user?.name}
    //     </Button>
    //   )}
    // </header>
  )
}

export default HeaderContainer
