import { useCallback, useContext, useEffect } from 'react'

import { toast } from '@island.is/island-ui/core'
import { CaseOrigin } from '@island.is/judicial-system/types'

import { FormContext } from '../../../components'
import { useDeletePoliceDigitalCaseFileMutation } from './deletePoliceDigitalCaseFile.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'

const usePoliceDigitalCaseFile = () => {
  const { workingCase, refreshCase } = useContext(FormContext)
  const { id: caseId, origin: caseOrigin, parentCase } = workingCase

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
    variables: { input: { caseId: parentCase ? parentCase.id : caseId } },
    skip: caseOrigin !== CaseOrigin.LOKE,
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
