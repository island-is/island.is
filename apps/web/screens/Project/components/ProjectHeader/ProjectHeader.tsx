import React from 'react'
import {
  DefaultProjectHeader,
  EntryProjectHeader,
  UkraineProjectHeader,
  ElectionProjectHeader,
} from '@island.is/web/components'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'

interface ProjectHeaderProps {
  projectPage: ProjectPageSchema
}

export const ProjectHeader = ({ projectPage }: ProjectHeaderProps) => {
  switch (projectPage.theme) {
    case 'traveling-to-iceland':
      return <EntryProjectHeader projectPage={projectPage} />
    case 'election':
      return <ElectionProjectHeader projectPage={projectPage} />
    case 'ukraine':
      return <UkraineProjectHeader projectPage={projectPage} />
    default:
      return <DefaultProjectHeader projectPage={projectPage} />
  }
}

export default ProjectHeader
