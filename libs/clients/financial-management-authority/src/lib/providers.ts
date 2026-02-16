import { Provider } from '@nestjs/common'
import { OrganizationEmployeeApi, VacancyApi } from '../../gen/fetch'
import { apiConfigFactory } from './apiConfig'
import { ConfigType, LazyDuringDevScope } from '@island.is/nest/config'
import { FinancialManagementAuthorityClientConfig } from './financialManagementAuthorityClient.config'

const apiLedger = [
  {
    api: OrganizationEmployeeApi,
    scopes: ['@fjs.is/elfur_employee_read', '@fjs.is/elfur_organization_read'],
  },
  {
    api: VacancyApi,
    scopes: ['@fjs.is/elfur_vacancy_read', '@fjs.is/elfur_vacancy_write'],
  },
]

export const apiProviders: Array<Provider> = apiLedger.map(
  ({ api, scopes }) => ({
    provide: api,
    scope: LazyDuringDevScope,
    useFactory: (
      config: ConfigType<typeof FinancialManagementAuthorityClientConfig>,
    ) => {
      return new api(apiConfigFactory(scopes, config))
    },
    inject: [FinancialManagementAuthorityClientConfig.KEY],
  }),
)
