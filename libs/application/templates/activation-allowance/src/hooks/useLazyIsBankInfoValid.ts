import { useLazyQuery } from '@apollo/client'
import { VALIDATE_ACCOUNT_NUMBER } from '../graphql/queries'

export const useLazyIsBankInfoValid = () => {
  return useLazyQuery<
    {
      vmstApplicationsAccountNumbervalidation: boolean
    },
    {
      input: {
        bankNumber: string
        ledger: string
        accountNumber: string
      }
    }
  >(VALIDATE_ACCOUNT_NUMBER)
}
