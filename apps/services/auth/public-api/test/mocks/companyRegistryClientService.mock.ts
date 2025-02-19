import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'

export const CompanyRegistryClientServiceMock: Partial<CompanyRegistryClientService> =
  {
    getCompany() {
      return Promise.resolve(null)
    },
  }
