import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale, useLocale, useNamespaces } from '@island.is/localization'
import { ISLAND_IS_URL } from '@island.is/service-portal/constants'
import { ServicePortalPath } from '@island.is/service-portal/core'
import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import { getMobileMenuFigure } from './figuresMapper'
import * as styles from './MobileMenu.treat'

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
            const figure = getMobileMenuFigure(navItem.path)

            return (
              <GridColumn key={`info-${index}`} span={['1/2', '1/4']}>
                <Link
                  to={navItem.path || ''}
                  className={styles.link}
                  onClick={handleLinkClick}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="full"
                    background="white"
                    padding={2}
                    borderRadius="large"
                    textAlign="center"
                    className={styles.figureCard}
                  >
                    <Box
                      className={styles.figure}
                      style={{ backgroundImage: `url(${figure})` }}
                      marginBottom={2}
                    />
                    <Text variant="eyebrow" color="blueberry400">
                      {formatMessage(navItem.name)}
                    </Text>
                  </Box>
                </Link>
              </GridColumn>
            )
          }) || null}
        </GridRow>
        <GridRow>
          {actions?.children?.map((navItem, index) => {
            if (navItem.path === ServicePortalPath.MinarSidurRoot) return null

            return (
              <GridColumn key={`info-${index}`} span={['1/2', '1/4']}>
                <Link
                  to={navItem.path || ''}
                  className={styles.link}
                  onClick={handleLinkClick}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="full"
                    background="blueberry100"
                    paddingY={3}
                    paddingX={2}
                    borderRadius="large"
                    textAlign="center"
                  >
                    <Box
                      className={styles.icon}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      marginBottom={2}
                      borderRadius="circle"
                      background="blueberry200"
                    >
                      {navItem.icon && (
                        <Icon
                          type={navItem.icon.type}
                          icon={navItem.icon.icon}
                          size="medium"
                          color="blueberry400"
                        />
                      )}
                    </Box>
                    <Text variant="eyebrow" color="blueberry400">
                      {formatMessage(navItem.name)}
                    </Text>
                  </Box>
                </Link>
              </GridColumn>
            )
          }) || null}
        </GridRow>
      </Stack>
    </Box>
  )
}

export default MobileMenu
