import { Provider } from '@nestjs/common'
import { OpenInvoicesApi, OrganizationEmployeeApi } from '../../gen/fetch'
import { apiConfigFactory } from './apiConfig'
import {
  ConfigType,
  IdsClientConfig,
  LazyDuringDevScope,
} from '@island.is/nest/config'
import { ElfurClientConfig } from './elfur.config'

const apiLedger = [
  {
    api: OrganizationEmployeeApi,
    scopes: ['@fjs.is/elfur_employee_read', '@fjs.is/elfur_organization_read'],
  },
  {
    api: OpenInvoicesApi,
    scopes: [
      '@fjs.is/elfur_openinvoices_read',
      '@fjs.is/elfur_organization_read',
    ],
  },
]

export const apiProviders: Array<Provider> = apiLedger.map(
  ({ api, scopes }) => ({
    provide: api,
    scope: LazyDuringDevScope,
    useFactory: (
      config: ConfigType<typeof ElfurClientConfig>,
      idsClientConfig: ConfigType<typeof IdsClientConfig>,
    ) => {
      return new api(apiConfigFactory(scopes, config, idsClientConfig))
    },
    inject: [ElfurClientConfig.KEY, IdsClientConfig.KEY],
  }),
)
