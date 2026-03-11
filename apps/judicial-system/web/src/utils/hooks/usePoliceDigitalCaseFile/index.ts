import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { CreatePoliceDigitalCaseFileInput } from '@island.is/judicial-system-web/src/graphql/schema'

import { useCasePoliceDigitalCaseFilesQuery } from './casePoliceDigitalCaseFiles.generated'
import { useCreatePoliceDigitalCaseFileMutation } from './createPoliceDigitalCaseFile.generated'

const usePoliceDigitalCaseFile = (
  caseId: string,
  policeCaseNumber?: string,
) => {
  const { data, loading: isLoading, error } = useCasePoliceDigitalCaseFilesQuery(
    {
      variables: { input: { caseId, policeCaseNumber } },
      skip: !caseId,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [createMutation, { loading: isCreating }] =
    useCreatePoliceDigitalCaseFileMutation()

  const createPoliceDigitalCaseFile = useCallback(
    async (
      input: Omit<CreatePoliceDigitalCaseFileInput, 'caseId'>,
    ) => {
      try {
        const { data } = await createMutation({
          variables: { input: { caseId, ...input } },
        })

        return data?.createPoliceDigitalCaseFile ?? null
      } catch (error) {
        toast.error('Upp kom villa við að vista hljóð- og myndupptöku')
        return null
      }
    },
    [caseId, createMutation],
  )

  return {
    casePoliceDigitalCaseFiles: data?.casePoliceDigitalCaseFiles ?? [],
    isLoading,
    isCreating,
    hasError: Boolean(error),
    createPoliceDigitalCaseFile,
  }
}

export default usePoliceDigitalCaseFile
