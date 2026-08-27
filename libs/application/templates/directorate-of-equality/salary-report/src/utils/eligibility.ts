import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { isPostponeRequested } from './salaryAnalysisNavigation'

export const hasActiveEqualityReport = (ctx: ApplicationContext): boolean =>
  getValueViaPath<boolean>(
    ctx.application.externalData,
    'activeEqualityReport.data.hasActiveEqualityReport',
    false,
  ) === true

export const hasPostponedOutlierPlan = (ctx: ApplicationContext): boolean =>
  isPostponeRequested(ctx.application.answers)
