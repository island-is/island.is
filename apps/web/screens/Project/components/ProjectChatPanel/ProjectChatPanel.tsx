import React from 'react'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'
import {
  LiveChatIncChatPanel,
  WatsonChatPanel,
} from '@island.is/web/components'
import { liveChatIncConfig, watsonConfig } from './config'

interface ProjectChatPanelProps {
  projectPage: ProjectPageSchema
}

export const ProjectChatPanel = ({ projectPage }: ProjectChatPanelProps) => {
  if (projectPage.id in liveChatIncConfig) {
    return <LiveChatIncChatPanel {...liveChatIncConfig[projectPage.id]} />
  }
  if (projectPage.id in watsonConfig) {
    return <WatsonChatPanel {...watsonConfig[projectPage.id]} />
  }
  return null
}

export default ProjectChatPanel
