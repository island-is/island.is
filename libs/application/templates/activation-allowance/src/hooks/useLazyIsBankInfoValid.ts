import { VALIDATE_ACCOUNT_NUMBER } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyIsBankInfoValid = () => {
  return useLazyQuery<boolean>(VALIDATE_ACCOUNT_NUMBER)
}
