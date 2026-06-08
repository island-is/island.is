import { useCallback, useContext, useEffect } from 'react'

import { toast } from '@island.is/island-ui/core'
import { CaseOrigin } from '@island.is/judicial-system/types'

import { FormContext } from '../../../components'
import { useDeletePoliceDigitalCaseFileMutation } from './deletePoliceDigitalCaseFile.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'

const usePoliceDigitalCaseFile = () => {
  const { workingCase, isLoadingWorkingCase, refreshCase } =
    useContext(FormContext)
  const {
    id: caseId,
    origin: caseOrigin,
    originalAncestorId,
    splitCase,
  } = workingCase
  const effectiveCaseId = originalAncestorId ?? splitCase?.id ?? caseId

  const handleCompleted = useCallback(
    (completedData: {
      policeDigitalCaseFiles?: { isNew?: boolean | null }[] | null
    }) => {
      if (completedData.policeDigitalCaseFiles?.some((file) => file.isNew)) {
        refreshCase()
      }
    },
    [refreshCase],
  )

  const {
    data,
    loading: digitalCaseFilesLoading,
    error: digitalCaseFilesError,
    refetch,
  } = usePoliceDigitalCaseFilesQuery({
    variables: { input: { caseId: effectiveCaseId } },
    skip: isLoadingWorkingCase || caseOrigin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: handleCompleted,
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
        `/akaera/rafraen-gogn?caseId=${effectiveCaseId}&fileId=${policeDigitalFileId}`,
        '_blank',
        'noopener',
      )
    },
    [effectiveCaseId],
  )

  const deletePoliceDigitalCaseFile = useCallback(
    async (fileId: string) => {
      try {
        const { data } = await deleteMutation({
          variables: { input: { caseId: effectiveCaseId, fileId } },
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
    [effectiveCaseId, deleteMutation, refetch],
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
