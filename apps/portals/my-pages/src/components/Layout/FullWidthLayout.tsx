import { DocumentsScope } from '@island.is/auth/scopes'
import {
  Box,
  BreadcrumbsDeprecated as Breadcrumbs,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import {
  IntroHeader,
  m,
  ModuleAlertBannerSection,
  SearchPaths,
  ServicePortalPaths,
  TabNavigation,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { FinancePaths } from '@island.is/portals/my-pages/finance'
import { useUserInfo } from '@island.is/react-spa/bff'
import { FC, ReactNode, useEffect, useState } from 'react'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import * as styles from './Layout.css'

interface FullWidthLayoutWrapperProps {
  activeParent?: PortalNavigationItem
  height: number
  pathname: string
  children: ReactNode
}
type FullWidthLayoutProps = {
  isDashboard: boolean
  isDocuments: boolean
  isFinance: boolean
  isSearch: boolean
  isQuestionnaireDetail: boolean
} & FullWidthLayoutWrapperProps

export const FullWidthLayout: FC<FullWidthLayoutProps> = ({
  activeParent,
  height,
  pathname,
  children,
  isDashboard,
  isDocuments,
  isFinance,
  isSearch,
  isQuestionnaireDetail,
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const [navItems, setNavItems] = useState<PortalNavigationItem[] | undefined>()

  useEffect(() => {
    const visibleNavItems =
      activeParent?.children?.filter((item) => !item.navHide) || undefined
    setNavItems(visibleNavItems)
  }, [activeParent?.children])

  const hasDocumentsDelegationAccess = userInfo?.scopes?.includes(
    DocumentsScope.main,
  )

  return (
    <Box
      as="main"
      component="main"
      className={
        isDocuments && hasDocumentsDelegationAccess
          ? styles.fullWidthSplit
          : undefined
      }
      background={isQuestionnaireDetail ? 'blue100' : 'white'}
      paddingTop={
        isDocuments || isDashboard || isQuestionnaireDetail
          ? undefined
          : isFinance
          ? [0, 0, 9]
          : 9
      }
      style={{
        marginTop: height,
        minHeight: `calc(100vh - ${theme.headerHeight.large}px`,
      }}
    >
      <Box>
        {!isDashboard && !isDocuments && !isSearch && !isQuestionnaireDetail && (
          <>
            <Box paddingBottom={[3, 4]} paddingTop={[4, 4, 0]}>
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
            <Box>
              <GridContainer position="none">
                <GridRow>
                  <GridColumn span="12/12">
                    <IntroHeader
                      title={activeParent?.name || ''}
                      intro={
                        isFinance
                          ? activeParent?.intro
                          : activeParent?.description
                      }
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </>
        )}
        {navItems && navItems?.length > 0 && !isQuestionnaireDetail ? (
          <Box>
            <GridContainer position="none">
              <GridRow>
                <GridColumn span="12/12">
                  <TabNavigation
                    label={
                      activeParent?.name ? formatMessage(activeParent.name) : ''
                    }
                    pathname={pathname}
                    items={navItems}
                  />
                  {children}
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

const FullWidthLayoutWrapper: FC<FullWidthLayoutWrapperProps> = (props) => {
  // Dashboard has a special "no top navigation view"
  const isDashboard = Object.values(ServicePortalPaths).find((route) =>
    matchPath(route, props.pathname),
  )

  // Documents has a special "split screen view"
  const isDocuments = Object.values(DocumentsPaths).find((route) =>
    matchPath(route, props.pathname),
  )

  // Finance does not need extra padding in mobile
  const isFinance = Object.values(FinancePaths).find((route) =>
    matchPath(route, props.pathname),
  )

  const isSearch = Object.values(SearchPaths).find((route) =>
    matchPath(route, props.pathname),
  )

  const isSpecialView = !!isDashboard || !!isDocuments

  const isQuestionnaireDetail =
    matchPath('/heilsa/spurningalistar/:id/svara', props.pathname) !== null
  return (
    <FullWidthLayout
      isDashboard={!!isDashboard}
      isDocuments={!!isDocuments}
      isFinance={!!isFinance}
      isSearch={!!isSearch}
      isQuestionnaireDetail={isQuestionnaireDetail}
      {...props}
    >
      <ModuleAlertBannerSection paddingTop={isSpecialView ? 0 : 2} />
      {props.children}
    </FullWidthLayout>
  )
}

export default FullWidthLayoutWrapper
