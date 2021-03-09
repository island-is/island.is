import { ServicePortalModule } from '@island.is/service-portal/core'
import { documentProviderModule } from '@island.is/service-portal/document-provider'
import { documentsModule } from '@island.is/service-portal/documents'
import { familyModule } from '@island.is/service-portal/family'
import { financeModule } from '@island.is/service-portal/finance'
import { settingsModule } from '@island.is/service-portal/settings'

// NOTE:
// Modules should only be here if they are production ready
// or if they are ready for beta testing. Modules that are ready
// for beta testing should be feature flagged.
//
// To feature flag a module add it to the featureFlaggedMoudles below
// and create a feature flag in Configcat called
// `isServicePortalFinanceModuleEnabled` where your module is called `finance`.

export type ModuleKeys =
  | 'documentProvider'
  | 'documents'
  | 'family'
  | 'finance'
  | 'settings'

export const featureFlaggedModules: ModuleKeys[] = ['documentProvider']

export const modules: Record<ModuleKeys, ServicePortalModule> = {
  documentProvider: documentProviderModule,
  documents: documentsModule,
  family: familyModule,
  finance: financeModule,
  settings: settingsModule,
}
