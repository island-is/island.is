import { VALIDATE_U2_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { VmstApplicationsU2ValidationResponse } from '@island.is/api/schema'

export const useLazyValidateU2 = () => {
  return useLazyQuery<
    {
      vmstApplicationsU2Validation: VmstApplicationsU2ValidationResponse
    },
    {
      input: {
        dateWhenLeaving: string
        destinationCountryId: string
      }
    }
  >(VALIDATE_U2_QUERY)
}
