import React, { ReactElement, useMemo } from 'react'
import { useRouter } from 'next/router'

import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Link,
} from '@island.is/island-ui/core'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import { getSidebarNavigationComponent } from '../../utils'
import { ProjectChatPanel } from '../ProjectChatPanel'
import { ProjectHeader } from '../ProjectHeader'
import * as styles from './ProjectWrapper.css'

interface ProjectWrapperProps {
  withSidebar?: boolean
  sidebarContent?: ReactElement
  projectPage: ProjectPage
  breadcrumbItems: BreadCrumbItem[]
  sidebarNavigationTitle: string
  backLink?: { url: string; text: string }
  isSubpage?: boolean
}

export const ProjectWrapper: React.FC<
  React.PropsWithChildren<ProjectWrapperProps>
> = ({
  withSidebar = false,
  sidebarContent,
  projectPage,
  breadcrumbItems,
  sidebarNavigationTitle,
  children,
  isSubpage,
}) => {
  const router = useRouter()

  const { activeLocale } = useI18n()

  const mobileNavigationButtonOpenLabel =
    activeLocale === 'is' ? 'Opna' : 'Open'
  const mobileNavigationButtonCloseLabel =
    activeLocale === 'is' ? 'Loka' : 'Close'

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const projectPageSidebarNavigationComponent = useMemo(
    () =>
      getSidebarNavigationComponent(
        projectPage,
        baseRouterPath,
        sidebarNavigationTitle,
        mobileNavigationButtonOpenLabel,
        mobileNavigationButtonCloseLabel,
      ),
    [
      projectPage,
      baseRouterPath,
      sidebarNavigationTitle,
      mobileNavigationButtonOpenLabel,
      mobileNavigationButtonCloseLabel,
    ],
  )

  const showBackLink = projectPage.backLink?.url && projectPage.backLink?.text

  const aboveChildren = (
    <>
      {withSidebar && (
        <Hidden above="sm">
          <Box marginY={2}>
            {showBackLink && (
              <Box marginBottom={3}>
                <Link
                  href={projectPage.backLink?.url ?? ''}
                  underlineVisibility="always"
                  underline="normal"
                  color="blue400"
                >
                  <Icon size="small" icon="arrowBack" />
                  {projectPage.backLink?.text}
                </Link>
              </Box>
            )}
            {projectPageSidebarNavigationComponent(true)}
          </Box>
        </Hidden>
      )}
      {breadcrumbItems?.length > 0 && (
        <Box marginBottom={3}>
          <Breadcrumbs items={breadcrumbItems} />
        </Box>
      )}
    </>
  )

  return (
    <>
      <ProjectChatPanel projectPage={projectPage} />
      <Box>
        <ProjectHeader projectPage={projectPage} isSubpage={isSubpage} />
      </Box>
      {withSidebar ? (
        <SidebarLayout
          isSticky={true}
          sidebarContent={
            <>
              {showBackLink && (
                <Box marginBottom={3}>
                  <Link
                    href={projectPage.backLink?.url || ''}
                    underlineVisibility="always"
                    underline="normal"
                    color="blue400"
                  >
                    <Icon size="small" icon="arrowBack" />
                    {projectPage.backLink?.text}
                  </Link>
                </Box>
              )}
              {projectPage.sidebarLinks?.length > 0 &&
                projectPageSidebarNavigationComponent()}
              {sidebarContent}
            </>
          }
        >
          {aboveChildren}
          {children}
        </SidebarLayout>
      ) : (
        <Box className={styles.fullWidthContainer}>
          {showBackLink && (
            <Hidden below="md">
              <Link
                href={projectPage.backLink?.url || ''}
                underlineVisibility="always"
                underline="normal"
                color="blue400"
                className={styles.linkContainer}
              >
                <Icon size="small" icon="arrowBack" />
                {projectPage.backLink?.text}
              </Link>
            </Hidden>
          )}
          <GridContainer>
            {showBackLink && (
              <Hidden above="sm">
                <Box marginTop={4}>
                  <Link
                    href={projectPage.backLink?.url || ''}
                    underlineVisibility="always"
                    underline="normal"
                    color="blue400"
                    className={styles.linkContainerMobile}
                  >
                    <Icon size="small" icon="arrowBack" />
                    {projectPage.backLink?.text}
                  </Link>
                </Box>
              </Hidden>
            )}
            <GridRow>
              <GridColumn
                paddingTop={6}
                paddingBottom={6}
                span={[
                  '12/12',
                  '12/12',
                  projectPage.contentIsFullWidth ? '12/12' : '10/12',
                ]}
                offset={[
                  '0',
                  '0',
                  projectPage.contentIsFullWidth ? '0' : '1/12',
                ]}
              >
                {aboveChildren}

                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
    </>
  )
}

export default ProjectWrapper
