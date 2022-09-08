import React, { ReactElement, useMemo } from 'react'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { ProjectChatPanel } from '../ProjectChatPanel'
import { ProjectHeader } from '../ProjectHeader'
import { ProjectPage } from '@island.is/web/graphql/schema'
import { getSidebarNavigationComponent } from '../../utils'
import { useRouter } from 'next/router'

interface ProjectWrapperProps {
  withSidebar?: boolean
  sidebarContent?: ReactElement
  projectPage: ProjectPage
  breadcrumbItems: BreadCrumbItem[]
  sidebarNavigationTitle: string
}

export const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  withSidebar = false,
  sidebarContent,
  projectPage,
  breadcrumbItems,
  sidebarNavigationTitle,
  children,
}) => {
  const router = useRouter()

  const baseRouterPath = router.asPath.split('?')[0].split('#')[0]
  const projectPageSidebarNavigationComponent = useMemo(
    () =>
      getSidebarNavigationComponent(
        projectPage,
        baseRouterPath,
        sidebarNavigationTitle,
      ),
    [projectPage, baseRouterPath, sidebarNavigationTitle],
  )

  const aboveChildren = (
    <>
      <Hidden above="sm">
        <Box>
          <Box marginY={2}>{projectPageSidebarNavigationComponent(true)}</Box>
        </Box>
      </Hidden>
      <Box marginBottom={3}>
        <Breadcrumbs items={breadcrumbItems} />
      </Box>
    </>
  )

  return (
    <>
      <ProjectChatPanel projectPage={projectPage} />
      <ProjectHeader projectPage={projectPage} />
      {withSidebar ? (
        <SidebarLayout
          isSticky={true}
          sidebarContent={
            <>
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
        <GridContainer>
          <GridRow>
            <GridColumn
              paddingTop={6}
              paddingBottom={6}
              span={['12/12', '12/12', '10/12']}
              offset={['0', '0', '1/12']}
            >
              {aboveChildren}
              {children}
            </GridColumn>
          </GridRow>
        </GridContainer>
      )}
    </>
  )
}

export default ProjectWrapper
