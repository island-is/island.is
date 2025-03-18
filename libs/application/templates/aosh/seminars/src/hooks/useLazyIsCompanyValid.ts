import { IS_COMPANY_VALID_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { CompanyDTO } from '@island.is/clients/seminars-ver'

export const useLazyIsCompanyValid = () => {
  return useLazyQuery<
    {
      seminarsVerIsCompanyValid: CompanyDTO
    },
    {
      nationalId: string
    }
  >(IS_COMPANY_VALID_QUERY)
}
