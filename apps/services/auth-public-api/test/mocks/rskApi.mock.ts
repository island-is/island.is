import { CompaniesResponse } from '@island.is/clients/rsk/v2'

export const RskApiMock = {
  apicompanyregistrymembersKennitalacompaniesGET1(): CompaniesResponse {
    return {
      memberCompanies: [],
    }
  },
}
