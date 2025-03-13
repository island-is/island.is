import { gql } from '@apollo/client'
import { IS_COMPANY_VALID } from '../graphql/queries'
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
  >(
    gql`
      ${IS_COMPANY_VALID}
    `,
  )
}
