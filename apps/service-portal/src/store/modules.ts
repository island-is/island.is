import { ServicePortalModule } from '@island.is/service-portal/core'
import { applicationsModule } from '@island.is/service-portal/applications'
import { documentsModule } from '@island.is/service-portal/documents'
import { settingsModule } from '@island.is/service-portal/settings'
import { financeModule } from '@island.is/service-portal/finance'
import { familyModule } from '@island.is/service-portal/family'
import { healthModule } from '@island.is/service-portal/health'

export const modules: ServicePortalModule[] = [
  applicationsModule,
  documentsModule,
  settingsModule,
  financeModule,
  familyModule,
  healthModule,
]
