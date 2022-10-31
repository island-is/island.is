import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import React, { FC, Suspense, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

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
} from '@island.is/service-portal/core'
import { User } from '@island.is/shared/types'
import Greeting from '../../components/Greeting/Greeting'
import { useModuleProps } from '../../hooks/useModuleProps/useModuleProps'
import { useStore } from '../../store/stateProvider'
import { WidgetErrorBoundary } from './WidgetError/WidgetError'
import WidgetLoading from './WidgetLoading/WidgetLoading'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { AuthDelegationType } from '@island.is/shared/types'
import * as styles from './Dashboard.css'
import { useHistory } from 'react-router-dom'
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
  const history = useHistory()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'

  const delegationTypes = userInfo?.profile?.delegationType ?? []

  const isLegalGuardian = delegationTypes.includes(
    AuthDelegationType.LegalGuardian,
  )

  useEffect(() => {
    PlausiblePageviewDetail(ServicePortalPath.MinarSidurRoot)
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
        {!isLegalGuardian && (
          <Box className={styles.imageAbsolute}>
            <img
              src={`./assets/images/${
                IS_COMPANY ? 'coffee.svg' : 'dashboard.svg'
              }`}
              alt=""
            />
          </Box>
        )}
        <GridRow data-testid={'service-portal-dashboard'}>
          {navigation.map((rootItem) => {
            return rootItem.children?.map(
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
                      onClick={() => navRoot.path && history.push(navRoot.path)}
                    >
                      {navRoot.path && (
                        <CategoryCard
                          autoStack
                          hyphenate
                          truncateHeading
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
          })}
        </GridRow>
      </GridContainer>

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
