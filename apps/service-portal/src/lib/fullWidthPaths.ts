import { DocumentsPaths } from '@island.is/service-portal/documents'
import { FinancePaths } from '@island.is/service-portal/finance'
import { ServicePortalPaths } from './paths'

export const fwPaths = Object.values({
  ...FinancePaths,
  ...DocumentsPaths,
  ...ServicePortalPaths,
}).filter((item) => item !== FinancePaths.FinanceRoot)
