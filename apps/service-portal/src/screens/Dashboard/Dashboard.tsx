import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
  ServicePortalModule,
  ServicePortalPath,
  ServicePortalWidget,
  m,
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import Greeting from '../../components/Greeting/Greeting'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'
import { WidgetErrorBoundary } from './WidgetError/WidgetError'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { iconIdMapper, iconTypeToSVG } from '../../utils/Icons/idMapper'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

const Widget: FC<{
  widget: ServicePortalWidget
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = React.memo(({ widget, userInfo, client }) => {
  const Component = widget.render({
    userInfo,
    client,
  })

  if (Component)
    return (
      <Suspense fallback={<WidgetLoading />}>
        <WidgetErrorBoundary name={widget.name}>
          <Component userInfo={userInfo} client={client} />
        </WidgetErrorBoundary>
      </Suspense>
    )

  return null
})

const WidgetLoader: FC<{
  modules: ServicePortalModule[]
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}> = ({ modules, userInfo, client }) => {
  const { formatMessage } = useLocale()

  const widgets = useMemo(
    () =>
      modules
        .reduce(
          (prev, curr) => [
            ...prev,
            ...curr.widgets({
              userInfo,
              client,
            }),
          ],
          [] as ServicePortalWidget[],
        )
        .sort((a, b) => a.weight - b.weight),
    [modules, userInfo, client],
  )

  return (
    <>
      {widgets.map((widget, index) => (
        <Box marginBottom={8} key={index}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {formatMessage(widget.name)}
            </Text>
          </Box>
          <Widget
            key={`widget-${index}`}
            widget={widget}
            userInfo={userInfo}
            client={client}
          />
        </Box>
      ))}
    </>
  )
}

export const Dashboard: FC<{}> = () => {
  const [{ modules, modulesPending }] = useStore()
  const { userInfo, client } = useModuleProps()
  const location = useLocation()
  const navigation = useNavigation()
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
      return navigation.map((rootItem) => {
        return rootItem.children
          ?.filter((item) => (keyItem ? item.keyItem : !item.keyItem))
          .map(
            (navRoot, index) =>
              navRoot.path !== ServicePortalPath.MinarSidurRoot &&
              !navRoot.navHide && (
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
      })
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
      <Box background="blue100" paddingTop={6}>
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

      {userInfo !== null && !modulesPending && (
        <WidgetLoader
          modules={Object.values(modules)}
          userInfo={userInfo}
          client={client}
        />
      )}
    </Box>
  )
}

export default Dashboard
