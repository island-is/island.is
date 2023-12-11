import { ApplicationContext } from '@island.is/application/types'

export function hasApprovedExternalData(context: ApplicationContext): boolean {
  return context.application.answers.approveExternalData === true
}
