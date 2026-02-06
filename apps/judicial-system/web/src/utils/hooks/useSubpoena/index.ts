import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { isSuccessfulServiceStatus } from '@island.is/judicial-system/types'
import { Subpoena } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCreateSubpoenasMutation } from './createSubpoenas.generated'
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

export const useCreateSubpoenas = () => {
  const [createSubpoenasMutation, { loading: isCreatingSubpoenas }] =
    useCreateSubpoenasMutation()

  const createSubpoenas = useCallback(
    async (
      caseId: string,
      input: {
        defendantIds: string[]
        arraignmentDate?: string
        location?: string
      },
    ) => {
      try {
        if (!isCreatingSubpoenas) {
          const { data, errors } = await createSubpoenasMutation({
            variables: {
              caseId,
              input,
            },
          })

          if (data?.createSubpoenas && !errors) {
            return true
          }
        }
        return false
      } catch (error) {
        toast.error('Upp kom villa við að búa til fyrirkall')
        return false
      }
    },
    [createSubpoenasMutation, isCreatingSubpoenas],
  )

  return { createSubpoenas, isCreatingSubpoenas }
}

export default useSubpoena
