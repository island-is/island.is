import { useCallback } from 'react'

import { toast } from '@island.is/island-ui/core'
import { CaseOrigin } from '@island.is/judicial-system/types'

import { useDeletePoliceDigitalCaseFileMutation } from './deletePoliceDigitalCaseFile.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'
import { usePoliceDigitalCaseFileTokenUrlLazyQuery } from './policeDigitalCaseFileTokenUrl.generated'

const usePoliceDigitalCaseFile = (
  caseId: string,
  caseOrigin: CaseOrigin | null | undefined,
) => {
  const {
    data,
    loading: digitalCaseFilesLoading,
    error: digitalCaseFilesError,
    refetch,
  } = usePoliceDigitalCaseFilesQuery({
    variables: { input: { caseId } },
    skip: caseOrigin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [deleteMutation, { loading: isDeleting }] =
    useDeletePoliceDigitalCaseFileMutation()

  const [getTokenUrlQuery, { loading: tokenUrlLoading }] =
    usePoliceDigitalCaseFileTokenUrlLazyQuery()

  const openDigitalCaseFileUrl = useCallback(
    async (rafraennGagnId: string) => {
      try {
        const result = await getTokenUrlQuery({
          variables: {
            input: { caseId, rafraennGagnId },
          },
        })
        const url = result.data?.policeDigitalCaseFileTokenUrl
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer')
        } else {
          toast.error('Tengill á rafrænt skjal fannst ekki')
        }
      } catch {
        toast.error('Upp kom villa við að sækja tengil á rafrænt skjal')
      }
    },
    [caseId, getTokenUrlQuery],
  )

  const deletePoliceDigitalCaseFile = useCallback(
    async (fileId: string) => {
      try {
        const { data } = await deleteMutation({
          variables: { input: { caseId, fileId } },
        })

        if (data?.deletePoliceDigitalCaseFile) {
          await refetch()
        }

        return Boolean(data?.deletePoliceDigitalCaseFile)
      } catch (error) {
        toast.error('Upp kom villa við að eyða hljóð- og myndupptöku')
        return false
      }
    },
    [caseId, deleteMutation, refetch],
  )

  return {
    digitalCaseFiles: data?.policeDigitalCaseFiles,
    digitalCaseFilesLoading,
    digitalCaseFilesError,
    isDeleting,
    tokenUrlLoading,
    openDigitalCaseFileUrl,
    deletePoliceDigitalCaseFile,
  }
}

export default usePoliceDigitalCaseFile
