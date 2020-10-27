import {
  Box,
  GridColumn,
  GridRow,
  Icon,
  Typography,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
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
  const { formatMessage } = useLocale()
  const navigation = useNavigation()
  const info = navigation[0]
  const actions = navigation[1]

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
      padding={3}
      background="blueberry100"
      className={styles.wrapper}
    >
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
                >
                  <Box
                    className={styles.figure}
                    style={{ backgroundImage: `url(${figure})` }}
                    marginBottom={2}
                  />
                  <Typography variant="h5">
                    {formatMessage(navItem.name)}
                  </Typography>
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
                  background="white"
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
                        color="blueberry300"
                      />
                    )}
                  </Box>
                  <Typography variant="h5">
                    {formatMessage(navItem.name)}
                  </Typography>
                </Box>
              </Link>
            </GridColumn>
          )
        }) || null}
      </GridRow>
    </Box>
  )
}

export default MobileMenu
