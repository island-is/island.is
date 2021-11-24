import React, { ReactElement, useRef } from 'react'
import { Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ISLAND_IS_URL } from '@island.is/service-portal/constants'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { m } from '@island.is/service-portal/core'

import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from '../Sidebar/ModuleNavigation'
import * as styles from './MobileMenu.css'

const MobileMenu = (): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { formatMessage } = useLocale()
  const navigation = useNavigation()

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
        <a href={ISLAND_IS_URL}>
          <Button variant="utility" fluid>
            {formatMessage(m.goToIslandIs)}
          </Button>
        </a>
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
