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
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PlausiblePageviewDetail,
  ServicePortalPath,
  ServicePortalWidget,
  m,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import Greeting from '../../components/Greeting/Greeting'
import { WidgetErrorBoundary } from './WidgetError/WidgetError'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { useNavigation } from '@island.is/portals/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'

export const Dashboard: FC<{}> = () => {
  const { userInfo } = useAuth()
  const location = useLocation()
  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  useEffect(() => {
    PlausiblePageviewDetail(ServicePortalPath.MinarSidurRoot)
  }, [location])

  const onHover = (id: string) => {
    const a: HTMLElement | null | '' =
      id && document.getElementById(iconIdMapper(id))
    a && a.dispatchEvent(new Event('click'))
  }
  const displayCards = (keyItem: boolean) => {
    // eslint-disable-next-line no-lone-blocks
    {
      return navigation?.children
        ?.filter((item) => (keyItem ? item.isKeyitem : !item.isKeyitem))
        .filter((item) => !item.navHide)
        .map(
          (navRoot, index) =>
            navRoot.path !== ServicePortalPath.MinarSidurRoot && (
              <GridColumn
                key={formatMessage(navRoot.name) + '-' + index}
                offset={index % 3 === 0 ? ['0', '0', '0', '1/12'] : '0'}
                span={['12/12', '12/12', '12/12', '3/12', '3/12']}
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
                          iconTypeToSVG(navRoot.icon?.icon ?? '', '')
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
    }
  }

  return (
    <Box>
      <Greeting />
      <Box paddingTop={[3, 3, 3, 6]} marginBottom={3}>
        <GridContainer>
          <GridRow>{displayCards(true)}</GridRow>
        </GridContainer>
      </Box>
      <Box paddingTop={6}>
        <GridContainer>
          <GridRow>
            <GridColumn offset={['0', '0', '0', '1/12']}>
              <Text variant="h3" paddingBottom={3}>
                {formatMessage(m.myCategories)}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow data-testid={'service-portal-dashboard'}>
            {displayCards(false)}
          </GridRow>
        </GridContainer>
      </Box>
      {/* 
      {userInfo !== null && !modulesPending && (
        <WidgetLoader
          modules={Object.values(modules)}
          userInfo={userInfo}
          client={client}
        />
      )} */}
    </Box>
  )
}

export default Dashboard
