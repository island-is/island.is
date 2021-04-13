import { Application } from '@island.is/application/core'

export interface DecodedAssignmentToken {
  applicationId: string
  state: string
}

export interface StateChangeResult {
  error?: string
  hasError: boolean
  hasChanged: boolean
  application: Application
}

export interface TemplateAPIModuleActionResult {
  updatedApplication: Application
  hasError: boolean
  error?: string
}

export interface ApplicationLifecycle {
  isListed: boolean
  pruneAt: Date | null
}
