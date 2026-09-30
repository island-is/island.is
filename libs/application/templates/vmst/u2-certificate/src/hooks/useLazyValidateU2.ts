import { useLazyQuery } from '@apollo/client'
import { VALIDATE_U2_QUERY } from '../graphql/queries'
import { VmstApplicationsU2ValidationResponse } from '@island.is/api/schema'

export const useLazyValidateU2 = () => {
  const [execute] = useLazyQuery<
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
  return execute
}
