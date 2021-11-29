import { CompaniesResponse } from '@island.is/clients/rsk/v2'

export const createMockRskApi = () => {
  class RskApi {
    apicompanyregistrymembersKennitalacompaniesGET1(): CompaniesResponse {
      return {
        memberCompanies: [],
      }
    }
  }

  return new RskApi()
}
