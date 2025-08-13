import React, { Dispatch, ReactNode, SetStateAction } from 'react'

import { Box } from '../../Box/Box'
import { Button } from '../../Button/Button'
import { Select } from '../../Select/Select'
import { Stack } from '../../Stack/Stack'
import { Text } from '../../Text/Text'
import { ModalBase } from '../../ModalBase/ModalBase'
import { UserAvatar } from '../../UserAvatar/UserAvatar'
import { Icon } from '../../IconRC/Icon'
import { GridContainer } from '../../Grid/GridContainer/GridContainer'
import * as styles from './UserDropdown.css'

interface UserDropdownProps {
  username?: string
  dropdownState: 'open' | 'closed'
  language?: string
  dropdownItems?: ReactNode
  setDropdownState: Dispatch<SetStateAction<'closed' | 'open'>>

  switchLanguage?: (...args: any[]) => void
  onLogout?: () => void
}

export const UserDropdown = ({
  username,
  dropdownState,
  language,
  dropdownItems,
  setDropdownState,
  switchLanguage,
  onLogout,
}: UserDropdownProps) => {
  const isVisible = dropdownState === 'open'

  return (
    <ModalBase
      baseId="island-ui-header-user-dropdown"
      isVisible={isVisible}
      hideOnClickOutside={true}
      hideOnEsc={true}
      removeOnClose={true}
      preventBodyScroll={false}
      modalLabel={language === 'is' ? 'Notendavalmynd' : 'User account menu'}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== isVisible) {
          setDropdownState('closed')
        }
      }}
    >
      <GridContainer>
        <Box display="flex" justifyContent="flexEnd">
          <Box
            position="relative"
            background="white"
            padding={3}
            borderRadius="large"
            className={styles.dropdown}
          >
            <button
              className={styles.closeButton}
              onClick={() => setDropdownState('closed')}
            >
              <Icon icon="close" color="blue400" />
            </button>

            <Box className={styles.inner}>
              <Stack space={4}>
                <Box display="flex" flexWrap="nowrap" alignItems="center">
                  <UserAvatar username={username} />

                  <Box marginLeft={1} marginRight={4}>
                    <Text variant="h4" as="h4">
                      {username}
                    </Text>
                  </Box>
                </Box>

                {switchLanguage && (
                  <Select
                    name="language-switcher"
                    size="sm"
                    value={
                      language === 'en'
                        ? { label: 'English', value: 'en' }
                        : { label: 'Íslenska', value: 'is' }
                    }
                    onChange={switchLanguage}
                    label={language === 'is' ? 'Tungumál' : 'Language'}
                    options={[
                      { label: 'Íslenska', value: 'is' },
                      { label: 'English', value: 'en' },
                    ]}
                  />
                )}

                {dropdownItems}

                <Box>
                  <Button
                    onClick={onLogout}
                    fluid
                    icon="logOut"
                    iconType="outline"
                  >
                    {language === 'is' ? 'Útskrá' : 'Logout'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </GridContainer>
    </ModalBase>
  )
}
