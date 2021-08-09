import React, { FC, useRef } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Locale } from '@island.is/shared/types'
import { ISLAND_IS_URL } from '@island.is/service-portal/constants'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useAuth } from '@island.is/auth/react'
import { Features, useFeatureFlag } from '@island.is/feature-flags'
import { m } from '@island.is/service-portal/core'

import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from '../Sidebar/ModuleNavigation'
import * as styles from './MobileMenu.treat'
import { UserDelegations } from '../UserDelegations/UserDelegations'

const MobileMenu: FC<{}> = () => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { lang, formatMessage } = useLocale()
  const navigation = useNavigation()
  const { changeLanguage } = useNamespaces()
  const { signOut } = useAuth()
  const showDelegations = useFeatureFlag(Features.delegationsEnabled, false)

  const handleLangClick = (value: Locale) => changeLanguage(value)
  const handleLogoutClick = () => signOut()

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      background="white"
      className={styles.wrapper}
      ref={ref}
    >
      <Box paddingX={3}>
        <GridRow>
          <GridColumn span="4/6">
            <a href={ISLAND_IS_URL}>
              <Button variant="utility" fluid>
                {formatMessage(m.goToIslandIs)}
              </Button>
            </a>
          </GridColumn>
          <GridColumn span="2/6">
            <Button
              variant="utility"
              fluid
              onClick={handleLangClick.bind(null, lang === 'is' ? 'en' : 'is')}
            >
              {lang === 'is' ? 'EN' : 'IS'}
            </Button>
          </GridColumn>
        </GridRow>
      </Box>
      {navigation.map((rootItem, rootIndex) => (
        <Box
          background={rootIndex === 0 ? 'white' : 'blueberry100'}
          key={rootIndex}
          padding={4}
        >
          <Stack space={3}>
            {rootItem.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot && (
                  <ModuleNavigation
                    key={index}
                    nav={navRoot}
                    variant={rootIndex === 0 ? 'blue' : 'blueberry'}
                    alwaysExpanded
                    onItemClick={handleLinkClick}
                  />
                ),
            )}
            {rootIndex === 0 && showDelegations.value && <UserDelegations />}
            {rootIndex === 0 && (
              <Box>
                <Button
                  onClick={handleLogoutClick}
                  fluid
                  icon="logOut"
                  iconType="outline"
                >
                  {formatMessage({
                    id: 'global:logout',
                    defaultMessage: 'Útskrá',
                  })}
                </Button>
              </Box>
            )}
          </Stack>
          {rootIndex === 1 && (
            <Text variant="small" color="blueberry600" marginTop={3}>
              {formatMessage(m.incomingServicesFooterMobile)}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default MobileMenu
