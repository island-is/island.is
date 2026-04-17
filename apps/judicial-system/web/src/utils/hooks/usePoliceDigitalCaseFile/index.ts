import { useCallback, useEffect } from 'react'

import { toast } from '@island.is/island-ui/core'
import { CaseOrigin } from '@island.is/judicial-system/types'

import { useDeletePoliceDigitalCaseFileMutation } from './deletePoliceDigitalCaseFile.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'

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

  useEffect(() => {
    const channel = new BroadcastChannel('police-digital-file-redirect')
    channel.onmessage = (event) => {
      if (event.data?.type === 'error') {
        toast.error('Tengill á rafrænt skjal fannst ekki')
      }
    }
    return () => channel.close()
  }, [])

  const openDigitalCaseFileUrl = useCallback(
    (policeDigitalFileId: string) => {
      window.open(
        `/akaera/rafraen-gogn?caseId=${caseId}&fileId=${policeDigitalFileId}`,
        '_blank',
        'noopener',
      )
    },
    [caseId],
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
    openDigitalCaseFileUrl,
    deletePoliceDigitalCaseFile,
  }
}

export default usePoliceDigitalCaseFile
