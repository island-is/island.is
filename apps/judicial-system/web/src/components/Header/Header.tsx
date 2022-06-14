import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text, Box, Header, UserMenu, Icon } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'
import {
  capitalize,
  formatPhoneNumber,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'

import { UserContext } from '../UserProvider/UserProvider'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import * as styles from './Header.css'

const HeaderContainer: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticated, user } = useContext(UserContext)

  const handleLogout = async () => {
    await api.logout()
    window.location.assign('/')
  }

  return (
    <div className={styles.container}>
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
                      <Text>{capitalize(user?.title || '')}</Text>
                    </Box>
                    <Box marginBottom={2}>
                      <Text>{user?.institution?.name}</Text>
                    </Box>
                    <Box marginBottom={2}>
                      <Text>{formatPhoneNumber(user?.mobileNumber)}</Text>
                    </Box>
                    <Box>
                      <Text>{user?.email}</Text>
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
    </div>
  )
}

export default HeaderContainer
