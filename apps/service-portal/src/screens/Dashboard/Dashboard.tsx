import React, { FC, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@island.is/auth/react'
import {
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalPath,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import Greeting from '../../components/Greeting/Greeting'
import * as styles from './Dashboard.css'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'

export const Dashboard: FC<React.PropsWithChildren<{}>> = () => {
  const { userInfo } = useAuth()
  const location = useLocation()
  const mainNav = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'

  useEffect(() => {
    PlausiblePageviewDetail(
      ServicePortalPath.MinarSidurRoot,
      IS_COMPANY ? 'company' : 'person',
    )
  }, [location])

  const onHover = (id: string) => {
    const a: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    a && a.dispatchEvent(new Event('click'))
  }

  return (
    <Box>
      <Greeting />
      <GridContainer className={styles.relative}>
        <Box className={styles.imageAbsolute}>
          <img
            src={`./assets/images/${
              IS_COMPANY ? 'coffee.svg' : 'dashboard.svg'
            }`}
            alt=""
          />
        </Box>

        <GridRow data-testid={'service-portal-dashboard'}>
          {[mainNav].map((rootItem) => {
            return rootItem?.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                !navRoot.navHide && (
                  <GridColumn
                    key={formatMessage(navRoot.name) + '-' + index}
                    span={['12/12', '12/12', '12/12', '6/12', '4/12']}
                    paddingBottom={3}
                  >
                    <Box
                      onMouseEnter={() => onHover(navRoot.icon?.icon ?? '')}
                      height="full"
                      flexGrow={1}
                    >
                      {navRoot.path && (
                        <CategoryCard
                          autoStack
                          hyphenate
                          truncateHeading
                          component={Link}
                          to={navRoot.path}
                          icon={
                            isMobile && navRoot.icon ? (
                              <Icon
                                icon={navRoot.icon.icon}
                                type="outline"
                                color="blue400"
                              />
                            ) : (
                              iconTypeToSVG(navRoot.icon?.icon ?? '', '') ??
                              (navRoot.icon ? (
                                <Icon
                                  icon={navRoot.icon.icon}
                                  type="outline"
                                  color="blue400"
                                />
                              ) : undefined)
                            )
                          }
                          heading={formatMessage(navRoot.name)}
                          text={
                            navRoot.description
                              ? formatMessage(navRoot.description)
                              : formatMessage(navRoot.name)
                          }
                        />
                      )}
                    </Box>
                  </GridColumn>
                ),
            )
          })}
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default Dashboard
