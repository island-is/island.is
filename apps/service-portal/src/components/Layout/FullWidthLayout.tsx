import React, { FC, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Tabs,
  BreadcrumbsDeprecated as Breadcrumbs,
  Icon,
  Button,
} from '@island.is/island-ui/core'
import { m } from '@island.is/service-portal/core'
import * as styles from './Layout.css'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { ServicePortalPaths } from '../../lib/paths'

interface FullWidthLayoutProps {
  activeParent?: PortalNavigationItem
  height: number
}

export const FullWidthLayout: FC<FullWidthLayoutProps> = ({
  activeParent,
  height,
  children,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { formatMessage } = useLocale()
  const isDashboard = Object.values(ServicePortalPaths).find((route) =>
    matchPath(route, location.pathname),
  )

  const tabChangeHandler = (id: string) => {
    if (id !== location.pathname) {
      navigate(id)
    }
  }

  const navItems = activeParent?.children?.filter((item) => !item.navHide) || []

  return (
    <Box as="main" component="main" style={{ marginTop: height }}>
      <Box>
        {!isDashboard && (
          <>
            <Box
              paddingBottom={[3, 4]}
              paddingTop={[4, 4, 0]}
              background="blue100"
            >
              <GridContainer className={styles.wrap} position="none">
                <GridRow>
                  <GridColumn span="12/12">
                    <Breadcrumbs color="blue400" separatorColor="blue400">
                      <Box display="inline" className={styles.btn}>
                        <Button
                          preTextIcon="arrowBack"
                          preTextIconType="filled"
                          size="small"
                          type="button"
                          variant="text"
                          onClick={() => navigate('/')}
                        >
                          {formatMessage(m.goBackToDashboard)}
                        </Button>
                      </Box>
                      {activeParent?.path && activeParent?.name && (
                        <Link to={activeParent.path}>
                          {formatMessage(activeParent.name)}
                        </Link>
                      )}
                    </Breadcrumbs>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
            <Box
              marginBottom={4}
              paddingTop={0}
              paddingBottom={2}
              background="blue100"
            >
              <GridContainer position="none">
                <GridRow>
                  <GridColumn span="12/12">
                    <IntroHeader
                      title={activeParent?.name || ''}
                      intro={activeParent?.heading}
                      serviceProviderID={activeParent?.serviceProvider}
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </>
        )}
        {navItems.length > 0 ? (
          <Box paddingTop={4}>
            <GridContainer position="none">
              <GridRow>
                <GridColumn span="12/12">
                  <Tabs
                    selected={location.pathname}
                    onChange={tabChangeHandler}
                    label={
                      activeParent?.name ? formatMessage(activeParent.name) : ''
                    }
                    tabs={navItems?.map((item) => ({
                      id: item.path,
                      label: formatMessage(item.name),
                      content: children,
                    }))}
                    contentBackground="white"
                  />
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        ) : (
          <GridContainer position="none">
            <GridRow>
              <GridColumn span="12/12">{children}</GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Box>
    </Box>
  )
}

export default FullWidthLayout
