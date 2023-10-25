import React, { FC, useEffect, useState, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  Tabs,
  BreadcrumbsDeprecated as Breadcrumbs,
  Button,
} from '@island.is/island-ui/core'
import { m, ModuleAlertBannerSection } from '@island.is/service-portal/core'
import * as styles from './Layout.css'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import { IntroHeader } from '@island.is/service-portal/core'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import { ServicePortalPaths } from '../../lib/paths'
import { DocumentsPaths } from '@island.is/service-portal/documents'
import { theme } from '@island.is/island-ui/theme'

interface FullWidthLayoutProps {
  activeParent?: PortalNavigationItem
  height: number
  pathname: string
  children: ReactNode
}

export const FullWidthLayout: FC<FullWidthLayoutProps> = ({
  activeParent,
  height,
  pathname,
  children,
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const [navItems, setNavItems] = useState<PortalNavigationItem[] | undefined>()

  useEffect(() => {
    setNavItems(
      activeParent?.children?.filter((item) => !item.navHide) || undefined,
    )
  }, [activeParent?.children])

  // Dashboard has a special "no top navigation view"
  const isDashboard = Object.values(ServicePortalPaths).find((route) =>
    matchPath(route, pathname),
  )

  // Documents has a special "split screen view"
  const isDocuments = Object.values(DocumentsPaths).find((route) =>
    matchPath(route, pathname),
  )

  const tabChangeHandler = (id: string) => {
    if (id !== pathname) {
      navigate(id)
    }
  }

  return (
    <Box
      as="main"
      component="main"
      className={isDocuments ? styles.fullWidthSplit : undefined}
      style={{
        marginTop: height,
        minHeight: `calc(100vh - ${theme.headerHeight.large}px`,
      }}
    >
      <Box>
        {!isDashboard && !isDocuments && (
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
                      serviceProviderTooltip={
                        activeParent?.description
                          ? formatMessage(activeParent.description)
                          : undefined
                      }
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </>
        )}
        {navItems && navItems?.length > 0 ? (
          <Box paddingTop={4}>
            <GridContainer position="none">
              <GridRow>
                <GridColumn span="12/12">
                  <Tabs
                    selected={pathname}
                    key={navItems?.length}
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
                    onlyRenderSelectedTab
                  />
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  )
}

const FullWidthLayoutWrapper: FC<FullWidthLayoutProps> = (props) => {
  return (
    <FullWidthLayout {...props}>
      <ModuleAlertBannerSection paddingTop={2} />
      {props.children}
    </FullWidthLayout>
  )
}

export default FullWidthLayoutWrapper
