import React from 'react'

import { LiveChatIncChatPanel } from '@island.is/web/components'
import { ProjectPage as ProjectPageSchema } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { liveChatIncConfig } from './config'

interface ProjectChatPanelProps {
  projectPage: ProjectPageSchema
}

export const ProjectChatPanel = ({ projectPage }: ProjectChatPanelProps) => {
  const { activeLocale } = useI18n()

  if (projectPage.id in liveChatIncConfig[activeLocale]) {
    return (
      <LiveChatIncChatPanel
        {...liveChatIncConfig[activeLocale][projectPage.id]}
      />
    )
  }
  return null
}

export default ProjectChatPanel
