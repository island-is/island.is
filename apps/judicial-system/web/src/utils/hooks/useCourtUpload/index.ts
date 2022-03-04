import { ApolloError, useMutation } from '@apollo/client'
import { UploadFileToCourtMutation } from '@island.is/judicial-system-web/graphql'
import {
  Case,
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'
import { useEffect, useState } from 'react'

export type CaseFileStatus =
  | 'not-uploaded'
  | 'broken'
  | 'done'
  | 'error'
  | 'uploading'

export interface CaseFile extends TCaseFile {
  status: CaseFileStatus
}

export enum UploadState {
  ALL_UPLOADED = 'ALL_UPLOADED',
  NONE_CAN_BE_UPLOADED = 'NONE_CAN_BE_UPLOADED',
  NONE_UPLOADED = 'NONE_UPLOADED',
  SOME_NOT_UPLOADED = 'SOME_NOT_UPLOADED',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  UPLOADING = 'UPLOADING',
}

export const useCourtUpload = (
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
) => {
  const [uploadState, setUploadState] = useState<UploadState>()
  const [uploadFileToCourtMutation] = useMutation(UploadFileToCourtMutation)

  useEffect(() => {
    const files = workingCase.caseFiles as CaseFile[]

    files
      ?.filter((file) => file.status !== 'error' && file.status !== 'uploading')
      .forEach((file) => {
        if (
          file.state === CaseFileState.STORED_IN_COURT &&
          file.status !== 'done'
        ) {
          setFileUploadStatus(file, 'done', file.state)
        }

        if (
          file.state === CaseFileState.STORED_IN_RVG &&
          file.status !== 'not-uploaded'
        ) {
          setFileUploadStatus(file, 'not-uploaded', file.state)
        }

        if (
          file.state === CaseFileState.BOKEN_LINK &&
          file.status !== 'broken'
        ) {
          setFileUploadStatus(file, 'broken', file.state)
        }
      })

    setUploadState(
      files?.some((file) => file.status === 'uploading')
        ? UploadState.UPLOADING
        : files?.some((file) => file.status === 'error')
        ? UploadState.UPLOAD_ERROR
        : files?.every((file) => file.status === 'broken')
        ? UploadState.NONE_CAN_BE_UPLOADED
        : files?.every(
            (file) => file.status === 'done' || file.status === 'broken',
          )
        ? UploadState.ALL_UPLOADED
        : files?.every(
            (file) =>
              file.status === 'not-uploaded' || file.status === 'broken',
          )
        ? UploadState.NONE_UPLOADED
        : UploadState.SOME_NOT_UPLOADED,
    )
  }, [workingCase])

  const setFileUploadStatus = (
    file: CaseFile,
    status: CaseFileStatus,
    state: CaseFileState,
  ) => {
    const files = workingCase.caseFiles as CaseFile[]

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
          if (file.state === CaseFileState.STORED_IN_RVG) {
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
          if (
            error instanceof ApolloError &&
            (error as ApolloError).graphQLErrors[0].extensions?.response
              .status === 404
          ) {
            setFileUploadStatus(file, 'broken', CaseFileState.BOKEN_LINK)
          } else {
            setFileUploadStatus(file, 'error', file.state)
          }
        }
      })
    }
  }

  return {
    uploadFilesToCourt,
    uploadState,
  }
}
