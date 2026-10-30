import { useCallback, useContext, useEffect } from 'react'

import { CaseOrigin } from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

import { useDeletePoliceDigitalCaseFileMutation } from './deletePoliceDigitalCaseFile.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'
import { canAccessPoliceDigitalCaseFiles } from './usePoliceDigitalCaseFile.logic'

const usePoliceDigitalCaseFile = () => {
  const { user } = useContext(UserContext)
  const { workingCase, isLoadingWorkingCase, refreshCase } =
    useContext(FormContext)
  // Always ask with the case the user is looking at. Access is decided
  // against that case, and the backend resolves the original ancestor the
  // police digital case files live on after the guards have run.
  const { id: caseId, origin: caseOrigin } = workingCase

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
    variables: { input: { caseId } },
    skip:
      isLoadingWorkingCase ||
      caseOrigin !== CaseOrigin.LOKE ||
      !canAccessPoliceDigitalCaseFiles(user),
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
      } catch {
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
