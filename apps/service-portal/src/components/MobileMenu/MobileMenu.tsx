import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { Locale, useLocale, useNamespaces } from '@island.is/localization'
import { ISLAND_IS_URL } from '@island.is/service-portal/constants'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import * as styles from './MobileMenu.treat'
import MobileMenuItem from './MobileMenuItem'

const MobileMenu: FC<{}> = () => {
  const [{ mobileMenuState }, dispatch] = useStore()
  const { lang, formatMessage } = useLocale()
  const navigation = useNavigation()
  const info = navigation[0]
  const actions = navigation[1]
  const { changeLanguage } = useNamespaces()

  const handleLangClick = (value: Locale) => changeLanguage(value)

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
      paddingX={3}
      paddingBottom={3}
      background="white"
      className={styles.wrapper}
    >
      <Box marginBottom={2}>
        <GridRow>
          <GridColumn span="4/6">
            <a href={ISLAND_IS_URL}>
              <Button variant="utility" fluid>
                {formatMessage({
                  id: 'service.portal:go-to-island-is',
                  defaultMessage: 'Fara á ytrivef island.is',
                })}
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
      <Stack space={[0, 2, 2, 0]}>
        <GridRow>
          {info?.children?.map((navItem, index) => {
            if (navItem.path === ServicePortalPath.MinarSidurRoot) return null
            return (
              <MobileMenuItem
                key={`info-${index}`}
                item={navItem}
                onClick={handleLinkClick}
                itemName={formatMessage(navItem.name)}
              />
            )
          }) || null}
          {actions?.children?.map((navItem, index) => {
            if (navItem.path === ServicePortalPath.MinarSidurRoot) return null
            return (
              <MobileMenuItem
                key={`action-${index}`}
                item={navItem}
                onClick={handleLinkClick}
                itemName={formatMessage(navItem.name)}
              />
            )
          }) || null}
        </GridRow>
      </Stack>
    </Box>
  )
}

export default MobileMenu
