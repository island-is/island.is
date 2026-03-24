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
    async (policeDigitalFileId: string) => {
      const newTab = window.open('', '_blank')

      if (!newTab) {
        toast.error('Ekki tókst að opna nýjan flipa fyrir rafrænt skjal')
        return
      }

      newTab.opener = null

      try {
        const result = await getTokenUrlQuery({
          variables: {
            input: { caseId, policeDigitalFileId },
          },
        })
        const url = result.data?.policeDigitalCaseFileTokenUrl
        if (url) {
          newTab.location.assign(url)
        } else {
          newTab.close()
          toast.error('Tengill á rafrænt skjal fannst ekki')
        }
      } catch {
        newTab.close()
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
