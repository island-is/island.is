import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath, YES } from '@island.is/application/core'

export const hasActiveEqualityReport = (ctx: ApplicationContext): boolean =>
  getValueViaPath<boolean>(
    ctx.application.externalData,
    'activeEqualityReport.data.hasActiveEqualityReport',
    false,
  ) === true

export const hasPostponedOutlierPlan = (ctx: ApplicationContext): boolean =>
  getValueViaPath<string[]>(
    ctx.application.answers,
    'salaryAnalysis.postponed',
    [],
  )?.includes(YES) ?? false
