import { isSuccessfulServiceStatus } from '@island.is/judicial-system/types'
import { Subpoena } from '@island.is/judicial-system-web/src/graphql/schema'

import { useSubpoenaQuery } from './subpoena.generated'

const useSubpoena = (subpoena: Subpoena) => {
  // Skip if the subpoena has not been sent to the police
  // or if the subpoena already has a service status
  const skip =
    !subpoena.policeSubpoenaId ||
    isSuccessfulServiceStatus(subpoena.serviceStatus)

  const { data, loading, error } = useSubpoenaQuery({
    skip,
    variables: {
      input: {
        caseId: subpoena?.caseId ?? '',
        defendantId: subpoena?.defendantId ?? '',
        subpoenaId: subpoena?.id ?? '',
      },
    },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  return {
    subpoena: skip || error ? subpoena : data?.subpoena,
    subpoenaLoading: skip ? false : loading,
  }
}

export default useSubpoena
