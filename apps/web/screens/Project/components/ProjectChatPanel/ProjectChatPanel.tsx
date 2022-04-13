import React from 'react'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'
import { UkraineChatPanel, WatsonChatPanel } from '@island.is/web/components'
import { watsonConfig } from './config'

interface ProjectChatPanelProps {
  projectPage: ProjectPageSchema
}

export const ProjectChatPanel = ({ projectPage }: ProjectChatPanelProps) => {
  if (projectPage.id === '7GtuCCd7MEZhZKe0oXcHdb') {
    return <UkraineChatPanel />
  }
  if (projectPage.id in watsonConfig) {
    return <WatsonChatPanel {...watsonConfig[projectPage.id]} />
  }
  return null
}

export default ProjectChatPanel
