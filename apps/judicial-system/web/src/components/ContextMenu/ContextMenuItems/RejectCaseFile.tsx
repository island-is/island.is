import { useState } from 'react'

import { toast } from '@island.is/island-ui/core'
import {
  ContextMenuItem,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

import { useRejectFileMutation } from './rejectCaseFile.generated'

export const useRejectCaseFile = (onComplete: (caseFile: CaseFile) => void) => {
  const [caseFileToReject, setCaseFileToReject] = useState<CaseFile>()
  const [rejectFile, { loading: isRejectingFile }] = useRejectFileMutation()

  const rejectCaseFile = (caseFile: CaseFile): ContextMenuItem => {
    return {
      title: 'Eyða skjali',
      icon: 'trash',
      onClick: () => {
        if (caseFileToReject) {
          return
        }

        setCaseFileToReject(caseFile)
      },
    }
  }

  const handlePrimaryButtonClick = async () => {
    if (!caseFileToReject || !caseFileToReject.caseId) {
      return
    }

    try {
      const rejected = await rejectFile({
        variables: {
          input: {
            id: caseFileToReject.id,
            caseId: caseFileToReject.caseId,
          },
        },
      })

      if (rejected.errors || !rejected.data || !rejected.data.rejectFile) {
        throw new Error('Failed to reject file')
      }

      onComplete(rejected.data.rejectFile)

      setCaseFileToReject(undefined)
    } catch {
      toast.error('Upp kom villa við að eyða skjali.')
    }
  }

  const handleSecondaryButtonClick = () => {
    setCaseFileToReject(undefined)
  }

  const RejectCaseFileModal = caseFileToReject && (
    <Modal
      title="Eyða skjali"
      text="Ertu viss um að þú viljir eyða þessu skjali?"
      primaryButton={{
        text: 'Eyða',
        onClick: handlePrimaryButtonClick,
        colorScheme: 'destructive',
        isLoading: isRejectingFile,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: handleSecondaryButtonClick,
      }}
    />
  )

  return { rejectCaseFile, RejectCaseFileModal }
}
