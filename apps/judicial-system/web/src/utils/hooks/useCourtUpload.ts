import { useMutation } from '@apollo/client'
import { UploadFileToCourtMutation } from '@island.is/judicial-system-web/graphql'
import {
  Case,
  CaseFile,
  CaseFileState,
  CaseFileStatus,
  UploadState,
} from '@island.is/judicial-system/types'
import { useEffect, useState } from 'react'

export const useCourtUpload = (
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>,
) => {
  const [uploadState, setUploadState] = useState<UploadState>()
  const [uploadFileToCourtMutation] = useMutation(UploadFileToCourtMutation)

  useEffect(() => {
    workingCase.files?.forEach((file) => {
      if (
        file.state === CaseFileState.STORED_IN_COURT &&
        file.status !== 'done'
      ) {
        setFileUploadStatus(file, 'done')
      }
    })

    setUploadState(
      workingCase.files?.some((file) => file.status === 'uploading')
        ? UploadState.UPLOADING
        : workingCase.files?.every(
            (file) => file.state === CaseFileState.STORED_IN_COURT,
          )
        ? UploadState.ALL_UPLOADED
        : workingCase.files?.every(
            (file) => file.state === CaseFileState.STORED_IN_RVG,
          )
        ? UploadState.NONE_UPLOADED
        : workingCase.files?.some((file) => file.status === 'error')
        ? UploadState.SOME_UPLOADED
        : undefined,
    )
  }, [workingCase])

  const setFileUploadStatus = (
    file: CaseFile,
    status: CaseFileStatus,
    state?: CaseFileState,
  ) => {
    if (workingCase.files) {
      const fileIndexToUpdate = workingCase.files.findIndex(
        (f) => f.id === file.id,
      )
      workingCase.files[fileIndexToUpdate] = {
        ...file,
        status: status,
        state: state ?? file.state,
      }

      setWorkingCase({ ...workingCase })
    }
  }

  const uploadFilesToCourt = async (files?: CaseFile[]) => {
    if (files) {
      files.forEach(async (file) => {
        try {
          if (
            workingCase.files &&
            file.state !== CaseFileState.STORED_IN_COURT
          ) {
            setFileUploadStatus(file, 'uploading', CaseFileState.STORED_IN_RVG)

            await uploadFileToCourtMutation({
              variables: {
                input: {
                  id: file.id,
                  caseId: workingCase.id,
                },
              },
            })

            setFileUploadStatus(file, 'done')
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
