import { TestingModuleBuilder } from '@nestjs/testing'

import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { TestApp, testServer, useDatabase } from '@island.is/testing/nest'
import { AppModule } from '../src/app/app.module'
import { SequelizeConfigService } from '../src/sequelizeConfig.service'

// Feature flags that gate the payment controllers via FeatureFlagGuard. In tests the
// ConfigCat client cannot fetch, so each flag would otherwise resolve to its `false`
// default and every gated endpoint would respond 403. Enable them explicitly.
const enabledFeatureFlags = new Set<Features>([
  Features.isIslandisPaymentEnabled,
  Features.isIslandisBankTransferPaymentEnabled,
  Features.isIslandisInvoicePaymentEnabled,
])

export const overrideFeatureFlags = (builder: TestingModuleBuilder) =>
  builder.overrideProvider(FeatureFlagService).useValue({
    getValue: jest.fn((feature: Features) =>
      Promise.resolve(enabledFeatureFlags.has(feature)),
    ),
  })

export const setupTestApp = async (): Promise<TestApp> => {
  const app = await testServer({
    appModule: AppModule,
    enableVersioning: true,
    override: overrideFeatureFlags,
    hooks: [
      useDatabase({ type: 'postgres', provider: SequelizeConfigService }),
    ],
  })

  return app
}
