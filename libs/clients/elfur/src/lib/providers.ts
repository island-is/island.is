import { Provider } from '@nestjs/common'
import {
  Configuration,
  OpenInvoicesApi,
  OrganizationEmployeeApi,
} from '../../gen/fetch'
import { ApiConfigFactory } from './apiConfig'

const apiLedger = [{
  api: OrganizationEmployeeApi,
  scopes: ['@fjs.is/elfur_openinvoices_read']
}, {
  api: OpenInvoicesApi,
  scopes: ['@fjs.is/elfur_employee_read', '@fjs.is/elfur_organization_read']
}]

export const apiProviders: Array<Provider> = apiLedger.map(({api, scopes}) => ({
  provide: api,
  useFactory: (configuration: Configuration) => {
    return new api(configuration)
  },
  inject: [ApiConfigFactory(scopes).provide],
}))
