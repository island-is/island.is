import React, { ReactElement } from 'react'
import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

interface ProjectWrapperProps {
  withSidebar?: boolean
  sidebarContent?: ReactElement
}

export const ProjectWrapper: React.FC<ProjectWrapperProps> = ({
  withSidebar = false,
  sidebarContent,
  children,
}) => {
  return withSidebar ? (
    <SidebarLayout isSticky={true} sidebarContent={sidebarContent}>
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
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ProjectWrapper
