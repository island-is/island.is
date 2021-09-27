import { useMutation } from '@apollo/client'
import { UploadFileToCourtMutation } from '@island.is/judicial-system-web/graphql'
import {
  Case,
  CaseFile as TCaseFile,
  CaseFileState,
  UploadState,
} from '@island.is/judicial-system/types'
import { useEffect, useState } from 'react'

export type CaseFileStatus = 'error' | 'done' | 'uploading'

export interface CaseFile extends TCaseFile {
  status: CaseFileStatus
}

export const useCourtUpload = (
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>,
) => {
  const [uploadState, setUploadState] = useState<UploadState>()
  const [uploadFileToCourtMutation] = useMutation(UploadFileToCourtMutation)

  useEffect(() => {
    const files = workingCase.files as CaseFile[]

    files?.forEach((file) => {
      if (
        file.state === CaseFileState.STORED_IN_COURT &&
        file.status !== 'done'
      ) {
        setFileUploadStatus(file, 'done', file.state)
      }
    })

    setUploadState(
      files?.some((file) => file.status === 'uploading')
        ? UploadState.UPLOADING
        : files?.every((file) => file.state === CaseFileState.STORED_IN_COURT)
        ? UploadState.ALL_UPLOADED
        : files?.every((file) => file.state === CaseFileState.STORED_IN_RVG)
        ? UploadState.NONE_UPLOADED
        : files?.some((file) => file.status === 'error')
        ? UploadState.SOME_UPLOADED
        : undefined,
    )
  }, [workingCase])

  const setFileUploadStatus = (
    file: CaseFile,
    status: CaseFileStatus,
    state: CaseFileState,
  ) => {
    const files = workingCase.files as CaseFile[]

    if (files) {
      const fileIndexToUpdate = files.findIndex((f) => f.id === file.id)
      files[fileIndexToUpdate] = {
        ...file,
        status,
        state,
      }

      setWorkingCase({ ...workingCase })
    }
  }

  const uploadFilesToCourt = async (files?: TCaseFile[]) => {
    if (files) {
      const xFiles = files as CaseFile[]
      xFiles.forEach(async (file) => {
        try {
          if (file.state !== CaseFileState.STORED_IN_COURT) {
            setFileUploadStatus(file, 'uploading', CaseFileState.STORED_IN_RVG)

            await uploadFileToCourtMutation({
              variables: {
                input: {
                  id: file.id,
                  caseId: workingCase.id,
                },
              },
            })

            setFileUploadStatus(file, 'done', CaseFileState.STORED_IN_COURT)
          }
        } catch (error) {
          setFileUploadStatus(file, 'error', CaseFileState.FAILED_TO_UPLOAD)
        }
      })
    }
  }

  return {
    uploadFilesToCourt,
    uploadState,
  }
}
