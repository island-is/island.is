import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'

export const hasActiveEqualityReport = (ctx: ApplicationContext): boolean =>
  getValueViaPath<boolean>(
    ctx.application.externalData,
    'activeEqualityReport.data.hasActiveEqualityReport',
    false,
  ) === true
